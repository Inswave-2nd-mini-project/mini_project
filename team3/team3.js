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
			extendedColorArray = [
				{"name":" "},
				{"name":" "},
				{"name":" "},
				{"name":" "}
				],
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
		clone.children[1].textContent = extendedColorArray[c].name
		
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
	function update() {
		colorTabArr.forEach((i, c) => {
			let deltaX = gsap.getProperty(i, 'x') - mousePos.x + 110;
			let deltaY = gsap.getProperty(i, 'y') - mousePos.y  - (visibleArea.offset - 150);
	
			let distance = Math.hypot(deltaX, deltaY);
	
			gsap.to(i, {
				y: mapPosY(distance) 
			});
			gsap.to(i.children[1], {
				opacity: mapOpacity(distance),
				transformOrigin: '4% 2%'
			});
		});
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