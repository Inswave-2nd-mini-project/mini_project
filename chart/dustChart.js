// 네비게이션
fetch('../navi/navi.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navi-container').innerHTML = data;
})
.catch(error => console.error('Error loading navi:', error));

// 차트 생성
var options = {
    chart: {
      height: 280,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "Series 1",
        data: [45, 52, 38, 45, 19, 23, 2]
      }
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan"
      ]
    }
  };
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();
  

// let currentWeekData = [];
// let lastWeekData = [];

async function getServiceKey() {
	const res = await fetch('../util/config.json');
    const config = await res.json();
	return config.licenseKey;
}

function formatDate(date) {
	return date.toISOString().split('T')[0];
}

// 해당 날짜에 대한 미세먼지 예보 데이터를 가져옴
async function fetchDustForecast(dateStr, serviceKey) {
	const params = new URLSearchParams({
		serviceKey,
		returnType: 'json',
		sidoName: '서울',
		numOfRows: '10',
		pageNo: '1',
		searchDate: dateStr
	});
    console.log(dateStr);

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

async function dustData() {
	const serviceKey = await getServiceKey();
	const startDate = new Date();
	// startDate.setDate(startDate.getDate() - 7);      // 7일 이전 요청
    const strDate = formatDate(startDate);
    fetchDustForecast(strDate, serviceKey);
}

async function fetchData() {
	console.log('미세먼지 데이터 수집 중...');
	currentWeekData = await dustData();
	console.log('미세먼지 데이터:', currentWeekData);
}

fetchData().catch(console.error);
