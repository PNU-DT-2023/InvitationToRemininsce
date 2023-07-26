const pieceShape = [
  "85% 15%, 85% 38%, 100% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 70%, 38% 85%, 15% 85%, 15% 15%",
  "85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 70%, 38% 85%, 15% 85%, 15% 62%, 30% 50%, 15% 38%, 15% 15%",  
  "62% 15%, 85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 100%, 38% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "62% 15%, 85% 15%, 85% 38%, 85% 62%, 85% 85%, 62% 85%, 50% 100%, 38% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 0%, 62% 15%, 85% 15%, 85% 38%, 100% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 100%, 38% 85%, 15% 85%, 15% 62%, 15% 38%, 15% 15%, 38% 15%",
  "50% 0%, 62% 15%, 85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 70%, 38% 85%, 15% 85%, 15% 62%, 30% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 30%, 62% 15%, 85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 62% 85%, 50% 100%, 38% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 30%, 62% 15%, 85% 15%, 85% 38%, 85% 62%, 85% 85%, 62% 85%, 50% 70%, 38% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 30%, 62% 15%, 85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 62% 85%, 38% 85%, 15% 85%, 15% 62%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 0%, 62% 15%, 85% 15%, 85% 38%, 70% 50%, 85% 62%, 85% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 30%, 62% 15%, 85% 15%, 85% 38%, 100% 50%, 85% 62%, 85% 85%, 15% 85%, 15% 62%, 0% 50%, 15% 38%, 15% 15%, 38% 15%",  
  "50% 0%, 62% 15%, 85% 15%, 85% 85%, 15% 85%, 15% 62%, 30% 50%, 15% 38%, 15% 15%, 38% 15%"
];

const imageSrcURL = { 
  past : 'src/img/past.png',
  now : 'src/img/now.png',
}
export default imageSrcURL;

var imgPast = new Image();
imgPast.src = imageSrcURL.past;
var imgNow = new Image();
imgNow.src = imageSrcURL.now;

var activePiece = null;
var offset = { x: 0, y: 0 };
var snapOffset = 20;
var pieceRow = 4;
var pieceColumn = 3;
var pieceBorderSize = 2;

var solveButton = document.getElementById('puzzle-solve');
var progressNum = document.getElementById('progress-text');
var backgroundImage = document.querySelector('#image-now-bg img');

const loadingIcon = document.getElementById('loading-icon');

//이미지 잘라서 퍼즐조각 만드는 코드(직사각형)
imgPast.addEventListener('load', function () {

  const image = resizeImage(imgPast);
  const bgImage = resizeImage(imgNow);

  const boardImage = document.getElementById('image-now');
  //js에서 퍼즐 현재 이미지 삽입
  const imageNowElement = document.querySelector('#image-now img');
  
  setTimeout(() => {
    boardImage.style.display = 'block';
  }, 100);
 
  imageNowElement.src = bgImage.src;
  backgroundImage.src = image.src;
  const backgroundSize = window.getComputedStyle(boardImage);
  const width = parseInt(backgroundSize.getPropertyValue('width'), 10);
  const height = parseInt(backgroundSize.getPropertyValue('height'), 10);
  const bezelWidth = (image.width - width) / 2;
  const bezelHeight = (image.height - height) / 2;

  var boardTop = (window.innerHeight - height) / 2;
  var boardLeft = (window.innerWidth - width) / 2;
  var puzzleContainer = document.getElementById('puzzle');
  var puzzleBoard = document.getElementById('puzzle-board');
  var puzzlePieces = [];
  var puzzlePositions = [];
  var completed = new Set();
  var heighstZIndex = 10;
  var boardZIndex = -99;

  var pieceWidth = width / pieceRow;
  var pieceHeight = height / pieceColumn;
  var keyWidth = pieceWidth * 3 / 7;
  var keyHeight = pieceHeight * 3 / 7;

  var status = 0;

  for (var i = 0; i < pieceColumn; i++) {
    for (var j = 0; j < pieceRow; j++) {
      var pieceNum = i * pieceRow + j;

      //이미지 자르기
      var canvas = document.createElement('canvas');
      canvas.width = pieceWidth + keyWidth;
      canvas.height = pieceHeight + keyHeight;
      var context = canvas.getContext('2d');
      context.drawImage(
        image,
        j * pieceWidth + bezelWidth - keyWidth/2,
        i * pieceHeight + bezelHeight - keyHeight/2,
        pieceWidth + keyWidth,
        pieceHeight + keyHeight,
        0,
        0,
        pieceWidth + keyWidth,
        pieceHeight + keyHeight
      );

      //퍼즐조각 동적 추가
      var pieceWrap = document.createElement('div');
      
      pieceWrap.id = 'piece' + pieceNum;
      pieceWrap.className = 'puzzle-piece';
      
      var pieceInner = document.createElement('div');
      pieceInner.className = 'puzzle-piece-inner';
      pieceInner.style.width = pieceWidth + keyWidth + 'px';
      pieceInner.style.height = pieceHeight + keyHeight + 'px';
      pieceInner.style.cursor = 'pointer';
      pieceInner.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
      pieceInner.style.backgroundSize = (pieceWidth + keyWidth) + 'px ' + (pieceHeight + keyHeight) + 'px';
      pieceInner.style.clipPath = "polygon(" + pieceShape[pieceNum] + ")";

      pieceWrap.appendChild(pieceInner);
      puzzleContainer.appendChild(pieceWrap);
      puzzlePieces.push(pieceWrap);


      //퍼즐조각이 들어갈 위치(퍼즐판) 동적 추가
      var position = document.createElement('div');
      position.id = 'position' + (pieceNum);
      position.className = 'puzzle-position';
      position.style.top = boardTop + pieceHeight * i  - keyHeight/2 + 'px';
      position.style.left = boardLeft + pieceWidth * j - keyWidth/2 + 'px';
      position.style.height = pieceHeight + 'px';
      position.style.width = pieceWidth + 'px';
      puzzleBoard.appendChild(position);
      puzzlePositions.push(position);

      //조각 뿌리기
      shufflePieces();
    }
  }

  // 드래그 드랍 코드
  // 터치스크린 대응 추가
  puzzlePieces.forEach(function (piece, pieceIdx) {
    function handleMouseDown(e){
      e.preventDefault();
      if (!completed.has(pieceIdx)) {
        piece.style.zIndex = heighstZIndex++;
        activePiece = piece;
        const startX = e.clientX || e.touches[0].clientX;
        const startY = e.clientY || e.touches[0].clientY;
        offset.x = startX - piece.offsetLeft;
        offset.y = startY - piece.offsetTop;
      }
    }

    function handleMouseMove(e){
      e.preventDefault();
      if (activePiece == piece) {
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;


        piece.style.left = currentX - offset.x + 'px';
        piece.style.top = currentY - offset.y + 'px';
      }
    }

    function handleMouseUp(e){
      e.preventDefault();
      activePiece = null;

      //스냅 (mouseup에서 판정)
      //안맞는 위치에 있어도 스냅은 되도록.
      //맞는 위치에 들어가면 그 위치&퍼즐조각 사용 불가, z인덱스 맨 아래.
      puzzlePositions.forEach(function (position, posIdx) {
        if (!completed.has(posIdx) && (Math.abs(parseInt(piece.style.top) - parseInt(position.style.top)) < snapOffset) &&
          (Math.abs(parseInt(piece.style.left) - parseInt(position.style.left)) < snapOffset)) {
          piece.style.top = position.style.top;
          piece.style.left = position.style.left;
          if (pieceIdx == posIdx) {
            piece.classList.add("rightplace");
            completed.add(pieceIdx);
            piece.style.cursor = 'default';
            piece.style.zIndex = boardZIndex++;
          } else 
            piece.classList.add("snap");
            setTimeout(function () { piece.classList.remove("snap") }, 1000);
          }
      });


      status = parseInt(completed.size / (puzzlePieces.length) * 100);
      progressNum.textContent = status + '%';
      backgroundImage.style.opacity = status / 100;

      //모든 퍼즐 조각이 완성 (mouseup에서 판정)
      //메시지 띄우기(임시)
      if (completed.size == puzzlePieces.length) {
        loadingIcon.style.display = 'none';
        document.getElementById('puzzle-complete').setAttribute("class", "active");
        document.getElementById('progress-message').textContent = '추억 로딩 완료!';
        progressNum.textContent = '';
        setTimeout(() => {
          location.href = './ending.html';
        }, 1500);
      }
    }

    piece.addEventListener('mousedown', handleMouseDown);
    piece.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    piece.addEventListener('mouseup', handleMouseUp);
    piece.addEventListener('touchend', handleMouseUp);

  });

  solveButton.addEventListener("click", solvePuzzle);



  //////functions//////

  function resizeImage(sourceImage){
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (sourceImage.width <= viewportWidth && sourceImage.height <= viewportHeight) {
      return sourceImage;
    }

    const canvas = document.createElement('canvas');
  canvas.width = viewportWidth;
  canvas.height = viewportHeight;

  const ctx = canvas.getContext('2d');

  const scaleFactor = Math.max(viewportWidth / sourceImage.width, viewportHeight / sourceImage.height);;
  const scaledWidth = sourceImage.width * scaleFactor;
  const scaledHeight = sourceImage.height * scaleFactor;

  ctx.drawImage(sourceImage, 0, 0, scaledWidth, scaledHeight);

  const resizedImage = new Image();
  resizedImage.src = canvas.toDataURL('image/jpeg', 1.0);

  return resizedImage;
  }

  //퍼즐조각 랜덤 위치에 배치
  //너무 화면 바깥에 나가지 않도록
  //사진을 너무 가리지 않도록
  function shufflePieces() {
    puzzlePieces.forEach(function (piece) {
      var shuffleOffsetX = pieceWidth / 2;
      var shuffleOffsetY = pieceHeight / 2;
      var topOffset = 50;
      var randX, randY;
      var isInside = true;

      var centerX = window.innerWidth / 2;
      var rectWidth = width*0.7;
  
      while (isInside) {
        randX = Math.floor(Math.random() * (window.innerWidth - shuffleOffsetX));
        randY = Math.floor(Math.random() * (window.innerHeight - shuffleOffsetY));
  
        if (
          randX >= centerX - rectWidth / 2 && randX <= centerX - shuffleOffsetX + rectWidth / 2 
        ) {
          continue;
        }

        isInside = false;
      }

      piece.style.left = randX - shuffleOffsetX + 'px';
      piece.style.top = randY + 'px';

    });
  }

  //개발자용 마법버튼
  //누르고 퍼즐판 한번 클릭하면 완성한거랑 같은 효과
  function solvePuzzle() {
    puzzlePieces.forEach(function (piece, idx) {
      piece.style.top = puzzlePositions.at(idx).style.top;
      piece.style.left = puzzlePositions.at(idx).style.left;
      completed.add(idx);
      piece.style.cursor = 'default';
      piece.style.zIndex = '-99'
      piece.classList.add("rightplace");
    });
  }

});