# import os
# import torch
# import torchaudio
# from torch.utils.data import DataLoader, Dataset
# from torch import nn

# # ---------------------------------------------------
# # Section 1: Dataset Class Definition for Test Set (Returns Pairs)
# # ---------------------------------------------------
# class AudioTestDataset(Dataset):
#     def __init__(self, audio_dir):
#         self.audio_dir = audio_dir
#         self.audio_files = [f for f in os.listdir(audio_dir) if f.endswith(".wav")]

#     def __len__(self):
#         # Dataset returns pairs, so length is based on combinations of pairs
#         return len(self.audio_files) // 2  # Assumes pairs for now

#     def __getitem__(self, idx):
#         # Get two audio files at random (pairs)
#         audio_file1 = self.audio_files[idx]
#         audio_file2 = self.audio_files[(idx + 1) % len(self.audio_files)]  # Choose the next file as a pair

#         # Extract labels (assuming files are named label1.wav, label2.wav, etc.)
#         label1 = audio_file1.split('.')[0]
#         label2 = audio_file2.split('.')[0]
#         label = int(label1 == label2)  # Label 1 if same, 0 otherwise

#         # Load the audio files
#         audio_path1 = os.path.join(self.audio_dir, audio_file1)
#         audio_path2 = os.path.join(self.audio_dir, audio_file2)

#         waveform1, sample_rate1 = torchaudio.load(audio_path1)
#         waveform2, sample_rate2 = torchaudio.load(audio_path2)

#         # Convert stereo to mono if necessary
#         if waveform1.shape[0] > 1:
#             waveform1 = torch.mean(waveform1, dim=0, keepdim=True)
#         if waveform2.shape[0] > 1:
#             waveform2 = torch.mean(waveform2, dim=0, keepdim=True)

#         # Ensure consistent length (padding/cropping)
#         target_length = 160000
#         waveform1 = self._process_waveform(waveform1, target_length)
#         waveform2 = self._process_waveform(waveform2, target_length)

#         return waveform1, waveform2, label

#     def _process_waveform(self, waveform, target_length):
#         original_size = waveform.size(1)
#         if original_size < target_length:
#             padding = target_length - original_size
#             waveform = torch.nn.functional.pad(waveform, (0, padding))
#         else:
#             waveform = waveform[:, :target_length]
#         return waveform

# # ---------------------------------------------------
# # Section 2: Siamese Network Definition
# # ---------------------------------------------------
# class SiameseNetwork(nn.Module):
#     def __init__(self):
#         super(SiameseNetwork, self).__init__()
#         self.conv1 = nn.Conv1d(1, 32, kernel_size=5)
#         self.pool = nn.MaxPool1d(2)
#         self.conv2 = nn.Conv1d(32, 64, kernel_size=5)

#         self.fc1_input_size = self._get_fc1_input_size()
#         self.fc1 = nn.Linear(self.fc1_input_size, 256)
#         self.fc2 = nn.Linear(256, 128)

#     def _get_fc1_input_size(self):
#         x = torch.zeros(1, 1, 160000)
#         x = self.pool(nn.functional.relu(self.conv1(x)))
#         x = self.pool(nn.functional.relu(self.conv2(x)))
#         return x.numel()

#     def forward_one(self, x):
#         x = self.pool(nn.functional.relu(self.conv1(x)))
#         x = self.pool(nn.functional.relu(self.conv2(x)))
#         x = x.view(x.size(0), -1)
#         x = nn.functional.relu(self.fc1(x))
#         x = self.fc2(x)
#         return x

#     def forward(self, input1, input2):
#         output1 = self.forward_one(input1)
#         output2 = self.forward_one(input2)
#         return output1, output2

# # ---------------------------------------------------
# # Section 3: Testing the Model on the Test Set
# # ---------------------------------------------------
# def test_model(test_loader, model, device):
#     model.eval()
#     total_correct = 0
#     total_samples = 0

#     with torch.no_grad():
#         for waveform1, waveform2, labels in test_loader:
#             waveform1, waveform2, labels = waveform1.to(device), waveform2.to(device), labels.to(device)

#             output1, output2 = model(waveform1, waveform2)
#             distances = torch.nn.functional.pairwise_distance(output1, output2)

#             # Set a lower threshold (try 0.1 or lower based on distance range)
#             threshold = 0.05
#             predictions = (distances < threshold).float()

#             print(f"Distances: {distances}")
#             print(f"Labels: {labels}")
#             print(f"Predictions: {predictions}")

#             total_correct += (predictions == labels).sum().item()
#             total_samples += labels.size(0)

#     accuracy = total_correct / total_samples
#     print(f"Test Accuracy: {accuracy * 100:.2f}%")



# # ---------------------------------------------------
# # Section 4: Main Execution Block
# # ---------------------------------------------------
# if __name__ == "__main__":
#     test_audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/test_set/'  # Update to your test set path

#     # Create test dataset and loader
#     test_dataset = AudioTestDataset(test_audio_dir)
#     test_loader = DataLoader(test_dataset, batch_size=2, shuffle=False)

#     # Load the trained model
#     model = SiameseNetwork()
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#     # Load model and map to correct device
#     model.load_state_dict(torch.load('./trained_siamese_model.pth', map_location=device))
#     model.to(device)

#     # Test the model
#     test_model(test_loader, model, device)


import os
import random
import torch
import torchaudio
from torch.utils.data import DataLoader, Dataset
from torch import nn

# ---------------------------------------------------
# Section 1: Dataset Class Definition for Test Set (Returns Pairs)
# ---------------------------------------------------
class AudioTestDataset(Dataset):
    def __init__(self, audio_dir):
        self.audio_dir = audio_dir
        self.audio_files = [f for f in os.listdir(audio_dir) if f.endswith(".wav")]

    def __len__(self):
        return len(self.audio_files)

    def __getitem__(self, idx):
        # Randomly select two audio files for testing
        audio_file1 = random.choice(self.audio_files)
        audio_file2 = random.choice(self.audio_files)

        # Extract labels
        label1 = audio_file1.split('.')[0]
        label2 = audio_file2.split('.')[0]
        label = int(label1 == label2)

        # Load the audio files
        audio_path1 = os.path.join(self.audio_dir, audio_file1)
        audio_path2 = os.path.join(self.audio_dir, audio_file2)

        waveform1, sample_rate1 = torchaudio.load(audio_path1)
        waveform2, sample_rate2 = torchaudio.load(audio_path2)

        # Convert stereo to mono if necessary
        if waveform1.shape[0] > 1:
            waveform1 = torch.mean(waveform1, dim=0, keepdim=True)
        if waveform2.shape[0] > 1:
            waveform2 = torch.mean(waveform2, dim=0, keepdim=True)

        # Ensure consistent length (padding/cropping)
        target_length = 160000
        waveform1 = self._process_waveform(waveform1, target_length)
        waveform2 = self._process_waveform(waveform2, target_length)

        return waveform1, waveform2, label

    def _process_waveform(self, waveform, target_length):
        original_size = waveform.size(1)
        if original_size < target_length:
            padding = target_length - original_size
            waveform = torch.nn.functional.pad(waveform, (0, padding))
        else:
            waveform = waveform[:, :target_length]
        return waveform

# ---------------------------------------------------
# Section 2: Siamese Network Definition
# ---------------------------------------------------
class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        self.conv1 = nn.Conv1d(1, 32, kernel_size=5)
        self.pool = nn.MaxPool1d(2)
        self.conv2 = nn.Conv1d(32, 64, kernel_size=5)

        self.fc1_input_size = self._get_fc1_input_size()
        self.fc1 = nn.Linear(self.fc1_input_size, 256)
        self.fc2 = nn.Linear(256, 128)

    def _get_fc1_input_size(self):
        x = torch.zeros(1, 1, 160000)
        x = self.pool(nn.functional.relu(self.conv1(x)))
        x = self.pool(nn.functional.relu(self.conv2(x)))
        return x.numel()

    def forward_one(self, x):
        x = self.pool(nn.functional.relu(self.conv1(x)))
        x = self.pool(nn.functional.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = nn.functional.relu(self.fc1(x))
        x = self.fc2(x)
        return x

    def forward(self, input1, input2):
        output1 = self.forward_one(input1)
        output2 = self.forward_one(input2)
        return output1, output2

# ---------------------------------------------------
# Section 3: Testing the Model on the Test Set
# ---------------------------------------------------
def test_model(test_loader, model, device):
    model.eval()
    total_correct = 0
    total_samples = 0

    with torch.no_grad():
        all_distances = []
        all_labels = []
        
        for waveform1, waveform2, labels in test_loader:
            waveform1, waveform2, labels = waveform1.to(device), waveform2.to(device), labels.to(device)

            output1, output2 = model(waveform1, waveform2)
            distances = torch.nn.functional.pairwise_distance(output1, output2)

            # Set a threshold (this should ideally be fine-tuned based on validation data)
            threshold = 0.0225         #best results on testing with 0.02 by far 0.025
            predictions = (distances < threshold).float()

            # Collect distances and labels for analysis
            all_distances.extend(distances.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

            # Logging for insights
            print(f"Distances: {distances.cpu().numpy()}")
            print(f"Labels: {labels.cpu().numpy()}")
            print(f"Predictions: {predictions.cpu().numpy()}")

            total_correct += (predictions == labels).sum().item()
            total_samples += labels.size(0)

    accuracy = total_correct / total_samples
    print(f"Test Accuracy: {accuracy * 100:.2f}%")

# ---------------------------------------------------
# Section 4: Main Execution Block
# ---------------------------------------------------
if __name__ == "__main__":
    test_audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/test_set/'  # Update to your test set path

    # Create test dataset and loader
    test_dataset = AudioTestDataset(test_audio_dir)
    test_loader = DataLoader(test_dataset, batch_size=2, shuffle=False)

    # Load the trained model
    model = SiameseNetwork()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model and map to correct device
    model.load_state_dict(torch.load('./trained_siamese_model.pth', map_location=device))
    model.to(device)

    # Test the model
    test_model(test_loader, model, device)
