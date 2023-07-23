const main = document.querySelector("#envelope");
const loading = document.querySelector("#loading");

function begin() {
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";
    setTimeout(() => {
        loading.style.WebkitAnimation = "fadeIn 1s";
        loading.style.animation = "fadeIn 1s";
        setTimeout(() => {
            main.style.display = "none";
            loading.style.display = "block";
        }, 450);
    }, 450);
}

// 2초 후에 showTxt2 함수 호출
setTimeout(showTxt2, 2000);

// 4초 후에 begin 함수 호출 (2초 후에 showTxt2가 실행되므로, begin은 4초 뒤에 실행되도록 수정)
setTimeout(begin, 4000);

// 2초 후에 txt1을 숨기고 txt2를 표시하는 함수
function showTxt2() {
    const txt1Element = document.querySelector('.txt1');
    const txt2Element = document.querySelector('.txt2');
    txt1Element.style.display = 'none';
    txt2Element.style.display = 'block';
}

const text = document.querySelector('.text');
let animationActive = false;

main.onclick = function() {
    if (!animationActive) {
        animationActive = true;
        main.style.animation = 'animate 0.5s 2';
        setTimeout(function() {
            main.src = "envelope2.png";
            text.style.display = 'none';

            setTimeout(function() {
                main.src = "envelope3.png";
                main.style.animation = 'none';
                animationActive = false;
            }, 1000);
        }, 2000);
    }
};
