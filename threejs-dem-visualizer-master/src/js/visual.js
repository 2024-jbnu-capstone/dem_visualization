require('../sass/visual.sass');
import Application from './visualization.js';

// 페이지 새로고침 기능
function refreshPage() {
  location.reload();
}

// 파일 업로드 창 열기
function openFileDialog() {
  document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
  const fileList = document.getElementById('fileList');
  const files = Array.from(event.target.files);

  if (
    fileList.children.length === 1 &&
    fileList.children[0].textContent === '현재 업로드된 파일이 없습니다.'
  ) {
    fileList.innerHTML = '';
  }

  // 파일 목록을 순회하며 각 파일 이름과 체크박스, 삭제 버튼을 추가
  files.forEach((file, index) => {
    const listItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('file-checkbox');

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        document.querySelectorAll('.file-checkbox').forEach((cb) => {
          if (cb !== checkbox) {
            cb.checked = false;
            clearConvas();
          }
        });

        visualizeDEMfile(file);
      } else {
        clearConvas();
      }
    });

    const fileName = document.createElement('span');
    fileName.textContent = file.name;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => deleteFile(index);

    listItem.appendChild(checkbox);
    listItem.appendChild(fileName);
    listItem.appendChild(deleteButton);
    fileList.appendChild(listItem);
  });

  if (files.length === 0) {
    const listItem = document.createElement('li');
    listItem.textContent = '현재 업로드된 파일이 없습니다.';
    fileList.appendChild(listItem);
  }

  event.target.value = '';
}

function clearConvas() {
  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.innerHTML = '';
}

function deleteFile(index) {
  const fileList = document.getElementById('fileList');
  const items = Array.from(fileList.children);

  if (items[index]) {
    items[index].remove();
    document.querySelectorAll('.file-checkbox').forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  if (fileList.children.length === 0) {
    const listItem = document.createElement('li');
    listItem.textContent = '현재 업로드된 파일이 없습니다.';
    fileList.appendChild(listItem);
  }
  clearConvas();
}

// DEM 파일 시각화 함수
function visualizeDEMfile(file) {
  const reader = new FileReader();

  reader.onload = () => {
    new Application({
      container: document.getElementById('canvas-container'),
      demdata: reader.result,
    });
  };
  reader.readAsArrayBuffer(file);
}

window.refreshPage = refreshPage;
window.openFileDialog = openFileDialog;
window.handleFileUpload = handleFileUpload;
