const dimSolid = document.querySelector(".dim-solid");
const textLayout = document.querySelector(".text-layer");
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

window.onload = function() {
    envelopeBox.style.display = 'block';
    textLayout.style.display = 'grid';
};

// 로딩 메세지 띄우기
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

// 로딩 스티커 띄우기
const stickerWrapper = document.querySelector(".stickers")
const stickers = document.querySelectorAll(".stickers >*")
let stickerIndex = 0;
function showStickers() {
    const sticker = stickers[stickerIndex];
    if (sticker) {
        sticker.style.display = 'block';
        setTimeout(() => {
            sticker.classList.add('showed');
            sticker.style.opacity = 1;
            stickerIndex++;
            showStickers();
        }, (totalLoadingTime/(stickers.length)));
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
            setTimeout(fillEnvelope, 100);
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
    hideLoadingBar();
    showDecoText();
}
function showDecoText () {
    decoText.forEach((e) => {
        e.style.opacity = 1;
    })
}
function hideLoadingBar () {
    loadingBar.style.display = 'none';
}

setTimeout(() => {
    drawLine();
    dimSolid.classList.add("loading-animation");
    loadingBarLine.classList.add("loading-start");
    showStickers()
    setTimeout(showNextMessage, 2000);
    setTimeout(showTItle, 2000);
}, 1000);

goBtn.addEventListener('click', () => {
    location.href = '../puzzlepage.html';
})
