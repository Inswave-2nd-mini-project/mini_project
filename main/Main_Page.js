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

async function getServiceKey() {
	const res = await fetch('../util/config.json');
	const config = await res.json();
	return config.licenseKey;
  }
  
  async function fetchData() {
	const serviceKey = await getServiceKey();
  
	const params = new URLSearchParams({
	//   serviceKey: encodeURIComponent(serviceKey),
	  serviceKey, // key, value가 같으면 둘 중 하나만 써도 됨
	  returnType: 'json',
	  sidoName: '서울',
	  numOfRows: '1000',
	  pageNo: '1',
	  searchDate: '2022-05-20'
	});
  
	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'; // 정확한 URL
  
	const response = await fetch(`${url}?${params}`);
	const data = await response.json();
	console.log('미세먼지 데이터:', data);
  }
  
  fetchData().catch(console.error);
  