import '../sass/jeonghop.sass';
import Application from './visualization.js';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/default.min.css';

document.addEventListener('DOMContentLoaded', () => {
  alertify.defaults.glossary.title = '알림';
  const fileUploadButton = document.getElementById('uploadButton');
  const alignButton = document.getElementById('alignButton');
  const saveButton = document.getElementById('saveButton');
  const reportbutton = document.getElementById('reportButton');
  const text = document.getElementById('text');

  let uploadedFile = null;
  let result = null;

  reportbutton.addEventListener('click', () => {
    window.location.href = '/report';
  });

  // 파일 업로드 버튼 클릭 이벤트
  fileUploadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file'; // 모든 파일 유형 허용
    input.click();

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadedFile = file; // 파일 저장
        text.textContent = `업로드된 파일: ${file.name}`; // 업로드된 파일 이름 표시
      } else {
        text.textContent = '파일이 선택되지 않았습니다.';
      }
    });
  });

  // 정합 버튼 클릭 이벤트
  alignButton.addEventListener('click', async () => {
    if (!uploadedFile) {
      alertify.alert('파일을 먼저 업로드하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);
    text.textContent = '정합 중입니다.';

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('정합 과정 중 오류가 발생했습니다.');
      }

      result = await response.blob();
      alertify.alert('정합이 완료되었습니다.');
      text.textContent = '';

      visualizeDEMfile(result);
    } catch (error) {
      alert('오류 발생: ' + error.message);
    }
  });

  async function visualizeDEMfile(blob) {
    const visualizationContainer = document.getElementById('visualizationContainer');

    if (!visualizationContainer) {
      alert('visualizationContainer 요소를 찾을 수 없습니다.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        new Application({
          container: document.getElementById('visualizationContainer'),
          demdata: reader.result,
        });
      };
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      alert('시각화 중 오류 발생: ' + error.message);
    }
  }

  // 저장 버튼 클릭 이벤트
  saveButton.addEventListener('click', async () => {
    if (!result) {
      alertify.alert('정합부터 하세요!!');
      return;
    }

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'result.tif',
        types: [
          {
            description: 'TIFF File',
            accept: { 'image/tiff': ['.tif', '.tiff'] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(result); // Blob 데이터를 파일로 씀
      await writable.close(); // 파일 쓰기 완료 후 스트림 닫기
      alertify.alert('파일이 저장되었습니다.');
    } catch (error) {
      if (error.name !== 'AbortError') {
        alert('오류 발생: ' + error.message);
      }
    }
  });
});
