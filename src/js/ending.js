const frame = document.querySelector('.content-wrapper');
const ui = document.querySelector('.ui-wrapper');

frame.classList.add('contract-animation');
setTimeout(() => {
        ui.classList.add('show-animation');
}, 3000);


