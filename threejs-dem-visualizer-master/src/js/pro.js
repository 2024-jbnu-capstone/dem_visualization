import emailjs from '@emailjs/browser';

(function () {
  emailjs.init('R1tjRwncd7E2sZe1y');
})();

// 이메일 뒷부분 선택 처리
const emailDomainSelect = document.getElementById('email-domain');
const customDomainInput = document.getElementById('custom-domain');

emailDomainSelect.addEventListener('change', () => {
  if (emailDomainSelect.value === 'custom') {
    customDomainInput.classList.remove('hidden');
    customDomainInput.required = true;
  } else {
    customDomainInput.classList.add('hidden');
    customDomainInput.required = false;
    customDomainInput.value = '';
  }
});

// 폼 제출 이벤트 처리
document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const emailPrefix = document.getElementById('email-prefix').value;
  let emailDomain = emailDomainSelect.value;

  if (emailDomain === 'custom') {
    emailDomain = `@${customDomainInput.value}`;
  }

  const email = emailPrefix + emailDomain;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  emailjs
    .send('service_7kxxnpl', 'template_m20vp1h', {
      email,
      title,
      content,
    })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: '신고 완료',
        text: '신고가 성공적으로 접수되었습니다.',
      }).then(() => {
        window.history.back();
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: '전송 실패',
        text: '문제를 다시 확인해주세요.',
      });
      console.error('EmailJS 전송 오류:', error);
    });
});
