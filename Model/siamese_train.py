# import os
# import pandas as pd
# import torch
# import torchaudio
# from torch.utils.data import DataLoader, Dataset
# from torch import nn, optim
# import random
# from torch.cuda.amp import GradScaler, autocast  # Add these imports

# # ---------------------------------------------------
# # Section 1: Dataset Class Definition
# # ---------------------------------------------------
# class AudioDataset(Dataset):
#     def __init__(self, audio_dir, labels):
#         self.audio_dir = audio_dir
#         self.labels = labels

#     def __len__(self):
#         return len(self.labels)

#     def __getitem__(self, idx):
#         label = self.labels[idx]
#         audio_path = os.path.join(self.audio_dir, f"{label}.wav")

#         waveform, sample_rate = torchaudio.load(audio_path)

#         if waveform.shape[0] > 1:
#             waveform = torch.mean(waveform, dim=0, keepdim=True)

#         target_length = 160000
#         original_size = waveform.size(1)

#         if original_size < target_length:
#             padding = target_length - original_size
#             waveform = torch.nn.functional.pad(waveform, (0, padding))
#         else:
#             waveform = waveform[:, :target_length]

#         return waveform, label

# # Dataset for Pairs
# class PairDataset(Dataset):
#     def __init__(self, dataset, pairs):
#         self.dataset = dataset
#         self.pairs = pairs

#     def __len__(self):
#         return len(self.pairs)

#     def __getitem__(self, idx):
#         label1, label2 = self.pairs[idx]
#         waveform1, _ = self.dataset[self.dataset.labels.index(label1)]
#         waveform2, _ = self.dataset[self.dataset.labels.index(label2)]
#         return waveform1, waveform2, (label1 == label2)

# def create_pairs(labels):
#     pairs = []
#     for label in labels:
#         # Create pairs (same class and different class)
#         pairs.append((label, label))  # Same class (positive pair)

#         # Randomly select a different label for a negative pair
#         different_label = random.choice([l for l in labels if l != label])
#         pairs.append((label, different_label))  # Different class (negative pair)
#     return pairs

# # ---------------------------------------------------
# # Section 2: Siamese Network Definition
# # ---------------------------------------------------
# class SiameseNetwork(nn.Module):
#     def __init__(self):
#         super(SiameseNetwork, self).__init__()
#         self.conv1 = nn.Conv1d(1, 32, kernel_size=5)
#         self.pool = nn.MaxPool1d(2)
#         self.conv2 = nn.Conv1d(32, 64, kernel_size=5)

#         # Get input size for fully connected layers
#         self.fc1_input_size = self._get_fc1_input_size()
#         self.fc1 = nn.Linear(self.fc1_input_size, 256)
#         self.fc2 = nn.Linear(256, 128)

#     def _get_fc1_input_size(self):
#         # Dummy input to determine the output size of conv layers
#         x = torch.zeros(1, 1, 160000)  # 1 sample, 1 channel, input length
#         x = self.pool(nn.functional.relu(self.conv1(x)))
#         x = self.pool(nn.functional.relu(self.conv2(x)))
#         return x.numel()  # Total number of elements in the output tensor

#     def forward_one(self, x):
#         x = self.pool(nn.functional.relu(self.conv1(x)))
#         x = self.pool(nn.functional.relu(self.conv2(x)))
#         print(f"Shape after convolution: {x.shape}")  # Debugging line
#         x = x.view(x.size(0), -1)  # Flatten
#         x = nn.functional.relu(self.fc1(x))
#         x = self.fc2(x)
#         return x

#     def forward(self, input1, input2):
#         output1 = self.forward_one(input1)
#         output2 = self.forward_one(input2)
#         return output1, output2

# # Contrastive Loss Function
# def contrastive_loss(output1, output2, label):
#     # Compute the squared Euclidean distance
#     euclidean_distance = nn.functional.pairwise_distance(output1, output2)
#     # Calculate the loss
#     loss = (1 - label) * torch.pow(euclidean_distance, 2) + \
#            (label) * torch.pow(torch.clamp(1 - euclidean_distance, min=0.0), 2)
#     return loss.mean()

# # ---------------------------------------------------
# # Section 3: Training Loop
# # ---------------------------------------------------
# # def train_model(dataloader, model, device, num_epochs=3, learning_rate=1e-5):
# #     optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# #     model.train()

# #     for epoch in range(num_epochs):
# #         total_loss = 0
# #         for waveform1, waveform2, labels in dataloader:
# #             waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
# #             labels = labels.float().to(device)

# #             optimizer.zero_grad()
# #             output1, output2 = model(waveform1, waveform2)

# #             # Compute the loss
# #             loss = contrastive_loss(output1, output2, labels)
# #             loss.backward()
# #             optimizer.step()

# #             total_loss += loss.item()

# #         print(f"Epoch: {epoch + 1}, Loss: {total_loss / len(dataloader)}")
# # ---------------------------------------------------
# # Section 3: Training Loop
# # ---------------------------------------------------
# def train_model(dataloader, model, device, num_epochs=3, learning_rate=1e-5):
#     optimizer = optim.Adam(model.parameters(), lr=learning_rate)
#     scaler = GradScaler()  # Initialize the GradScaler for mixed precision

#     model.train()

#     for epoch in range(num_epochs):
#         total_loss = 0
#         for waveform1, waveform2, labels in dataloader:
#             waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
#             labels = labels.float().to(device)

#             optimizer.zero_grad()

#             with autocast():  # Mixed precision context
#                 output1, output2 = model(waveform1, waveform2)
#                 loss = contrastive_loss(output1, output2, labels)

#             scaler.scale(loss).backward()  # Scale the loss
#             scaler.step(optimizer)  # Update weights
#             scaler.update()  # Update the scale for next iteration

#             total_loss += loss.item()

#         print(f"Epoch: {epoch + 1}, Loss: {total_loss / len(dataloader)}")

#         # Clear cache to free up memory
#         torch.cuda.empty_cache()

# # ---------------------------------------------------
# # Section 4: Main Function (Setup and Execution)
# # ---------------------------------------------------
# if __name__ == "__main__":
#     csv_file_path = '/content/drive/My Drive/Colab_Notebooks/data/a.csv'  # Update as needed
#     audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/converted_audio/'  # Update as needed

#     df = pd.read_csv(csv_file_path)
#     labels = df['enWord'].tolist()

#     # Create dataset and pairs
#     dataset = AudioDataset(audio_dir, labels)
#     pairs = create_pairs(labels)  # Create pairs for Siamese Network
#     pair_dataset = PairDataset(dataset, pairs)  # Create PairDataset
#     dataloader = DataLoader(pair_dataset, batch_size=4, shuffle=True)

#     # Initialize the Siamese Network
#     model = SiameseNetwork()
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     model.to(device)

#     # Train the model
#     train_model(dataloader, model, device, num_epochs=3, learning_rate=1e-5)

#     # Save the trained model
#     torch.save(model.state_dict(), './trained_siamese_model.pth')

###############################################################################################################################
###############################################################################################################################
###############################################################################################################################
###############################################################################################################################
###############################################################################################################################


# import os
# import pandas as pd
# import torch
# import torchaudio
# from torch.utils.data import DataLoader, Dataset, random_split
# from torch import nn, optim
# import random
# from torch.cuda.amp import GradScaler, autocast  # Mixed precision imports

# # ---------------------------------------------------
# # Section 1: Dataset Class Definition
# # ---------------------------------------------------
# class AudioDataset(Dataset):
#     def __init__(self, audio_dir, labels):
#         self.audio_dir = audio_dir
#         self.labels = labels

#     def __len__(self):
#         return len(self.labels)

#     def __getitem__(self, idx):
#         label = self.labels[idx]
#         audio_path = os.path.join(self.audio_dir, f"{label}.wav")

#         waveform, sample_rate = torchaudio.load(audio_path)

#         if waveform.shape[0] > 1:
#             waveform = torch.mean(waveform, dim=0, keepdim=True)

#         target_length = 160000
#         original_size = waveform.size(1)

#         if original_size < target_length:
#             padding = target_length - original_size
#             waveform = torch.nn.functional.pad(waveform, (0, padding))
#         else:
#             waveform = waveform[:, :target_length]

#         return waveform, label

# # Dataset for Pairs
# class PairDataset(Dataset):
#     def __init__(self, dataset, pairs):
#         self.dataset = dataset
#         self.pairs = pairs

#     def __len__(self):
#         return len(self.pairs)

#     def __getitem__(self, idx):
#         label1, label2 = self.pairs[idx]
#         waveform1, _ = self.dataset[self.dataset.labels.index(label1)]
#         waveform2, _ = self.dataset[self.dataset.labels.index(label2)]
#         return waveform1, waveform2, (label1 == label2)

# def create_pairs(labels):
#     pairs = []
#     for label in labels:
#         pairs.append((label, label))  # Same class (positive pair)
#         different_label = random.choice([l for l in labels if l != label])
#         pairs.append((label, different_label))  # Different class (negative pair)
#     return pairs

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

# # Contrastive Loss Function
# def contrastive_loss(output1, output2, label):
#     euclidean_distance = nn.functional.pairwise_distance(output1, output2)
#     loss = (1-label) * torch.pow(euclidean_distance, 2) + \
#            (label) * torch.pow(torch.clamp(1 - euclidean_distance, min=0.0), 2)
#     return loss.mean()

# # ---------------------------------------------------
# # Section 3: Training Loop with Validation
# # ---------------------------------------------------
# def train_model(train_loader, val_loader, model, device, num_epochs=5, learning_rate=1e-4):
#     optimizer = optim.Adam(model.parameters(), lr=learning_rate)
#     scaler = GradScaler()  # Initialize the GradScaler for mixed precision

#     model.train()

#     for epoch in range(num_epochs):
#         total_loss = 0
#         for waveform1, waveform2, labels in train_loader:
#             waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
#             labels = labels.float().to(device)

#             optimizer.zero_grad()

#             with autocast():  # Mixed precision context
#                 output1, output2 = model(waveform1, waveform2)
#                 loss = contrastive_loss(output1, output2, labels)

#             scaler.scale(loss).backward()  # Scale the loss
#             scaler.step(optimizer)  # Update weights
#             scaler.update()  # Update the scale for next iteration

#             total_loss += loss.item()

#         print(f"Epoch: {epoch + 1}, Training Loss: {total_loss / len(train_loader)}")

#         # Validation Phase
#         model.eval()
#         total_val_loss = 0
#         with torch.no_grad():
#             for waveform1, waveform2, labels in val_loader:
#                 waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
#                 labels = labels.float().to(device)

#                 output1, output2 = model(waveform1, waveform2)
#                 val_loss = contrastive_loss(output1, output2, labels)

#                 total_val_loss += val_loss.item()

#         print(f"Epoch: {epoch + 1}, Validation Loss: {total_val_loss / len(val_loader)}")
#         model.train()  # Set the model back to training mode

#         # Clear cache to free up memory
#         torch.cuda.empty_cache()

# # ---------------------------------------------------
# # Section 4: Main Function (Setup and Execution)
# # ---------------------------------------------------
# if __name__ == "__main__":
#     csv_file_path = '/content/drive/My Drive/Colab_Notebooks/data/a.csv'
#     audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/converted_audio/'

#     df = pd.read_csv(csv_file_path)
#     labels = df['enWord'].tolist()

#     # Create dataset and pairs
#     dataset = AudioDataset(audio_dir, labels)
#     pairs = create_pairs(labels)
#     pair_dataset = PairDataset(dataset, pairs)

#     # Split the dataset into training and validation sets
#     train_size = int(0.8 * len(pair_dataset))
#     val_size = len(pair_dataset) - train_size
#     train_dataset, val_dataset = random_split(pair_dataset, [train_size, val_size])

#     train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True)
#     val_loader = DataLoader(val_dataset, batch_size=2, shuffle=False)

#     # Initialize the Siamese Network
#     model = SiameseNetwork()
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     model.to(device)

#     # Train the model
#     train_model(train_loader, val_loader, model, device, num_epochs=5, learning_rate=1e-4)

#     # Save the trained model
#     torch.save(model.state_dict(), './trained_siamese_model.pth')


################################################################################################################
################################################################################################################
################################################################################################################
################################################################################################################

import os
import pandas as pd
import torch
import torchaudio
from torch.utils.data import DataLoader, Dataset, random_split
from torch import nn, optim
import random
from torch.cuda.amp import GradScaler, autocast  # Mixed precision imports

# ---------------------------------------------------
# Section 1: Dataset Class Definition
# ---------------------------------------------------
class AudioDataset(Dataset):
    def __init__(self, audio_dir, labels):
        self.audio_dir = audio_dir
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        label = self.labels[idx]
        audio_path = os.path.join(self.audio_dir, f"{label}.wav")

        waveform, sample_rate = torchaudio.load(audio_path)

        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        target_length = 160000
        original_size = waveform.size(1)

        if original_size < target_length:
            padding = target_length - original_size
            waveform = torch.nn.functional.pad(waveform, (0, padding))
        else:
            waveform = waveform[:, :target_length]

        return waveform, label

# Dataset for Pairs
class PairDataset(Dataset):
    def __init__(self, dataset, pairs):
        self.dataset = dataset
        self.pairs = pairs

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        label1, label2 = self.pairs[idx]
        waveform1, _ = self.dataset[self.dataset.labels.index(label1)]
        waveform2, _ = self.dataset[self.dataset.labels.index(label2)]
        return waveform1, waveform2, (label1 == label2)

def create_pairs(labels):
    pairs = []
    for label in labels:
        pairs.append((label, label))  # Same class (positive pair)
        different_label = random.choice([l for l in labels if l != label])
        pairs.append((label, different_label))  # Different class (negative pair)
    return pairs

# ---------------------------------------------------
# Section 2: Siamese Network Definition
# ---------------------------------------------------
class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        self.conv1 = nn.Conv1d(1, 32, kernel_size=5)
        self.pool = nn.MaxPool1d(2)
        self.conv2 = nn.Conv1d(32, 64, kernel_size=5)

        self.dropout = nn.Dropout(0.5)  # Add dropout layer

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
        x = self.dropout(x)  # Apply dropout
        x = self.fc2(x)
        return x

    def forward(self, input1, input2):
        output1 = self.forward_one(input1)
        output2 = self.forward_one(input2)
        return output1, output2

# Contrastive Loss Function
def contrastive_loss(output1, output2, label):
    euclidean_distance = nn.functional.pairwise_distance(output1, output2)
    loss = (1-label) * torch.pow(euclidean_distance, 2) + \
           (label) * torch.pow(torch.clamp(1 - euclidean_distance, min=0.0), 2)
    return loss.mean()

# ---------------------------------------------------
# Section 3: Training Loop with Validation
# ---------------------------------------------------
def train_model(train_loader, val_loader, model, device, num_epochs=10, learning_rate=1e-6):  # Increased epochs and reduced learning rate
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scaler = GradScaler()  # Initialize the GradScaler for mixed precision

    model.train()
    best_val_loss = float('inf')
    patience = 3  # Early stopping patience
    patience_counter = 0

    for epoch in range(num_epochs):
        total_loss = 0
        for waveform1, waveform2, labels in train_loader:
            waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
            labels = labels.float().to(device)

            optimizer.zero_grad()

            with autocast():  # Mixed precision context
                output1, output2 = model(waveform1, waveform2)
                loss = contrastive_loss(output1, output2, labels)

            scaler.scale(loss).backward()  # Scale the loss
            scaler.step(optimizer)  # Update weights
            scaler.update()  # Update the scale for next iteration

            total_loss += loss.item()

        print(f"Epoch: {epoch + 1}, Training Loss: {total_loss / len(train_loader)}")

        # Validation Phase
        model.eval()
        total_val_loss = 0
        with torch.no_grad():
            for waveform1, waveform2, labels in val_loader:
                waveform1, waveform2 = waveform1.to(device), waveform2.to(device)
                labels = labels.float().to(device)

                output1, output2 = model(waveform1, waveform2)
                val_loss = contrastive_loss(output1, output2, labels)

                total_val_loss += val_loss.item()

        print(f"Epoch: {epoch + 1}, Validation Loss: {total_val_loss / len(val_loader)}")

        # Early stopping logic
        if total_val_loss < best_val_loss:
            best_val_loss = total_val_loss
            patience_counter = 0
            # Save model checkpoint if desired
            torch.save(model.state_dict(), './best_model.pth')
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print("Early stopping triggered")
                break

        model.train()  # Set the model back to training mode

        # Clear cache to free up memory
        torch.cuda.empty_cache()

# ---------------------------------------------------
# Section 4: Main Function (Setup and Execution)
# ---------------------------------------------------
if __name__ == "__main__":
    csv_file_path = '/content/drive/My Drive/Colab_Notebooks/data/a.csv'
    audio_dir = '/content/drive/My Drive/Colab_Notebooks/data/converted_audio/'

    df = pd.read_csv(csv_file_path)
    labels = df['enWord'].tolist()

    # Create dataset and pairs
    dataset = AudioDataset(audio_dir, labels)
    pairs = create_pairs(labels)
    pair_dataset = PairDataset(dataset, pairs)

    # Split the dataset into training and validation sets
    train_size = int(0.8 * len(pair_dataset))
    val_size = len(pair_dataset) - train_size
    train_dataset, val_dataset = random_split(pair_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=2, shuffle=False)

    # Initialize the Siamese Network
    model = SiameseNetwork()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Train the model
    train_model(train_loader, val_loader, model, device)

    # Save the trained model
    torch.save(model.state_dict(), './trained_siamese_model.pth')
