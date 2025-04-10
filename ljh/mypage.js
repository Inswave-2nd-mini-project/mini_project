//Toggling Menu
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};

showMenu("nav-toggle", "nav-menu");

//Toggling Active Link
const navLink = document.querySelectorAll(".nav-link");

function linkAction() {
  navLink.forEach((n) => n.classList.remove("active"));
  this.classList.add("active");

  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show");
}

navLink.forEach((n) => n.addEventListener("click", linkAction));

// Scroll Reveal

const sr = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 2000,
  reset: true,
});

sr.reveal(".home-title", {});
sr.reveal(".button", { delay: 200 });
sr.reveal(".home-img", { delay: 400 });
sr.reveal(".home-social", { delay: 400 });

sr.reveal(".about-img", {});
sr.reveal(".about-subtitle", { delay: 200 });
sr.reveal(".about-text", { delay: 400 });

sr.reveal(".skills-subtitle", { delay: 100 });
sr.reveal(".skills-text", { delay: 150 });
sr.reveal(".skills-data", { interval: 200 });
sr.reveal(".skills-img", { delay: 400 });

sr.reveal(".work-img", { interval: 200 });

sr.reveal(".contact-input", { interval: 200 });

// 네비게이션
fetch("../navi/navi.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navi-container").innerHTML = data;
  })
  .catch((error) => console.error("Error loading navi:", error));

// 로컬 스토리지
document.getElementById("saveItems").addEventListener("click", function () {
  // input과 textarea에 작성한 값 가져오기
  const name = document.getElementById("name").value;
  const content = document.getElementById("content").value;

  // input, textarea에 없으면 alert 띄우고 return하기
  if (!name || !content) {
    swal("ERROR","이름과 내용을 모두 입력해야 제출이 가능합니다.","error");
    return;
  }

  // 로컬 스토리지에 저장된 값 JSON 형태로 가져오기
  const localItems = JSON.parse(localStorage.getItem("localItems")) || [];

  // 새로운 값 추가하기
  localItems.push({ name:name, content:content });

  // 로컬 스토리지에 JSON형태로 세팅하기
  localStorage.setItem("localItems", JSON.stringify(localItems));

  // input과 textarea 초기화하기
  document.getElementById("name").value = "";
  document.getElementById("content").value = "";

  swal("성공!", "방명록이 저장되었습니다.", "success");

  // 저장된 값을 화면에 보여주기
  display();
});

function display() {
  // 로컬 스토리지에 저장된 값 JSON 형태로 가져오기
  const localItems = JSON.parse(localStorage.getItem("localItems")) || [];
  // HTML 문서의 id = 'localList'인 값 선택
  const localList = document.getElementById("localList");

  // 기존 리스트 초기화
  // 이전 값이 남아있는걸 방지하기 위해(중복방지)
  localList.innerHTML = "";

  // // 로컬 스토리지에 있는 값을 HTML 문서의 id = 'localList'에 추가
  // localItems.forEach((item, index) => {
  //   // 리스트형태로 세팅해주기 위해 <ul> 밑에 <li> 느낌
  //   const listItem = document.createElement("li");
  //   // listItem의 텍스트 내용을 세팅하기 위해 .textContent 사용
  //   listItem.textContent = `No${index + 1}. 작성자 : ${item.name} 내용 : ${
  //     item.content
  //   }`;
  //   // localList에 listItem 추가하기
  //   localList.appendChild(listItem);
  // });
    
    localItems.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card mb-3";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      
      // 카드 타이틀과 텍스트 설정
      cardBody.innerHTML = `
      <h5 class="card-title"><strong>${item.content}</strong></h5>
      <p class="card-text"><strong>${item.name}</strong></p>
    `;
      card.appendChild(cardBody);
      localList.appendChild(card);
      
    });
  
}

// document.getElementById("clearItems").addEventListener("click", function () {
//   localStorage.clear();
//   alert("방명록이 초기화되었습니다.");
//   // 새로고침
//   location.reload();
// });

// 페이지 로드 시 저장된 값 표시하기
window.onload = display;
