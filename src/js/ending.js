const imgContainer = document.querySelector('#image-past');
const img = document.querySelector('#image-past img');

// 확장 애니메이션
setTimeout(() => {
    imgContainer.classList.toggle('expand-animation');
}, 1000);

// (임시)마우스 움직이면 이미지 변형
setTimeout(() => {
    imgContainer.addEventListener('mousemove', tiltImage);
}, 2000);

function tiltImage(event) {
    const xAxis = (window.innerWidth / 2 - event.clientX)*0.01 ;
    const yAxis = (window.innerHeight / 2 - event.clientY)*0.01 ;
    img.style.transform = `translate(-${50}%, -50%) skew(${xAxis}deg, ${yAxis}deg)`;
}
  
imgContainer.addEventListener('mouseout', resetTilt);

// 초기화
function resetTilt() {
    img.style.transform = 'translate(-50%, -50%) skew(0)';
}
