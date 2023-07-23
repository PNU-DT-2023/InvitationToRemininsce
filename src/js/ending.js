const frame = document.querySelector('.content-wrapper');
const ui = document.querySelector('.ui-wrapper');

const homeButton = document.getElementById("home-btn");
const homeButtonSmall = document.getElementById("home-btn-s");
const offPopupButton = document.getElementById("watching-mode-btn");

const moveToHome = () => {
    location.href = './index.html';
}
const hideUI = () => {
    ui.classList.remove('show-animation');
    homeButtonSmall.classList.add('show');
    homeButtonSmall.addEventListener('click', moveToHome);
    homeButtonSmall.addEventListener('touch', moveToHome);
}

const startEnding = () => {
    frame.classList.add('contract-animation');
    frame.addEventListener('animationend', () => {
        console.log('show');
        ui.classList.add('show-animation');
        
        homeButton.addEventListener('click', moveToHome);
        homeButton.addEventListener('touch', moveToHome);
        offPopupButton.addEventListener('click',hideUI);   
        offPopupButton.addEventListener('touch',hideUI);
    })
}

setTimeout(startEnding, 1000);