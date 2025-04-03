document.addEventListener('DOMContentLoaded', function () {
	// fullPage.js 초기화
	new fullpage('#fullpage', {
	  autoScrolling: true,
	  navigation: true,
	  onLeave: function (origin, destination, direction) {
		const colors = ['#FFEDFA', '#FFB8E0', '#EC7FA9', '#BE5985'];
		document.body.style.backgroundColor = colors[destination.index];
	  }
	});
});
  

// 네비게이션
	fetch('../navi/navi.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('navi-container').innerHTML = data;
		})
		.catch(error => console.error('Error loading navi:', error));

// 첫번째 페이지 js 코드
	const images = document.querySelectorAll(".carousel-image");	// 이미지 클릭 시 html 이동을 하기 위한 이미지 리스트
	const container = document.getElementById('image-container');	// 캐러셀 이미지 변경을 위한 변수

	//  이동할 html 링크
	const links = [
		"../BSH1/index.html",
		"../profile_01/profile_jihun.html",
		"../ljh/cardpage.html",
		"../profile_01/profile_hyunwoo.html"
	];
  
	// 이미지 클릭 시 해당 html로 이동
	images.forEach((img, index) => {
		img.addEventListener("click", () => {
		window.location.href = links[index];
		});
	});

	// 캐러셀 버튼: 이미지 순서 변경
	document.getElementById('prev-btn').addEventListener('click', () => {
		const first = container.firstElementChild;
		container.appendChild(first);
	});

	document.getElementById('next-btn').addEventListener('click', () => {
		const last = container.lastElementChild;
		container.insertBefore(last, container.firstElementChild);
	});

	
	
// 두번째 페이지 js 코드

// 세번째 Js코드
// async function getServiceKey() {
// 	const res = await fetch('../util/config.json');
// 	const config = await res.json();
// 	return config.licenseKey;
//   }
//   async function fetchData() {
// 	const serviceKey = await getServiceKey();
  
// 	const params = new URLSearchParams({
// 	//   serviceKey: encodeURIComponent(serviceKey),
// 	serviceKey,
// 	  returnType: 'json',
// 	  sidoName: '서울',
// 	  numOfRows: '1000',
// 	  pageNo: '1',
// 	  searchDate: '2025-03-20'
// 	});
	
// 	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth'; // 정확한 URL
  
// 	const response = await fetch(`${url}?${params}`);
// 	const data = await response.json();
// 	console.log('미세먼지 데이터:', data);
//   } 
//   fetchData().catch(console.error);


let currentData;
let lastWeekData;

async function getServiceKey() {
	const res = await fetch('../util/config.json');
	const config = await res.json();
	return config.licenseKey;
}

function formatDate(date) {
	// YYYY-MM-DD 형식으로 변환
	return date.toISOString().split('T')[0];
}

async function fetchDustForecast(dateStr) {
	const serviceKey = await getServiceKey();

	const params = new URLSearchParams({
		serviceKey,
		returnType: 'json',
		sidoName: '서울',
		numOfRows: '1000',
		pageNo: '1',
		searchDate: dateStr
	});

	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth';

	try {
		const response = await fetch(`${url}?${params}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching data for ${dateStr}:`, error);
		return null;
	}
}

async function fetchData() {
	const today = new Date();
	const lastWeek = new Date();
	lastWeek.setDate(today.getDate() - 7);
	const todayStr = formatDate(today);
	const lastWeekStr = formatDate(lastWeek);

	console.log('Fetching data for this week:', todayStr);
	currentData = await fetchDustForecast(todayStr);
	console.log('이번 주 미세먼지 데이터:', currentData);

	console.log('Fetching data for last week:', lastWeekStr);
	lastWeekData = await fetchDustForecast(lastWeekStr);
	console.log('저번 주 미세먼지 데이터:', lastWeekData);
}

fetchData().catch(console.error);