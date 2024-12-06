import '../sass/index.sass';

const reportbutton = document.getElementById('reportButton');

reportbutton.addEventListener('click', function () {
  window.location.href = '/report';
});

function showVisualization() {
  window.location.href = '/visualization';
}

function showIntegration() {
  window.location.href = '/jeonghop';
}

window.showIntegration = showIntegration;
window.showVisualization = showVisualization;
