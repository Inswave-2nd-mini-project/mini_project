// 네비게이션
	fetch('../navi/navi.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('navi-container').innerHTML = data;
		})
		.catch(error => console.error('Error loading navi:', error));


// 캐러셀
	let items = document.querySelectorAll('.slider .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    
    let active = 4;
	function loadShow(){
		let stt = 0;
		// Reset all items
		for (let i = 0; i < items.length; i++) {
			items[i].style.transform = '';
			items[i].style.zIndex = '';
			items[i].style.filter = '';
			items[i].style.opacity = '';
		}
	
		// Active item (center)
		items[active].style.transform = `none`;
		items[active].style.zIndex = 1;
		items[active].style.filter = 'none';
		items[active].style.opacity = 1;
	
		// Right side items
		stt = 0;
		for (let i = 1; i <= 2; i++) {
			stt++;
			let index = (active + i) % items.length;
			items[index].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
			items[index].style.zIndex = -stt;
			items[index].style.filter = 'blur(5px)';
			items[index].style.opacity = stt > 2 ? 0 : 0.6;
		}
	
		// Left side items
		stt = 0;
		for (let i = 1; i <= 2; i++) {
			stt++;
			let index = (active - i + items.length) % items.length;
			items[index].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
			items[index].style.zIndex = -stt;
			items[index].style.filter = 'blur(5px)';
			items[index].style.opacity = stt > 2 ? 0 : 0.6;
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

// 	//  이동할 html 링크
	const links = [
		"../BSH1/index.html", 					//칸반	
		"../board/board.html",					//보드
		"../ljh/cardpage.html",					//지도
		"../chart/dustChart.html",				//차트
		"../login/login.html"					//조 소개(?)
	];
  
	// 이미지 클릭 시 해당 html로 이동
	items.forEach((item, index) => {
		item.onclick = function() {
			if (index === active) {
				window.location.href = links[active];
			}
		}
	});