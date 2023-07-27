import { init, animate, update } from './viewer.js'
 
const frame = document.querySelector('.content-wrapper');
const ui = document.querySelector('.ui-wrapper');

const homeButton = document.getElementById("home-btn");
const homeButtonSmall = document.getElementById("home-btn-s");
const offPopupButton = document.getElementById("watching-mode-btn");
const notice = document.getElementById("swipeNotice");

const moveToHome = () => {
    location.href = './index.html';
}
const watchingMode = () => {
    ui.classList.remove('show-animation');
    homeButtonSmall.classList.add('show');
    homeButtonSmall.addEventListener('click', moveToHome);
    homeButtonSmall.addEventListener('touch', moveToHome);

    // 파노라마뷰 시작
    init();
    animate();
    showNotice();
    const container = document.querySelector('.container');
    container.addEventListener('click',hideNotice);
    container.addEventListener('touch',hideNotice);
}

const startEnding = () => {
    frame.classList.add('contract-animation');
    frame.addEventListener('animationend', () => {
        ui.classList.add('show-animation');
        
        homeButton.addEventListener('click', moveToHome);
        homeButton.addEventListener('touch', moveToHome);
        offPopupButton.addEventListener('click',watchingMode);   
        offPopupButton.addEventListener('touch',watchingMode);
    })
}
const showNotice = () => {
   notice.style.display = 'block';
   setTimeout(() => {
    notice.style.opacity = 1;
   }, 100);
//    setTimeout(() => {

//    }, 3500);
}

const hideNotice = () => {
    notice.style.opacity = 0;
}

setTimeout(startEnding, 1000);