import os
import pandas as pd
import torch
import torchaudio
from torch.utils.data import DataLoader, Dataset
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

# ---------------------------------------------------
# Section 1: Dataset Class Definition
# ---------------------------------------------------
class AudioDataset(Dataset):
    def __init__(self, audio_dir, labels):
        """
        Initializes the dataset with the directory of audio files and their corresponding labels.
        Args:
        - audio_dir (str): Directory where audio files are stored.
        - labels (list): List of strings corresponding to the labels for each audio file.
        """
        self.audio_dir = audio_dir
        self.labels = labels  # list of labels (strings)

    def __len__(self):
        """
        Returns the number of samples in the dataset.
        """
        return len(self.labels)

    def __getitem__(self, idx):
        """
        Retrieves an audio file and its corresponding label.
        Args:
        - idx (int): Index of the sample.

        Returns:
        - waveform (Tensor): The audio waveform tensor.
        - sample_rate (int): The sample rate of the audio.
        - label (str): The label corresponding to the audio file.
        """
        # Get the label for the current index
        label = self.labels[idx]  # Use the label string

        # Build the audio file path using the label (assuming filename matches the label)
        audio_path = os.path.join(self.audio_dir, f"{label}.wav")

        # Load the audio waveform and sample rate
        waveform, sample_rate = torchaudio.load(audio_path)

        # Ensure audio is mono by averaging stereo channels (if needed)
        if waveform.shape[0] > 1:  # More than 1 channel
            waveform = torch.mean(waveform, dim=0, keepdim=True)  # Convert to mono

        # Pad or truncate the waveform to a fixed size (160,000 samples = 10 seconds at 16kHz)
        target_length = 160000  # Target length (for 10s of audio at 16kHz)
        original_size = waveform.size(1)

        if original_size < target_length:
            # Pad the waveform if it's shorter than the target length
            padding = target_length - original_size
            waveform = torch.nn.functional.pad(waveform, (0, padding))  # Right pad
        else:
            # Truncate the waveform if it's longer than the target length
            waveform = waveform[:, :target_length]

        # Debugging: Print the file being processed and its original/new size
        print(f"Processed: {audio_path}, Original size: {original_size}, New size: {waveform.size(1)}")

        return waveform, sample_rate, label


def custom_collate_fn(batch):
    """
    Custom collate function to handle variable-length sequences in a batch.
    Args:
    - batch: List of samples from the dataset.

    Returns:
    - waveforms_padded (Tensor): Padded audio waveforms.
    - sample_rates (tuple): Original sample rates of the audio files.
    - labels (tuple): Corresponding labels for each sample.
    """
    # Unpack the batch into separate lists
    waveforms, sample_rates, labels = zip(*batch)

    # Pad the waveforms in the batch to the same length
    waveforms_padded = torch.nn.utils.rnn.pad_sequence(waveforms, batch_first=True)

    return waveforms_padded, sample_rates, labels

# ---------------------------------------------------
# Section 2: DataLoader Creation
# ---------------------------------------------------
def create_dataloader(csv_file_path, audio_dir, batch_size=4):
    """
    Creates a DataLoader for the dataset.
    Args:
    - csv_file_path (str): Path to the CSV file containing labels.
    - audio_dir (str): Directory where the audio files are stored.
    - batch_size (int): Number of samples per batch.

    Returns:
    - dataloader: DataLoader object for the dataset.
    """
    # Load labels from the CSV file
    df = pd.read_csv(csv_file_path)

    # Convert the 'enWord' column to a list of strings
    labels = df['enWord'].tolist()

    # Create the dataset
    dataset = AudioDataset(audio_dir, labels)

    # Create a DataLoader with the custom collate function
    dataloader = DataLoader(dataset, batch_size=batch_size, collate_fn=custom_collate_fn, shuffle=True)
    
    return dataloader

# ---------------------------------------------------
# Section 3: Training Loop
# ---------------------------------------------------
def train_model(dataloader, processor, model, device, num_epochs=3, learning_rate=1e-5):
    """
    Trains the Wav2Vec2 model on the provided dataset.
    Args:
    - dataloader: DataLoader object for the dataset.
    - processor: Wav2Vec2Processor object for feature extraction and tokenization.
    - model: Wav2Vec2ForCTC model object.
    - device: Device to perform training (CPU or GPU).
    - num_epochs (int): Number of epochs to train.
    - learning_rate (float): Learning rate for the optimizer.
    """
    # Define the optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)

    # Set model to training mode
    model.train()

    # Training loop
    for epoch in range(num_epochs):
        for batch in dataloader:
            # Unpack the batch
            waveforms, sample_rates, labels = batch

            # Move the waveforms to the appropriate device
            waveforms = waveforms.to(device)

            # Tokenize the inputs (convert raw audio waveforms to model-compatible format)
            inputs = processor(waveforms.squeeze().numpy(), sampling_rate=16000, return_tensors="pt", padding=True).input_values.to(device)

            # Convert the labels to tokenized form (this may need adjustment based on label format)
            with processor.as_target_processor():
                labels = processor(labels, return_tensors="pt", padding=True).input_ids.to(device)

            # Forward pass
            outputs = model(input_values=inputs, labels=labels)
            loss = outputs.loss

            # Backward pass and optimization
            optimizer.zero_grad()  # Clear gradients
            loss.backward()        # Backpropagation
            optimizer.step()        # Update model weights

            # Print loss for this batch
            print(f"Epoch: {epoch + 1}, Loss: {loss.item()}")

# ---------------------------------------------------
# Section 4: Main Function (Setup and Execution)
# ---------------------------------------------------
if __name__ == "__main__":
    # Paths to CSV file and audio directory
    csv_file_path = '/content/drive/My Drive/Colab_Notebooks/data/a.csv'  # Update as needed
    audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/converted_audio/'  # Update as needed

    # Create DataLoader
    dataloader = create_dataloader(csv_file_path, audio_dir, batch_size=4)

    # Load the pre-trained Wav2Vec2Processor and Wav2Vec2ForCTC model
    processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
    model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

    # Move the model to the appropriate device (GPU if available, otherwise CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Train the model
    train_model(dataloader, processor, model, device, num_epochs=3, learning_rate=1e-5)

    # Save the trained model and processor
    model.save_pretrained('./trained_model')
    processor.save_pretrained('./trained_model')
