from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import rasterio
import numpy as np
import torch
from io import BytesIO
from models.vae_net import ConvVAE50x50
from models.dataset import preprocess_train, postprocess

app = Flask(__name__)
CORS(app)  # CORS 활성화

# 모델 로딩 (CPU에서 모델 로드)
model_path = "./epoch_1001.pth"
model = ConvVAE50x50(1)
checkpoint = torch.load(model_path, map_location=torch.device('cpu'))  # CPU에서 로드
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

# API 엔드포인트
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 클라이언트에서 파일 받기
        file = request.files['file']
        # 파일을 메모리에서 직접 읽기
        with rasterio.open(file) as src:
            test_data = src.read(1)

        # 전처리
        input_data = np.expand_dims(test_data, axis=0)
        input_data = preprocess_train(input_data).unsqueeze(0)

        # 모델 추론
        output_data = model(input_data)[0]
        output_data = output_data.squeeze().detach()
        output_post = postprocess(output_data)

        # 결과를 메모리 내에서 TIFF로 변환
        output_mem = BytesIO()
        with rasterio.open(output_mem, 'w', driver='GTiff', height=output_post.shape[0], width=output_post.shape[1],
                           count=1, dtype=output_post.dtype) as dst:
            dst.write(output_post, 1)

        # 메모리 내에서 파일을 읽어 클라이언트에 반환
        output_mem.seek(0)  # 메모리 포인터를 파일 시작 위치로 이동
        return send_file(output_mem, as_attachment=True, attachment_filename="prediction_result.tif")

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
