$(document).ready(function(){
    $('.parallax').parallax();
  });

function phone(){
  Swal.fire({
    html : '<i class="bi bi-telephone-fill"></i> 010-4186-1829<br> <i class="bi bi-envelope-fill"></i> ykw1230@naver.com',
    icon : "info",
    confirmButtonText : "닫기"
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const cardReveals = document.querySelectorAll('.card-reveal');

  cardReveals.forEach((reveal) => {
    reveal.addEventListener('click', function () {
      this.style.transform = 'translateY(100%)';
    });
  });
});


