let currentPage = 0; // 현재 페이지 인덱스
const pages = document.querySelectorAll('.page'); // 모든 페이지 요소를 가져옵니다.

// 스크롤 이벤트 처리
window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        // 아래로 스크롤
        if (currentPage < pages.length - 1) {
            currentPage++;
        }
    } else {
        // 위로 스크롤
        if (currentPage > 0) {
            currentPage--;
        }
    }

    // 페이지 전환
    scrollToPage(currentPage);
});

// 페이지 전환 함수
function scrollToPage(pageIndex) {
    window.scrollTo({
        top: pages[pageIndex].offsetTop,
        behavior: 'smooth' // 부드러운 스크롤
    });
}

// 첫 번째 페이지로 이동
scrollToPage(currentPage);
