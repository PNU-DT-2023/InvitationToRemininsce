const envelope = document.getElementById('envelope');
const text = document.querySelector('.text'); // 텍스트 요소 가져오기
let animationActive = false; // 애니메이션이 작동중인지 여부를 나타내는 변수

envelope.onclick = function() {
    if (!animationActive) { // 애니메이션이 작동중이지 않을 때만 실행
        animationActive = true; // 애니메이션이 작동중임을 표시

        // 애니메이션 속도와 반복 횟수 설정
        envelope.style.animation = 'animate 0.5s 2'; // 0.5초 동안 애니메이션을 2회 반복

        setTimeout(function() {
            envelope.src = "envelope2.png"; // 2초 후 이미지를 'envelope2.png'로 변경
            text.style.display = 'none'; // 텍스트를 숨깁니다.

            setTimeout(function() {
                envelope.src = "envelope3.png"; // 1초 후 이미지를 'envelope3.png'로 변경
                setTimeout(function() {
                    const startSection = document.getElementById('start');
                    const loadingSection = document.getElementById('loading');
                    startSection.style.display = 'none'; // start 섹션 숨기기
                    loadingSection.style.display = 'block'; // loading 섹션 표시
                }, 1500); // 2초 후 loading 섹션 표시

                envelope.style.animation = 'none'; // 애니메이션 효과 제거
                animationActive = false; // 애니메이션이 끝났음을 표시
            }, 1500); // 1초 후 실행

        }, 2000); // 2초 후 실행

    }
};
