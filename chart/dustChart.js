// 네비게이션
fetch('../navi/navi.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navi-container').innerHTML = data;
})
.catch(error => console.error('Error loading navi:', error));

// 차트
var options = {
  chart: {
    height: 300,
    type: "area"
  },
  series: [
    {
      name: "미세먼지 등급",
      data: [1, 2, 3, 4, 1, 1, 2]
    }
  ],
  xaxis: {
    categories: ["04.09", "04.10", "04.11", "04.12", "04.13", "04.14", "04.15"]
  },
  yaxis: {
    tickAmount: 3,
    min: 1,
    max: 4,
    labels: {
      formatter: function (val) {
        const levels = {
          1: "매우나쁨",
          2: "나쁨",
          3: "보통",
          4: "좋음"
        };
        return levels[val] || "";
      },
      style: {
        colors: ['#000'], // 원하는 경우 색상 조절 가능
        fontSize: '14px'
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        const levels = {
          1: "매우나쁨",
          2: "나쁨",
          3: "보통",
          4: "좋음"
        };
        return levels[val] || "";
      }
    }
  },
  dataLabels: {
    enabled: false // 차트 안 숫자도 안 보이게
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


// async function getServiceKey() {
// 	const res = await fetch('../util/config.json');
//     const config = await res.json();
// 	return config.licenseKey;
// }

// function formatDate(date) {
// 	return date.toISOString().split('T')[0];
// }

// async function fetchDustForecastTextOnly(dateStr, serviceKey) {
// 	const params = new URLSearchParams({
// 		serviceKey,
// 		returnType: 'json',
// 		sidoName: '서울',
// 		numOfRows: '100',
// 		pageNo: '1',
// 		searchDate: dateStr
// 	});

// 	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth';

// 	try {
// 		const response = await fetch(`${url}?${params}`);
// 		const data = await response.json();
// 		const items = data.response?.body?.items || [];

// 		// PM25 텍스트 항목만 필터링
// 		const pm25Item = items.find(item => item.informCode === 'PM25');

// 		if (!pm25Item) {
// 			console.warn(`⚠️ ${dateStr} - PM2.5 예보 없음`);
// 			return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
// 		}

// 		return {
// 			date: dateStr,
// 			informCause: pm25Item.informCause,
// 			informGrade: pm25Item.informGrade,
// 			informOverall: pm25Item.informOverall
// 		};

// 	} catch (error) {
// 		console.error(`❌ ${dateStr} 날짜 데이터 오류:`, error);
// 		return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
// 	}
// }

// // 📊 최근 N일 동안 예보 수집 (텍스트 전용)
// async function fetchDustForecastTextLastNDays(days = 7) {
// 	const serviceKey = await getServiceKey();
// 	const result = [];

// 	for (let i = 0; i < days; i++) {
// 		const date = new Date();
// 		date.setDate(date.getDate() - i);
// 		const dateStr = formatDate(date);

// 		const dailyTextData = await fetchDustForecastTextOnly(dateStr, serviceKey);
// 		result.push(dailyTextData);
// 	}

// 	return result.reverse(); // 최신 날짜 우선
// }

// // 🏁 전체 실행 함수
// async function fetchData() {
// 	console.log('📦 PM2.5 미세먼지 텍스트 예보 수집 중...');
// 	try {
// 		const weeklyTextData = await fetchDustForecastTextLastNDays(7);
// 		console.log('✅ 수집 완료 (텍스트 예보):');
// 		console.dir(weeklyTextData, { depth: null });
// 	} catch (err) {
// 		console.error('⚠️ 수집 실패:', err);
// 	}
// }

// fetchData();