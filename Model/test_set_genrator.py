import os
import random
import shutil

def create_test_set(augmented_data_dir, test_set_dir, test_size=0.2):
    if not os.path.exists(test_set_dir):
        os.makedirs(test_set_dir)

    all_files = os.listdir(augmented_data_dir)
    test_count = int(len(all_files) * test_size)

    # Randomly select test_count files without replacement
    test_files = random.sample(all_files, test_count)

    # Copy selected files to the test set directory
    for file in test_files:
        src_file = os.path.join(augmented_data_dir, file)
        dest_file = os.path.join(test_set_dir, file)
        shutil.copy(src_file, dest_file)

    return test_files

# Example usage
augmented_data_dir = '/content/drive/My Drive/Colab_Notebooks/data/augmented_audio/'  # Update to your augmented data path
test_set_dir = '/content/drive/My Drive/Colab_Notebooks/data/test_set/'  # Specify your test set path
test_files = create_test_set(augmented_data_dir, test_set_dir)

print("Selected test files:", test_files)
