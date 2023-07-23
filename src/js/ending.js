const frame = document.querySelector('.content-wrapper');
const ui = document.querySelector('.ui-wrapper');
const homeButton = document.getElementById("home-btn");


frame.classList.add('contract-animation');
setTimeout(() => {
        ui.classList.add('show-animation');
        homeButton.addEventListener('click', function() {
            location.href = './index.html';
        })
}, 3000);


