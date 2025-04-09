/*-----------------------------------------공통 nav-------------------------------------------*/

import { fetchAndInsert } from '../navi/navi.js';
fetchAndInsert('../navi/navi.html', 'navi-container');

/*--------------------------------------공통 nav END------------------------------------------*/

/*-----------------------------------------함수 전역 선언-------------------------------------------*/
window.phone = phone;
window.handlePlay = handlePlay;
window.handleFavorite = handleFavorite;
window.handleRepeat = handleRepeat;
window.handleVolume = handleVolume;
/*--------------------------------------함수 전역 선언 END------------------------------------------*/

//Toggling Menu
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if(toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        })
    }
}

showMenu('nav-toggle', 'nav-menu');

//Toggling Active Link
const navLink = document.querySelectorAll('.nav-link');

function linkAction() {
    navLink.forEach(n => n.classList.remove('active'));
    this.classList.add('active');

    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

// Scroll Reveal

const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: true
})

sr.reveal('.home-title', {} )
sr.reveal('.button', {delay: 200} )
sr.reveal('.home-img', {delay: 400} )
sr.reveal('.home-social', {delay: 400,} )

// About Me 섹션
sr.reveal('.card', { interval: 200 });

// Favorites 섹션
sr.reveal('.option', { interval: 200 });


sr.reveal('.skills-subtitle', {delay: 100} )
sr.reveal('.skills-text', {delay: 150} )
sr.reveal('.skills-data', {interval: 200} )
sr.reveal('.skills-img', {delay: 400} )

sr.reveal('.project-img', {interval: 200} )

sr.reveal('.contact-input', {interval: 200} )


/*----------------------스크롤 이동에 따른 개인 nav의 메뉴 active 효과--------------------------*/
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY || window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const navItem = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');
    
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
            if (navItem) navItem.classList.add('active');
        }
    });
});



window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY || window.pageYOffset;
    const navLogo = document.getElementById('nav-logo');
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const navItem = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
            if (navItem) navItem.classList.add('active');

            // 💡 home 섹션에 있는지 체크해서 로고 색 변경
            if (sectionId === "home") {
                navLogo.classList.add('active');
            } else {
                navLogo.classList.remove('active');
            }
        }
    });
});


/*--------------------스크롤 이동에 따른 개인 nav의 메뉴 active 효과 END------------------------*/


/*----------------------------사이드 SNS버튼 안의 연락처 버튼 swal------------------------------*/
function phone(){
    Swal.fire({
        html : '<i class="bi bi-telephone-fill"></i> 010-4186-1829<br> <i class="bi bi-envelope-fill"></i> ykw1230@naver.com',
        icon : "info",
        confirmButtonText : "닫기"
    });
}
/*--------------------------사이드 SNS버튼 안의 연락처 버튼 swa END----------------------------*/


// About me 카드 클릭 시 열고 닫기
document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});



// Favorites 카드 클릭 시 확장
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});


// --------------------------music plyaer------------------------------------
// player
var music = document.querySelector('.music-element')
var playBtn = document.querySelector('.play')
var seekbar = document.querySelector('.seekbar')
var currentTime = document.querySelector('.current-time')
var duration = document.querySelector('.duration')

function handlePlay() {
    if (music.paused) {
        music.play();
        playBtn.className = 'pause'
        playBtn.innerHTML = '<i class="material-icons">pause</i>'
    } else {
        music.pause();
        playBtn.className = 'play'
        playBtn.innerHTML = '<i class="material-icons">play_arrow</i>'
    }
    music.addEventListener('ended', function () {
        playBtn.className = 'play'
        playBtn.innerHTML = '<i class="material-icons">play_arrow</i>'
        music.currentTime = 0
    });
}

music.onloadeddata = function () {
    seekbar.max = music.duration
    var ds = parseInt(music.duration % 60).toString().padStart(2, '0');
    var dm = parseInt((music.duration / 60) % 60)
    duration.innerHTML = dm + ':' + ds
}
music.ontimeupdate = function () { seekbar.value = music.currentTime }
handleSeekBar = function () { music.currentTime = seekbar.value }
music.addEventListener('timeupdate', function () {
    var cs = parseInt(music.currentTime % 60).toString().padStart(2, '0');
    var cm = parseInt((music.currentTime / 60) % 60)
    currentTime.innerHTML = cm + ':' + cs
}, false)


// like
var favIcon = document.querySelector('.favorite')
function handleFavorite() {
    favIcon.classList.toggle('active');
}


// repeat
var repIcon = document.querySelector('.repeat')
function handleRepeat() {
    if (music.loop == true) {
        music.loop = false
        repIcon.classList.toggle('active')
    }
    else {
        music.loop = true
        repIcon.classList.toggle('active')
    }
}

// volume
var volIcon = document.querySelector('.volume')
var volBox = document.querySelector('.volume-box')
var volumeRange = document.querySelector('.volume-range')
var volumeDown = document.querySelector('.volume-down')
var volumeUp = document.querySelector('.volume-up')

function handleVolume() {
    volIcon.classList.toggle('active')
    volBox.classList.toggle('active')
}

volumeDown.addEventListener('click', handleVolumeDown);
volumeUp.addEventListener('click', handleVolumeUp);

function handleVolumeDown() {
    volumeRange.value = Number(volumeRange.value) - 20
    music.volume = volumeRange.value / 100
}
function handleVolumeUp() {
    volumeRange.value = Number(volumeRange.value) + 20
    music.volume = volumeRange.value / 100
}





