// 네비게이션
import { fetchAndInsert } from '../navi/navi.js';
fetchAndInsert('../navi/navi.html', 'navi-container');

document.addEventListener('DOMContentLoaded', function () {
  // fullPage.js 초기화
  new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    onLeave: function (origin, destination, direction) {
      const colors = ['#BFCEFA', '#C5E0F8', '#CBF1F5'];
      document.body.style.backgroundColor = colors[destination.index];
    }
  });

// 프로필 페이지
const buttons = document.querySelectorAll(".card-buttons button");
const sections = document.querySelectorAll(".card-section");
const card = document.querySelector(".card");

const handleButtonClick = (e) => {
  const targetSection = e.target.getAttribute("data-section");
  const section = document.querySelector(targetSection);
  targetSection !== "#about"
    ? card.classList.add("is-active")
    : card.classList.remove("is-active");
  card.setAttribute("data-state", targetSection);
  sections.forEach((s) => s.classList.remove("is-active"));
  buttons.forEach((b) => b.classList.remove("is-active"));
  e.target.classList.add("is-active");
  section.classList.add("is-active");
};

buttons.forEach((btn) => {
  btn.addEventListener("click", handleButtonClick);
});


  // Section3가 활성화되면 3D 갤러리 초기화
  var section3 = document.getElementById("section3");
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      console.log("Section 2 is now visible, initializing 3D gallery...");
      init();
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(section3);

  console.log('FullPage initialized');
});

/* ========== 3D 갤러리 관련 변수 및 초기 설정 ========== */
var radius = 240;         // 갤러리 반지름
var autoRotate = true;    // 자동 회전 여부
var rotateSpeed = -60;    // 초당 회전 속도 (초/360도)
var imgWidth = 120;       // 이미지 너비 (px)
var imgHeight = 170;      // 이미지 높이 (px)

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = (radius * 3) + "px";
ground.style.height = (radius * 3) + "px";

/* 3D 갤러리 초기화 함수 */
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

/* 갤러리 회전 적용 */
function applyTranform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
}

/* 자동 회전 제어 */
function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

/* ========== 드래그 이벤트 (Section3 활성 시) ========== */
document.onpointerdown = function (e) {
  if (!document.getElementById("section3").classList.contains("active")) {
    return;
  }
  clearInterval(odrag.timer);
  sX = e.clientX;
  sY = e.clientY;
  
  this.onpointermove = function (e) {
    nX = e.clientX;
    nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  if (!document.getElementById("section3").classList.contains("active")){
    return;
  }
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

/* ========== 오디오 플레이어 (이미지 클릭 시) ========== */
var audioPlayer = document.createElement('audio');
audioPlayer.controls = true;
audioPlayer.style.display = 'none';
document.getElementById('music-container').appendChild(audioPlayer);

var aImgElements = document.getElementsByTagName('img');
var currentAudioSrc = null; // 현재 재생 중인 오디오 소스 추적

for (var i = 0; i < aImgElements.length; i++) {
  aImgElements[i].addEventListener('click', function () {
    var audioSrc = this.getAttribute('data-audio');

    // 같은 소스를 다시 클릭한 경우: 재생 중지
    if (audioPlayer.src === audioSrc && !audioPlayer.paused) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      currentAudioSrc = null;
      return;
    }

    // 새로운 소스를 클릭한 경우: 재생
    if (audioSrc) {
      audioPlayer.src = audioSrc;
      audioPlayer.style.display = 'none';
      audioPlayer.play();
      currentAudioSrc = audioSrc;
    }
  });
}

  // 댓글 저장/불러오기
  document.getElementById("saveBtn").addEventListener("click", saveComment);
  document.getElementById("loadBtn").addEventListener("click", displayComments);
  document.getElementById("backBtn").addEventListener("click", usAComment);

/* ========== 댓글 저장 ========== */
function saveComment() {
  var inputElement = document.getElementById("inputValue");
  var comment = inputElement.value.trim();
  if (comment === "") {
    alert("댓글을 입력하세요");
    return;
  }
  var comments = JSON.parse(localStorage.getItem("comments_jihun") || "[]");
  comments.push(comment);
  localStorage.setItem("comments_jihun", JSON.stringify(comments));
  alert("댓글이 저장되었습니다");
  inputElement.value = "";
}

function displayComments() {
  var comments = JSON.parse(localStorage.getItem("comments_jihun") || "[]");
  var outputElement = document.getElementById("output");
  if (comments.length > 0) {
    var listHTML = "<ul>";
    for (var i = 0; i < comments.length; i++) {
      listHTML += "<li>" + (i + 1) + ". " + comments[i] + "</li>";
    }
    listHTML += "</ul>";
    outputElement.innerHTML = listHTML;
  } else {
    outputElement.textContent = "저장된 댓글이 없습니다.";
  }

  document.getElementById("input-container").style.display = "none";
  document.getElementById("output-container").style.display = "block";
}

function usAComment(){
  document.getElementById("input-container").style.display = "block";
  document.getElementById("output-container").style.display = "none";
}
