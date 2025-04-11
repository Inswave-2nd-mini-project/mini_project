// 네비게이션
import { fetchAndInsert } from '../navi/navi.js';
fetchAndInsert('../navi/navi.html', 'navi-container');


// 캐러셀
	let items = document.querySelectorAll('.slider .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    
    let active = 4;
	function loadShow(){
		let stt = 0;
		for (let i = 0; i < items.length; i++) {
			// 모든 슬라이드 초기화
			items[i].style.transform = '';
			items[i].style.zIndex = '';
			items[i].style.filter = '';
			items[i].style.opacity = '';
		}
	
		// 중앙에 위치할 이미지
		items[active].style.transform = `none`;
		items[active].style.zIndex = 1;
		items[active].style.filter = 'none';
		items[active].style.opacity = 1;

		stt = 0;
		for (let i = 1; i <= 2; i++) {
			stt++;
			let index = (active + i) % items.length;
			items[index].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
			items[index].style.zIndex = -stt;
			items[index].style.filter = 'blur(5px)';
			// items[index].style.opacity = 0.6;
			items[index].style.opacity = stt == 2 ? 0.3 : 0.6;
		}
	
		stt = 0;
		for (let i = 1; i <= 2; i++) {
			stt++;
			let index = (active - i + items.length) % items.length;
			items[index].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
			items[index].style.zIndex = -stt;
			items[index].style.filter = 'blur(5px)';
			// items[index].style.opacity = 0.6;
			items[index].style.opacity = stt == 2 ? 0.3 : 0.6;
		}
	}
    loadShow();

next.onclick = function(){
    active = (active + 1) % items.length;
    loadShow();
}

prev.onclick = function(){
    active = (active - 1 + items.length) % items.length;
    loadShow();
}

//  이동할 html 링크
	const links = [
		"../kanban/kanban.html", 					//칸반	
		"../board/board.html",					//보드
		"../map/map.html",						//지도
		"../chart/dustChart.html",				//차트
		"../team3/team3.html"					//조 소개
	];
  
// 이미지 클릭 시 해당 html로 이동
	items.forEach((item, index) => {
		item.onclick = function() {
			if (index === active) {
				window.location.href = links[active];
			}
		}
	});
