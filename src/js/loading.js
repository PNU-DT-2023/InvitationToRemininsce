const dimSolid = document.querySelector(".dim-solid");
const messages = document.querySelectorAll(".loading-message>p");
const path = document.querySelector("#line"); //편지외곽선
const envelopeBox = document.querySelector("#envelope-outline");
const envelopeFill = document.querySelector("#envelope-filled");
const loadingBar = document.querySelector(".loading-bar");
const loadingBarLine = document.querySelector(".loading-bar .line-box .line");
const goBtn = document.querySelector("#go-btn");
const buttonWrapper = document.querySelector(".button-wrapper");
const title = document.querySelector(".title");
const decoText = document.querySelectorAll(".deco-text");
let currentIndex = 0;
let totalLoadingTime = 6000; //총 로딩시간
initMessage();

const length = path.getTotalLength();
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;



function showNextMessage() {
    const currentMessage = messages[currentIndex];
    if (currentMessage) {
        currentMessage.style.display = 'block';
        setTimeout(() => {
            currentMessage.style.display = 'none';
            currentIndex++;
            showNextMessage();
        }, (totalLoadingTime/(messages.length)));
    }
}

function initMessage () {
    messages.forEach((m) => {
        m.style.display = 'none';
    });
}

function drawLine () {
        path.style.transition = 'stroke-dashoffset 8s ease-in';
        path.style.strokeDashoffset = '0'; 
        dimSolid.style.transition = 'opacity 8s ease-in';
        dimSolid.style.opacity = '0.6';
        path.addEventListener('transitionend', () => {
            setTimeout(fillEnvelope, 2000);
        });  
}
function showTItle () {
    title.style.transition = 'opacity .3s ease-in';
    title.style.opacity = '1';
    loadingBar.style.display ='block';
}
function fillEnvelope () {
    envelopeFill.style.transition = 'opacity 2s ease';
    envelopeFill.style.opacity = '1';
    buttonWrapper.style.display = 'flex';
    showDecoText();
}
function showDecoText () {
    decoText.forEach((e) => {
        e.style.opacity = 1;
    })
}

setTimeout(() => {
    drawLine();
    dimSolid.classList.add("loading-animation");
    loadingBarLine.classList.add("loading-start");
    setTimeout(showNextMessage, 2000);
    setTimeout(showTItle, 2000);
}, 1000);

goBtn.addEventListener('click', () => {
    location.href = '../puzzlepage.html';
})
