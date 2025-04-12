	import { fetchAndInsert } from '../navi/navi.js';
	fetchAndInsert('../navi/navi.html', 'navi-container');

	gsap.config({trialWarn: false});
	let select = s => document.querySelector(s),
			toArray = s => gsap.utils.toArray(s),
			mainSVG = select('#mainSVG'),
			container = select('#container'),
			colorTab = select('.colorTab'),
			visibleArea = {
				value:160,
				offset:0
			},
			pt = mainSVG.createSVGPoint(),
			mousePos = {x: 0, y: 0},		
			colorArray = ["#FF6666","#FFB84D","#FFFF66","#66B266"],
			spacerX = 167,
			colorTabArr = []
				
	colorArray = colorArray.map(x => Array.from(x)[0] == '#' ? x : `#${x}`);

	gsap.set('svg', {
		visibility: 'visible'
	})

	colorArray.forEach((i, c) => {
		let clone = colorTab.cloneNode(true);
		container.appendChild(clone);
		gsap.set(clone, {
			x: c * spacerX
		}) 
		gsap.set(clone.children[0], {
			fill: i,
			y: 100
		}) 
		
		colorTabArr.push(clone);
		
	})

	function cursorPoint(evt){
	pt.x = evt.clientX; 
	pt.y = evt.clientY;
	return pt.matrixTransform(mainSVG.getScreenCTM().inverse());
	}
	mainSVG.onpointermove = (e) => {
		mousePos.x = cursorPoint(e).x;
		mousePos.y = cursorPoint(e).y - visibleArea.offset;
	}
	mainSVG.onmousedown = null;		

	let mapOpacity =  gsap.utils.pipe(
		gsap.utils.clamp(0, 100),
		gsap.utils.mapRange(0, 100, 100, 0)
		)

	let mapRotationn =  gsap.utils.pipe(
		gsap.utils.clamp(0, 100),
		gsap.utils.mapRange(0, 100, 0, 90)
		)
	let mapPosY =  gsap.utils.pipe(
		
		gsap.utils.clamp(0, visibleArea.value),
		gsap.utils.mapRange(0, visibleArea.value, 0, 200)
	)

	// 출력할 이미지
	const imageArray = [
		'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FpKlXg%2FbtsNkgtJn5c%2F6k1xRTKNnApCQrsvgqm3K1%2Fimg.png',
		'https://raw.githubusercontent.com/qotkdgus0430/study/main/bshidphoto.png',	// 상현씨 이미지
		'images/yellow.png',	// 지현씨 이미지
		'images/green.png'		// 경원씨 이미지
	  ];
	
	  function update() {
		let minDistance = Infinity;
		let closestIndex = -1;
		let threshold = 100;
	
		colorTabArr.forEach((i, c) => {
			let deltaX = gsap.getProperty(i, 'x') - mousePos.x + 110;
			let deltaY = gsap.getProperty(i, 'y') - mousePos.y - (visibleArea.offset - 150);
			let distance = Math.hypot(deltaX, deltaY);
	
			if (distance < minDistance && distance < threshold) {
				minDistance = distance;
				closestIndex = c;
			}
	
			// 이미지 숨기기 (부드럽게)
			const imageEl = i.querySelector('.tabImage');
			if (imageEl) {
				gsap.to(imageEl, {
					duration: 0.3,
					autoAlpha: 0, // opacity + visibility
					scale: 1,
					y: 0
				});
			}
	
			gsap.to(i, {
				y: mapPosY(distance)
			});
			gsap.to(i.children[1], {
				opacity: mapOpacity(distance),
				transformOrigin: '4% 2%'
			});
		});
	
		// 가장 가까운 요소가 있을 경우
		if (closestIndex !== -1) {
			const targetColor = colorArray[closestIndex];
			const closestTab = colorTabArr[closestIndex];
			const imageEl = closestTab.querySelector('.tabImage');
	
			// 배경색 부드럽게 바꾸기
			gsap.to(document.body, {
				backgroundColor: targetColor,
				duration: 0.4
			});
	
			if (imageEl) {
				imageEl.setAttribute('href', imageArray[closestIndex]);
				gsap.to(imageEl, {
					duration: 0.4,
					autoAlpha: 1,  // opacity + visibility
					scale: 1.05,
					y: -10,
					ease: "power2.out"
				});
			}
		} else {
			// 아무 것도 가까이 있지 않을 경우
			gsap.to(document.body, {
				backgroundColor: "#ffffff",
				duration: 0.4
			});
		}
	}
	gsap.ticker.add(update);

	onclick = function() {};

	const pageLinks = [
		'../profile_01/profile_jihun.html',
		'../BSH1/index.html',
		'../ljh/mypage.html',
		'../ykw/ykw.html'
	  ];
	  
	  colorTabArr.forEach((tab, index) => {
		tab.addEventListener('click', () => {
		  window.location.href = pageLinks[index];
		});
	  });