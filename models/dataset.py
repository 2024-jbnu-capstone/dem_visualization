import torch
from torch.utils.data import Dataset
import numpy as np
from torchvision import transforms
import os
import rasterio


preprocess_train = transforms.Compose([
    transforms.ToTensor(),                              # 데이터를 Tensor로 변환
    lambda x: x / 2650.7,                               # [0, 6500] -> [0, 1]로 정규화
    lambda x: x.permute(1, 0, 2)                        # (500, 1, 500) -> (1, 500, 500)
])

# tensor.permute(1, 0, 2)

# Postprocess
postprocess = transforms.Compose([
    lambda x: x * 2650.7,
    lambda x: x.squeeze(0),
    lambda x: x.permute(1, 0).numpy()
    
    
])

# postprocess = transforms.Compose([
#     transforms.Lambda(lambda x: x * 2650.7)  # 0~1로 정규화
# ])

# def preprocess(data):
#     min_val = data.min()
#     max_val = data.max()
#     tensor = transforms.ToTensor()(data)
#     tensor = (tensor - min_val) / (max_val - min_val)  # [0, 1]로 정규화
#     return tensor, min_val, max_val

# def postprocess(tensor, min_val, max_val):
#     tensor = tensor * (max_val - min_val) + min_val  # 원래 값으로 변환
#     tensor = tensor.clamp(min_val, max_val)  # 값 제한
#     image = transforms.ToPILImage()(tensor)
#     return image


class VAEDataset(Dataset):
    def __init__(self, data_path, transform=preprocess_train):
        
        # 데이터 형식: (batch, channels, h, w)
        self.data = np.load(data_path)
        
        # if len(self.data.shape) == 3:  # (batch, height, width) 형식일 경우
        #     self.data = self.data[:, None, :, :]  # 채널 차원 추가
        self.transform = transform
        
    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        sample = self.data[idx]
        # print(sample.shape)
        
        if self.transform:
            sample = self.transform(sample)
            # print(sample.shape)
            return sample
        else:
            return torch.tensor(sample, dtype=torch.float32)
        
        
def make_npy_dataset(data_dir, output_path):
    count = 0
    img_data_list = []
    
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".tif"):
                file_path = os.path.join(root, file)
                print(f"Reading file: {file_path}")
                try:
                    with rasterio.open(file_path) as src:
                        data = src.read(1)
                        
                        
                    print(np.array([data]).shape, )
                    if np.array([data]).shape != (1, 500, 500):
                        continue
                    img_data_list.append([data])
                    print(np.array(img_data_list).shape)
                    count += 1
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    print(f"{count} detected.")
    
                    
    np_data = np.array(img_data_list)
    print(np_data.shape)
    np.save(output_path, np_data)
    
    print(f"{np_data.shape} saved at {output_path}")
    
