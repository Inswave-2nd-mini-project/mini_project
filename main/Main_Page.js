// 네비게이션
	fetch('../navi/navi.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('navi-container').innerHTML = data;
		})
		.catch(error => console.error('Error loading navi:', error));

	const images = document.querySelectorAll(".carousel-image");	// 이미지 클릭 시 html 이동을 하기 위한 이미지 리스트
	const container = document.getElementById('image-container');	// 캐러셀 이미지 변경을 위한 변수

// 	//  이동할 html 링크
// 	const links = [
// 		"../BSH1/index.html",
// 		"../profile_01/profile_jihun.html",
// 		"../ljh/cardpage.html",
// 		"../YKW/mypage.html"
// 	];
  
// 	// 이미지 클릭 시 해당 html로 이동
// 	images.forEach((img, index) => {
// 		img.addEventListener("click", () => {
// 		window.location.href = links[index];
// 		});
// 	});

// 	// 캐러셀 버튼: 이미지 순서 변경
// 	document.getElementById('prev-btn').addEventListener('click', () => {
// 		const first = container.firstElementChild;
// 		container.appendChild(first);
// 	});

// 	document.getElementById('next-btn').addEventListener('click', () => {
// 		const last = container.lastElementChild;
// 		container.insertBefore(last, container.firstElementChild);
// 	});

	


// // 미세먼지 코드
// let currentWeekData = [];
// let lastWeekData = [];

// async function getServiceKey() {
// 	const res = await fetch('../util/config.json');
// 	const config = await res.json();
// 	return config.licenseKey;
// }

// function formatDate(date) {
// 	return date.toISOString().split('T')[0];
// }

// // 해당 날짜에 대한 미세먼지 예보 데이터를 가져옴
// async function fetchDustForecast(dateStr, serviceKey) {
// 	const params = new URLSearchParams({
// 		serviceKey,
// 		returnType: 'json',
// 		sidoName: '서울',
// 		numOfRows: '1000',
// 		pageNo: '1',
// 		searchDate: dateStr
// 	});

// 	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth';

// 	try {
// 		const response = await fetch(`${url}?${params}`);
// 		const data = await response.json();
// 		return data;
// 	} catch (error) {
// 		console.error(`Error fetching data for ${dateStr}:`, error);
// 		return null;
// 	}
// }

// // 7일치 데이터를 모으는 함수
// async function fetch7DaysData() {
// 	const serviceKey = await getServiceKey();
// 	const allData = new Map(); // 중복 방지용 (date 기준)
// 	const startDate = new Date();
// 	startDate.setDate(startDate.getDate() - 7);
// 	for (let i = 0; i < 14; i++) {
// 		const date = new Date(startDate);
// 		date.setDate(date.getDate() + i);
// 		const formattedDate = formatDate(date);
// 		console.log(`미세먼지 데이터 불러오는중... ${formattedDate}`);

// 		const result = await fetchDustForecast(formattedDate, serviceKey);
// 		if (result?.response?.body?.items) {
// 			for (const item of result.response.body.items) {
// 				const forecastDate = item.frcstOneDt; // 예보일자
// 				if (!allData.has(forecastDate)) {
// 					allData.set(forecastDate, item);
// 				}
// 			}
// 		}
// 	}

// 	// 날짜순 정렬
// 	return Array.from(allData.values()).sort((a, b) => a.frcstOneDt.localeCompare(b.frcstOneDt));
// }

// async function fetchData() {
// 	console.log('미세먼지 데이터 수집 중...');
// 	currentWeekData = await fetch7DaysData();
// 	console.log('미세먼지 데이터:', currentWeekData);
// }

// fetchData().catch(console.error);

let items = document.querySelectorAll('.slider .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    
    let active = 1;
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