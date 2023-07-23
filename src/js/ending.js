const frame = document.querySelector('.content-wrapper');
const ui = document.querySelector('.ui-wrapper');

const homeButton = document.getElementById("home-btn");
const homeButtonSmall = document.getElementById("home-btn-s");
const offPopupButton = document.getElementById("watching-mode-btn");

frame.classList.add('contract-animation');
setTimeout(() => {
        ui.classList.add('show-animation');
        homeButton.addEventListener('click', function() {
            location.href = './index.html';
        })

        offPopupButton.addEventListener('click', function() {
            ui.classList.add('hide');
            homeButtonSmall.classList.add('show');
            ui.classList.add('show-animation');
            homeButtonSmall.addEventListener('click', function() {
                location.href = './index.html';
            })
        })
}, 3000);


