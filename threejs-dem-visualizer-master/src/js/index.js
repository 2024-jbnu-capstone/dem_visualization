import '../sass/index.sass';
import { visualizeDEMfile } from './visual';

function adjustFontSize(element, text) {
  element.style.fontSize = '16px'; // 기본 글꼴 크기
  element.innerText = text;

  if (text.length > 10) {
    element.style.fontSize = '14px';
  }
  if (text.length > 15) {
    element.style.fontSize = '12px';
  }
  if (text.length > 20) {
    element.style.fontSize = '10px';
  }
}

function uploadFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.tif, .tiff';
  input.onchange = (event) => handleFileUpload(event.target.files[0]);
  input.click();
}

function handleFileUpload(file) {
  if (file) {
    const buttonContainer = document.getElementById('button-container');

    buttonContainer.innerHTML = '';

    const viewerButton = document.createElement('button');
    viewerButton.innerText = 'Viewer';
    viewerButton.onclick = () => visualizeDEMfile(file);
    buttonContainer.appendChild(viewerButton);

    alert('DEM 파일이 업로드되었습니다. "Viewer"를 이용해 보세요^^');
  }
}

function handleDragOver(event) {
  event.preventDefault();
  document.getElementById('beforeFileSection').classList.add('drag-over');
}

function handleDragLeave(event) {
  event.preventDefault();
  document.getElementById('beforeFileSection').classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('beforeFileSection').classList.remove('drag-over');

  const file = event.dataTransfer.files[0];
  if (
    file &&
    (file.type == 'image/tiff' || file.name.endsWith('.tif') || file.name.endsWith('.tiff'))
  ) {
    handleFileUpload(file, 'before');
  } else {
    alert('tiff 파일만(dem) 업로드할 수 있습니다.');
  }
}

function convertFile() {
  alert('파일이 변환되었습니다! (서버 요청은 생략됨)');
  const beforeImage = document.getElementById('beforeImage');
  const afterImage = document.getElementById('afterImage');
  afterImage.src = beforeImage.src;
  afterImage.style.display = 'block';
  document.getElementById('afterLabel').style.display = 'none';
}

function saveFile() {
  const afterImage = document.getElementById('afterImage');
  if (afterImage.src) {
    const regionName = document.getElementById('fileNameLabel').innerText;
    const fileName = prompt('저장할 파일명을 입력하세요:', `${regionName}_변환된_이미지.png`);
    if (fileName) {
      const link = document.createElement('a');
      link.href = afterImage.src;
      link.download = fileName;
      link.click();
      alert('파일이 저장되었습니다: ' + fileName);
    }
  } else {
    alert('저장할 파일이 없습니다. 변환 버튼을 먼저 클릭하세요.');
  }
}

window.uploadFile = uploadFile;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;
window.convertFile = convertFile;
window.saveFile = saveFile;
