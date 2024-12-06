import rasterio
import numpy as np
from models.vae_net import ConvVAE50x50
import torch
from models.dataset import preprocess_train, postprocess
import os
import shutil

# 결과 디렉터리
output_dir = "./outputs"
os.makedirs(output_dir, exist_ok=True)

# 테스트 데이터셋 경로
test_data_path = "./dem_500/산/dem_tile_10_14.tif"
# 모델 체크포인트 경로
model_path = "./epoch_1001.pth"

# 모델 불러오기
model = ConvVAE50x50(1)
checkpoint = torch.load(model_path)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

# 테스트 데이터 불러오기
with rasterio.open(test_data_path) as file:
    test_data = file.read(1)
input_data = np.expand_dims(test_data, axis=0)
input_data = preprocess_train(input_data).unsqueeze(0)

# 추론 진행
output_data = model(input_data)[0]
output_data.squeeze(0).shape

# 후처리
output_data = output_data.squeeze().detach()
output_post = postprocess(output_data)

# 저장
output_path = os.path.split(test_data_path)[-1].split('.')[0] + "_out.tif"
output_path = os.path.join(output_dir, output_path)
# print(output_path)

try:
    # 디렉토리가 없는 경우 생성
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 파일 복사
    shutil.copy(test_data_path, output_path)
    print(f"File copied to: {output_path}")
except Exception as e:
    print(f"Error copying file: {e}")
    
with rasterio.open(output_path, 'r+') as src:  # 'r+'는 읽기 및 쓰기 모드
    data = src.read(1)  # 첫 번째 밴드 읽기 (NumPy 배열로 반환)
    print(f"Original data shape: {data.shape}")

    # 2. 데이터 수정
    modified_data = output_post

    # 3. 수정된 데이터 저장 (기존 파일에 덮어쓰기)
    src.write(modified_data, 1)  # 첫 번째 밴드에 수정된 데이터 쓰기

print(f"Modified data saved to {output_path}")
