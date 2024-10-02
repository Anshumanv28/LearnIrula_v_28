import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch.nn.functional as F

# Load the trained model and processor
model_path = './trained_model'  # Adjust to your saved model path
model = Wav2Vec2ForCTC.from_pretrained(model_path)
processor = Wav2Vec2Processor.from_pretrained(model_path)

# Set the model to evaluation mode
model.eval()

# Check if GPU is available and move model to GPU if so
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Function to load audio from file
def load_audio(filename):
    # Load audio using torchaudio
    waveform, sample_rate = torchaudio.load(filename)
    print(f"Loaded audio sample rate: {sample_rate}")  # Check the sample rate
    return waveform, sample_rate

# Function to transcribe loaded audio
def transcribe_audio_from_file(audio, sample_rate):
    # Resample if necessary (to 16000 Hz in this case)
    if sample_rate != 16000:
        audio = torchaudio.functional.resample(audio, sample_rate, 16000)

    # Convert to mono if stereo
    if audio.shape[0] > 1:
        audio = audio.mean(dim=0, keepdim=True)  # Average the channels

    # Final check of the audio shape before processing
    print(f"Audio shape before processing: {audio.shape}")  # Check the shape here

    # Ensure the shape is [1, num_samples]
    audio = audio.squeeze(0)  # Remove the channel dimension
    audio = audio.unsqueeze(0)  # Add a batch dimension, should be [1, num_samples]

    # Check the shape before tokenization
    print(f"Audio shape after reshaping: {audio.shape}")

    # Tokenize the audio (convert to input for model)
    inputs = processor(audio.squeeze(0), sampling_rate=16000, return_tensors="pt").to(device)  # Squeeze here for correct shape

    # Check the shape of inputs
    print(f"Input shape for model: {inputs.input_values.shape}")  # Expecting [1, num_features]

    # Run the model and get logits
    with torch.no_grad():
        logits = model(input_values=inputs.input_values).logits

        # Check the shape of logits
        print(f"Logits shape: {logits.shape}")  # Check logits shape
        print(f"Logits: {logits}")  # Print the logits to see their values

    # Decode the logits to get the predicted text
    predicted_ids = torch.argmax(logits, dim=-1)
    probabilities = F.softmax(logits, dim=-1)  # Get probabilities
    print(f"Predicted IDs: {predicted_ids}")  # Print predicted IDs
    print(f"Probabilities: {probabilities}")  # Print probabilities

    transcription = processor.decode(predicted_ids[0])

    return transcription

# Path to the audio file you want to test
audio_filename = './data/test_audio/Across.wav'  # Specify the path to your .wav file here

# Load the audio file
audio_data, sample_rate = load_audio(audio_filename)

# Test the model on the loaded audio
prediction = transcribe_audio_from_file(audio_data, sample_rate)

print(f"Predicted word: {prediction}")
