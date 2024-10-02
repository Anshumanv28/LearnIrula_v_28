import os
import torch
import torchaudio
import sounddevice as sd
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import numpy as np

# Load the trained model and processor
model_path = './trained_model'  # Adjust to your saved model path
model = Wav2Vec2ForCTC.from_pretrained(model_path)
processor = Wav2Vec2Processor.from_pretrained(model_path)

# Set the model to evaluation mode
model.eval()

# Check if GPU is available and move model to GPU if so
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Define output folder for recorded audio
output_folder = './data/recorded_audio'  # Adjust to your desired output path
os.makedirs(output_folder, exist_ok=True)  # Create the folder if it doesn't exist

# Function to record audio using the microphone
def record_audio(duration=3, fs=16000, filename=None):
    print(f"Recording for {duration} seconds...")
    audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32')
    sd.wait()  # Wait until recording is finished

    # Save the recorded audio to a file if a filename is provided
    if filename:
        audio_tensor = torch.tensor(audio)  # Convert audio to tensor
        audio_tensor = audio_tensor.view(1, -1)  # Reshape to 2D tensor (1, N)
        torchaudio.save(filename, audio_tensor, fs)
        print(f"Audio saved to {filename}")

    return np.squeeze(audio)

# Function to transcribe recorded audio
def transcribe_audio(audio):
    # Tokenize the audio (convert to input for model)
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True).to(device)

    # Run the model and get logits
    with torch.no_grad():
        logits = model(input_values=inputs.input_values).logits
        print("Logits:", logits)  # Debugging line to check logits

    # Decode the logits to get the predicted text
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.decode(predicted_ids[0])

    return transcription

# Record the audio from the microphone and save it to a file
audio_filename = os.path.join(output_folder, "recorded_audio.wav")  # Specify your desired file name here
audio_data = record_audio(duration=5, fs=16000, filename=audio_filename)  # Increase duration for testing

# Debug: Check the recorded audio data
print("Audio data shape:", audio_data.shape)
print("Audio data sample:", audio_data[:10])  # Print first 10 samples for reference

# Test the model on the recorded audio
prediction = transcribe_audio(audio_data)

print(f"Predicted word: {prediction}")
