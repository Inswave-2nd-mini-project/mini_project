// 네비게이션
import { fetchAndInsert } from '../navi/navi.js';
fetchAndInsert('../navi/navi.html', 'navi-container');

// 미세먼지 정보 불러오기
async function getServiceKey() {
  const res = await fetch('../util/config.json');
  const config = await res.json();
  return config.licenseKey;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// 단축 날짜 포맷 (MM.DD)
function formatShortDate(date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 미세먼지 등급 문자와 숫자 매핑 (양방향)
const DUST_LEVELS_MAP = {
  "매우나쁨": 1,
  "나쁨": 2,
  "보통": 3,
  "좋음": 4
};
const DUST_LEVELS_LABELS = {
  1: "매우나쁨",
  2: "나쁨",
  3: "보통",
  4: "좋음"
};

// 등급 텍스트를 추출하는 헬퍼 함수 (정규식 사용)
function getDustLevelText(informGradeText = "") {
  const match = informGradeText.match(/서울\s*:\s*(좋음|보통|나쁨|매우나쁨)/);
  return match ? match[1] : "보통";
}

// y축 및 툴팁에서 숫자를 문자로 변환하는 함수
function getLevelLabel(val) {
  return DUST_LEVELS_LABELS[Math.round(val)] || "";
}

// 미세먼지 예보 텍스트 단일 조회
async function fetchDustForecastTextOnly(dateStr, serviceKey) {
  const params = new URLSearchParams({
    serviceKey, // 단축 속성명
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
      console.warn(`${dateStr} - PM2.5 예보 없음`);
      return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
    }

    return {
      date: dateStr,
      informCause: pm25Item.informCause,
      informGrade: pm25Item.informGrade,
      informOverall: pm25Item.informOverall
    };

  } catch (error) {
    console.error(`${dateStr} 날짜 데이터 오류:`, error);
    return { date: dateStr, informCause: null, informGrade: null, informOverall: null };
  }
}

// 최근 N일 동안 예보 수집 (텍스트 전용)
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

  return result.reverse(); // 날짜 오름차순 정렬
}

// 등급별 메시지 및 장소 추천 데이터
const levelData = {
  "좋음": {
    message: "😎 오늘은 밖이 천국이에요! 야외 활동 강력 추천입니다!",
    places: ["한강공원 산책", "야외 테라스 카페"]
  },
  "보통": {
    message: "🙂 오늘 공기, 나쁘지 않아요! 산책이나 가벼운 외출 어떠세요?",
    places: ["가까운 공원", "조용한 동네 산책길"]
  },
  "나쁨": {
    message: "🥴 오늘은 공기 상태가 좀 껄끄럽네요. 마스크 챙기세요!",
    places: ["실내 북카페", "조용한 실내 문화 공간"]
  },
  "매우나쁨": {
    message: "😷 지금은 숨 쉬는 것도 아깝습니다… 실내 활동을 추천해요!",
    places: ["스터디 카페", "집 근처 조용한 실내 공간"]
  }
};

// fetchData 함수: 데이터를 받아 차트와 추천 메시지 업데이트
async function fetchData() {
  console.log('미세먼지 텍스트 예보 수집 중...');

  try {
    const weeklyTextData = await fetchDustForecastTextLastNDays();
    console.log('수집 완료 (텍스트 예보):', weeklyTextData);

    // x축 날짜와 등급(숫자) 배열 초기화
    const dates = [];
    const levelNumbers = [];
    let latestLevelText = "보통";

    weeklyTextData.forEach(item => {
      const d = new Date(item.date);
      dates.push(formatShortDate(d));

      const levelText = getDustLevelText(item.informGrade);
      levelNumbers.push(DUST_LEVELS_MAP[levelText] || DUST_LEVELS_MAP["보통"]);
      latestLevelText = levelText;
    });

    // 차트 업데이트 (x축 및 데이터 업데이트)
    chart.updateOptions({
      xaxis: { categories: dates }
    });
    chart.updateSeries([{
      name: "서울 미세먼지 등급",
      data: levelNumbers
    }]);

    // 최신 등급에 따른 메시지 및 장소 출력
    const { message, places } = levelData[latestLevelText];
    document.getElementById('dust-level').innerHTML = `
      ${message}<br>
      👉 추천 장소: <strong>${places.join(', ')}</strong>
    `;
  } catch (err) {
    console.error('수집 실패:', err);
    return;
  }
}

// 차트 옵션 정의 (중복되는 숫자-문자 변환은 헬퍼 함수 사용)
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
      formatter: (val) => getLevelLabel(val),
      style: {
        colors: ['#000'],
        fontSize: '14px'
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val) => getLevelLabel(val)
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#8aabff'] // 차트 색상 조절
};

// 차트 렌더링
var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// 데이터 가져오기
fetchData();