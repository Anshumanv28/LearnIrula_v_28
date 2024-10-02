import pandas as pd
import requests
import os

# Update the path to the CSV file
csv_file_path = '/content/drive/My Drive/Colab_Notebooks/data/a.csv'
df = pd.read_csv(csv_file_path)

# Print the first few rows of the CSV to ensure it's loaded correctly
print(df.head())

# Create a directory to save the audio files
audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/downloaded_audio/'
os.makedirs(audio_dir, exist_ok=True)

# Download each audio file based on 'enWord' and 'audioPath'
for index, row in df.iterrows():
    filename = row['enWord']  # This is the word used as the filename
    url = row['audioPath']  # This is the URL from where the audio file is downloaded
    response = requests.get(url)
    
    if response.status_code == 200:
        # Save the file as .mp3 using 'enWord' as the filename
        with open(os.path.join(audio_dir, f"{filename}.mp3"), 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}.mp3")
    else:
        print(f"Failed to download: {url}")
