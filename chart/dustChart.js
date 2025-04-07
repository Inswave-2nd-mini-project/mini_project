// 네비게이션
fetch('../navi/navi.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navi-container').innerHTML = data;
})
.catch(error => console.error('Error loading navi:', error));

// 미세먼지 정보 불러오기기
async function getServiceKey() {
	const res = await fetch('../util/config.json');
    const config = await res.json();
	return config.licenseKey;
}

function formatDate(date) {
	return date.toISOString().split('T')[0];
}

async function fetchDustForecastTextOnly(dateStr, serviceKey) {
	const params = new URLSearchParams({
		serviceKey,
		returnType: 'json',
		sidoName: '서울',
		numOfRows: '100',
		pageNo: '1',
		searchDate: dateStr
	});

	const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth';

	try {
		const response = await fetch(`${url}?${params}`);
		const data = await response.json();
		const items = data.response?.body?.items || [];

		// PM25 텍스트 항목만 필터링
		const pm25Item = items.find(item => item.informCode === 'PM25');

		if (!pm25Item) {
			console.warn(`⚠️ ${dateStr} - PM2.5 예보 없음`);
			return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
		}

		return {
			date: dateStr,
			informCause: pm25Item.informCause,
			informGrade: pm25Item.informGrade,
			informOverall: pm25Item.informOverall
		};

	} catch (error) {
		console.error(`❌ ${dateStr} 날짜 데이터 오류:`, error);
		return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
	}
}

// 📊 최근 N일 동안 예보 수집 (텍스트 전용)
async function fetchDustForecastTextLastNDays(days = 7) {
	const serviceKey = await getServiceKey();
	const result = [];

	for (let i = 0; i < days; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateStr = formatDate(date);

		const dailyTextData = await fetchDustForecastTextOnly(dateStr, serviceKey);
		result.push(dailyTextData);
	}

	return result.reverse(); // 최신 날짜 우선
}

async function fetchData() {
  console.log('📦 미세먼지 텍스트 예보 수집 중...');

  let weeklyTextData;

  try {
    weeklyTextData = await fetchDustForecastTextLastNDays();
    console.log('✅ 수집 완료 (텍스트 예보):');
    console.dir(weeklyTextData, { depth: null });
  } catch (err) {
    console.error('⚠️ 수집 실패:', err);
    return;
  }

  const levelMap = {
    "매우나쁨": 1,
    "나쁨": 2,
    "보통": 3,
    "좋음": 4
  };

  const dates = weeklyTextData.map(item => {
    const d = new Date(item.date);
    return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  });

  const levels = weeklyTextData.map(item => {
    const gradeStr = item.informGrade;
    const match = gradeStr.match(/서울\s*:\s*(좋음|보통|나쁨|매우나쁨)/);
    const levelText = match ? match[1] : "보통"; // 기본값은 '보통'
    return levelMap[levelText] || 3;
  });

  // 차트 업데이트
  chart.updateOptions({
    xaxis: {
      categories: dates
    }
  });
  chart.updateSeries([{
    name: "서울 미세먼지 등급",
    data: levels
  }]);
}

// 차트 옵션
var options = {
  chart: {
    height: 300,
    type: "area"
  },
  series: [{
    name: "서울 미세먼지 등급",
    data: [] // 초기 데이터
  }],
  xaxis: {
    categories: []
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
        return levels[Math.round(val)] || "";
      },
      style: {
        colors: ['#000'],
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
    enabled: false
  }
};

// 차트 렌더링
var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// 데이터 가져오기
fetchData();