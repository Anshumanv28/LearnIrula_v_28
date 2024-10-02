import torchaudio
import torchaudio.transforms as T
import os
import random
import torch

# Directory for original .wav files
original_wav_dir = 'data/converted_audio/'
# Directory for augmented files
augmented_dir = 'data/augmented_audio/'
# Ensure the augmented audio directory exists
os.makedirs(augmented_dir, exist_ok=True)

# Function to add background noise
def add_background_noise(waveform, noise_factor=0.005):
    noise = torch.randn(waveform.size()) * noise_factor
    return waveform + noise

# Function to pitch shift
def pitch_shift(waveform, sample_rate, n_steps=2):
    return T.PitchShift(sample_rate, n_steps=n_steps)(waveform)

# Function to adjust volume
def adjust_volume(waveform, gain_dB):
    # Adjust gain in decibels (gain_type = 'db')
    return T.Vol(gain=gain_dB, gain_type='db')(waveform)

# Function to time stretch
def time_stretch(waveform, rate=1.1):
    return T.Resample(orig_freq=16000, new_freq=int(16000 * rate))(waveform)

# Function to time shift
def time_shift(waveform, shift_max=0.1):
    shift = int(random.uniform(-shift_max, shift_max) * waveform.size(1))
    return waveform[:, shift:] if shift > 0 else waveform[:, :shift]

# List all original .wav files
for wav_file in os.listdir(original_wav_dir):
    if wav_file.endswith('.wav'):
        wav_file_path = os.path.join(original_wav_dir, wav_file)
        
        # Load the original audio
        waveform, sample_rate = torchaudio.load(wav_file_path)

        # Original file
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_original.wav"), waveform, sample_rate)

        # Augmentation 1: Add background noise
        noisy_waveform = add_background_noise(waveform)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_noisy.wav"), noisy_waveform, sample_rate)

        # Augmentation 2: Pitch shift (simulate both male and female speech)
        # Female-like (higher pitch)
        pitch_shifted_waveform_female = pitch_shift(waveform, sample_rate, n_steps=2)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_pitch_shifted_female.wav"), pitch_shifted_waveform_female, sample_rate)
        # Male-like (lower pitch)
        pitch_shifted_waveform_male = pitch_shift(waveform, sample_rate, n_steps=-2)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_pitch_shifted_male.wav"), pitch_shifted_waveform_male, sample_rate)

        # Augmentation 3: Adjust volume
        # Louder
        louder_waveform = adjust_volume(waveform, gain_dB=3)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_louder.wav"), louder_waveform, sample_rate)
        # Quieter
        quieter_waveform = adjust_volume(waveform, gain_dB=-3)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_quieter.wav"), quieter_waveform, sample_rate)

        # Augmentation 4: Time stretch
        stretched_waveform = time_stretch(waveform, rate=1.1)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_stretched.wav"), stretched_waveform, sample_rate)

        # Augmentation 5: Time shift
        shifted_waveform = time_shift(waveform, shift_max=0.1)
        torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_shifted.wav"), shifted_waveform, sample_rate)

        print(f"Processed: {wav_file}")




# import torchaudio
# import torchaudio.transforms as T
# import os
# import random
# import numpy as np

# # Directory for original .wav files
# original_wav_dir = 'data/converted_audio/'
# # Directory for augmented files
# augmented_dir = 'data/augmented_audio/'
# os.makedirs(augmented_dir, exist_ok=True)

# # Function to add background noise
# def add_background_noise(waveform, noise_factor=0.005):
#     noise = torch.randn(waveform.size()) * noise_factor
#     return waveform + noise

# # Function to pitch shift
# def pitch_shift(waveform, sample_rate, n_steps=2):
#     return T.PitchShift(sample_rate, n_steps=n_steps)(waveform)

# # Function to adjust volume
# def adjust_volume(waveform, gain_dB):
#     return T.Vol(gain_dB)(waveform)

# # Function to time stretch
# def time_stretch(waveform, rate=1.1):
#     return T.Resample(orig_freq=16000, new_freq=int(16000 * rate))(waveform)

# # Function to time shift
# def time_shift(waveform, shift_max=0.1):
#     shift = int(random.uniform(-shift_max, shift_max) * waveform.size(1))
#     return waveform[:, shift:] if shift > 0 else waveform[:, :shift]

# # List all original .wav files
# for wav_file in os.listdir(original_wav_dir):
#     if wav_file.endswith('.wav'):
#         wav_file_path = os.path.join(original_wav_dir, wav_file)
        
#         # Load the original audio
#         waveform, sample_rate = torchaudio.load(wav_file_path)

#         # Original file
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_original.wav"), waveform, sample_rate)

#         # Augmentation 1: Add background noise
#         noisy_waveform = add_background_noise(waveform)
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_noisy.wav"), noisy_waveform, sample_rate)

#         # Augmentation 2: Pitch shift
#         pitch_shifted_waveform = pitch_shift(waveform, sample_rate, n_steps=2)
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_pitch_shifted.wav"), pitch_shifted_waveform, sample_rate)

#         # Augmentation 3: Adjust volume
#         louder_waveform = adjust_volume(waveform, gain_dB=3)
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_louder.wav"), louder_waveform, sample_rate)

#         # Augmentation 4: Time stretch
#         stretched_waveform = time_stretch(waveform, rate=1.1)
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_stretched.wav"), stretched_waveform, sample_rate)

#         # Augmentation 5: Time shift
#         shifted_waveform = time_shift(waveform, shift_max=0.1)
#         torchaudio.save(os.path.join(augmented_dir, f"{wav_file[:-4]}_shifted.wav"), shifted_waveform, sample_rate)

#         print(f"Processed: {wav_file}")

