var image = new Image();
image.src = 'src/img/puzzlesample-past-wide.jpg';

var activePiece = null;
var offset = { x: 0, y: 0 };
var snapOffset = 20;
var pieceRow = 4;
var pieceColumn = 3;

var solveButton = document.getElementById('puzzle-solve');
var progressNum = document.getElementById('progress-text');
var progressBar = document.getElementById('progress-bar');
var spotLeft = document.getElementById('left');
var spotRight = document.getElementById('right');
var subway = document.getElementById('subway');

//이미지 잘라서 퍼즐조각 만드는 코드(직사각형)
image.addEventListener('load', function () {

  const backgroundImage = document.getElementById('image-now');
  const backgroundSize = window.getComputedStyle(backgroundImage);
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

  var status = 0;

  for (var i = 0; i < pieceColumn; i++) {
    for (var j = 0; j < pieceRow; j++) {

      //이미지 자르기
      var canvas = document.createElement('canvas');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
      var context = canvas.getContext('2d');
      context.drawImage(
        image,
        j * pieceWidth + bezelWidth,
        i * pieceHeight + bezelHeight,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      );

      //퍼즐조각 동적 추가
      var piece = document.createElement('div');
      piece.id = 'piece' + (i * pieceColumn + j);
      piece.className = 'puzzle-piece';
      piece.style.width = pieceWidth + 'px';
      piece.style.height = pieceHeight + 'px';
      piece.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
      piece.style.backgroundSize = pieceWidth + 'px ' + pieceHeight + 'px';
      piece.style.cursor = 'pointer';

      puzzleContainer.appendChild(piece);
      puzzlePieces.push(piece);


      //퍼즐조각이 들어갈 위치(퍼즐판) 동적 추가
      var position = document.createElement('div');
      position.id = 'position' + (i * pieceColumn + j);
      position.className = 'puzzle-position';
      position.style.top = boardTop + pieceHeight * i + 'px';
      position.style.left = boardLeft + pieceWidth * j + 'px';
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
          piece.classList.add("snap");
          setTimeout(function () { piece.classList.remove("snap") }, 500);
          if (pieceIdx == posIdx) {
            piece.classList.add("rightplace");
            completed.add(pieceIdx);
            piece.style.cursor = 'default';
            piece.style.zIndex = boardZIndex--;
          }
        }
      });


      status = parseInt(completed.size / (puzzlePieces.length) * 100);
      progressNum.textContent = status + '%';

      progressBar.style.width = status + '%';
      subway.style.left = status + '%';
      if(status!= 0){ spotLeft.classList.remove("here") }
      if(status == 100){ spotRight.classList.add("here"); }


      //모든 퍼즐 조각이 완성 (mouseup에서 판정)
      //메시지 띄우기(임시)
      if (completed.size == puzzlePieces.length) {
        setTimeout(() => {
          document.getElementById('puzzle-complete').setAttribute("class", "active");
          location.href = './ending.html';
        }, 1000);
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


  //퍼즐조각 랜덤 위치에 배치
  //너무 화면 바깥에 나가지 않도록
  //사진을 너무 가리지 않도록
  function shufflePieces() {
    puzzlePieces.forEach(function (piece) {
      var shuffleOffsetX = pieceWidth / 2;
      var shuffleOffsetY = pieceHeight / 2;
      var randX, randY;
      var isInside = true;

      while (isInside) { //랜덤좌표 생성하다가
        randX = Math.floor(Math.random() * (window.innerWidth - shuffleOffsetX));
        randY = Math.floor(Math.random() * (window.innerHeight - shuffleOffsetY));

        if ( //사진 안쪽이 아닐때 while문 탈출
          randX < boardLeft - shuffleOffsetX || randX > boardLeft + width - shuffleOffsetX
          // || randY < boardTop - shuffleOffsetY || randY > window.innerHeight
        ) { isInside = false }
      }

      piece.style.left = randX + 'px';
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