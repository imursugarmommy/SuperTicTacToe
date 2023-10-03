const playCourt = document.querySelector('.wrapper');
const bigFields = document.querySelectorAll('.wrapper > *');
const fields = document.querySelectorAll('.big-box > *');
let moves = 0;
let playerTurn = 'X';
const playerTurnHTML = document.querySelector('.turn');
let isGameOver = false;
let draw = false;
let roundWon = false;
let p1Count = 0;
let p2Count = 0;
const p1CountHTML = document.querySelectorAll('.p1');
const p2CountHTML = document.querySelectorAll('.p2');
const errorMessage = document.querySelector('.error');

let placeableMoves = [
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
];

let bigFieldPlacedMoves = ['', '', '', '', '', '', '', '', ''];

const winningOptions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const statusText = document.querySelector('.win-info');
const popup = document.querySelector('.popup');
const restartBtn = document.querySelector('.restart');

playerTurnHTML.innerHTML = `${playerTurn}'s Turn`;

gameStart();

function gameStart() {
  bigFields.forEach((bigField) => {
    bigField.addEventListener('click', (e) => {
      // adding class 'clicked' so when clicked they can't click anywhere else unless moved
      const bigCellIndex = e.target.parentNode.getAttribute('bigCellIndex');
      const cellIndex = e.target.getAttribute('cellIndex');
      const clicked = e.target;

      clicked.classList.add('clicked');

      if (cellIndex != null) {
        if (isGameOver) {
          return;
        }

        // * overwriting fix
        if (clicked.innerText !== '') {
          return;
        }
        e.target.innerText = playerTurn;

        const currentPlacedMovesLocation = placeableMoves[bigCellIndex];

        currentPlacedMovesLocation.splice(cellIndex, 1, playerTurn);

        for (let i = 0; i < placeableMoves.length; i++) {
          const placedMove = placeableMoves[i];
          const winnerField = e.target;
          const bigCellIndexSetWinner =
            winnerField.parentNode.getAttribute('bigCellIndex');
          const winningBigField = bigFields[bigCellIndexSetWinner];

          checkWinner(placedMove, winnerField);

          if (
            !placedMove.includes('') &&
            winningBigField.getAttribute('won') !== 'true'
          ) {
            // * wenn ein draw in einem Feld passiert, dann wird der komplette Array wieder blank (9 empty strings)
            for (let i = 0; i < placedMove.length; i++) {
              // backend nicht vergessen !
              placedMove.splice(i, 1, '');
            }

            // * bug fixed: wenn ein draw in einem Feld passiert, dann werden alle .innerText = ''
            // * zusaetzlicher blink-Effekt
            const fieldDivs =
              bigFields[bigCellIndexSetWinner].getElementsByTagName('div');
            const fieldDivsArray = Array.from(fieldDivs);

            const blinkingDiv = bigFields[bigCellIndexSetWinner];

            let isTransparent = false;
            blinkingDiv.style.color = 'var(--highlight)';

            const intervalId = setInterval(() => {
              if (isTransparent) {
                blinkingDiv.style.background = 'var(--highlight)';
              } else {
                blinkingDiv.style.background = 'transparent';
              }

              isTransparent = !isTransparent;
            }, 100);

            setTimeout(() => {
              clearInterval(intervalId);

              blinkingDiv.style.background = 'transparent';

              fieldDivsArray.forEach((array) => {
                // the actual disappearing text
                array.innerText = '';
              });

              // ? gescheiterter Versuch zu dem Effekt noch was hinzuzufuegen semi primaer, nur cool zu haben
              // const centerA = getCenterPosition(blinkingDiv);
              // const x = centerA.x;
              // const y = centerA.y;

              // const drawEffektElem = document.querySelector('.draw-effekt-text');

              // drawEffektElem.style.display = 'block';
              // drawEffektElem.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%);`;
            }, 800);
          }
        }

        checkBigGridWinner();

        changePlayer();

        // * bug (fixed): trotz schon voll besetztem Felde clicked-class weitergegeben an gross-grid index

        if (bigFields[cellIndex].getAttribute('won') !== 'true') {
          clicked.parentNode.classList.remove('clicked');
          clicked.classList.remove('clicked');
          bigFields[cellIndex].classList.add('clicked');

          bigFields.forEach((court) => {
            if (!court.classList.contains('clicked')) {
              court.style.pointerEvents = 'none';
            }
          });
        } else {
          bigFields.forEach((field) => {
            field.classList.remove('clicked');
          });

          bigFields.forEach((field) => {
            if (field.getAttribute('won') !== 'true') {
              field.style.pointerEvents = 'all';
            }
          });

          // ? Vielleicht sollte man considern statt frei waehlen zu koennen man einfach im vorherigem Feld bleibt, ausser wenn das Feld gerade gewonnen wurde ?
          errorMessage.innerText = `Field has already been won! Player (${playerTurn}) can choose freely now.`;
          errorMessage.style.animation = 'error 3s linear';
          setTimeout(() => {
            errorMessage.style.animation = 'none';
          }, 3000);
        }
      }
    });
  });
}

function checkWinner(move, winner) {
  for (let i = 0; i < winningOptions.length; i++) {
    const conditions = winningOptions[i];
    const bigCellIndexSetWinner =
      winner.parentNode.getAttribute('bigCellIndex');

    const cellA = move[conditions[0]];
    const cellB = move[conditions[1]];
    const cellC = move[conditions[2]];

    if (cellA === cellB && cellB === cellC && cellA !== '') {
      const winningBigField = bigFields[bigCellIndexSetWinner];
      const winningFieldArray = winningBigField.getElementsByTagName('div');

      const winningfield1 = winningFieldArray[conditions[0]];
      const winningfield2 = winningFieldArray[conditions[1]];
      const winningfield3 = winningFieldArray[conditions[2]];

      // * fix, dass in allen feldern die winnerfields von einem Feld angezeigt werden
      if (
        (winningfield1.innerText === 'X' || winningfield1.innerText === 'O') &&
        (winningfield2.innerText === 'X' || winningfield2.innerText === 'O') &&
        (winningfield3.innerText === 'X' || winningfield3.innerText === 'O')
      ) {
        if (winningfield1.innerText == winningfield2.innerText) {
          if (winningfield2.innerText == winningfield3.innerText) {
            winningfield1.style.background = 'var(--highlight)';
            winningfield2.style.background = 'var(--highlight)';
            winningfield3.style.background = 'var(--highlight)';

            winningBigField.setAttribute('won', 'true');
          }
        }
      }

      // * wenn Feld besetzt ist deren Index soeben clicked wurde, so bleibt man im vorherigen Feld
      // * wenn vorheriges Feld mit diesem Zug gewonnen hat und nicht in ein anderes Feld gebracht wird
      // * plaziert man weiterhin im gewonnenen Feld
      // * wenn im gewonnenem Feld platziert wird, wird die class ueberschrieben

      // * Bug fixed
      if (winningBigField.getAttribute('won') === 'true') {
        winningBigField.classList.add('won');
        winningBigField.classList.add(playerTurn);

        let winningBigFieldIndex = winningBigField.getAttribute('bigCellIndex');
        bigFieldPlacedMoves.splice(winningBigFieldIndex, 1, playerTurn);

        moves++;
      }

      break;
    }
  }
}

function checkBigGridWinner() {
  roundWon = false;

  for (let i = 0; i < winningOptions.length; i++) {
    const options = winningOptions[i];

    const bigA = bigFieldPlacedMoves[options[0]];
    const bigB = bigFieldPlacedMoves[options[1]];
    const bigC = bigFieldPlacedMoves[options[2]];

    if (bigA === bigB && bigB === bigC && bigA !== '') {
      roundWon = true;

      // ! find a way to either hightlight winning Cells or draw a line through them
      drawLineThroughWinningFields(options);
    }
  }

  if ((moves = 9) && !bigFieldPlacedMoves.includes('')) {
    draw = true;
  }

  if (draw) {
    isGameOver = true;
    statusText.innerText = "It's a draw!";
  }

  if (roundWon) {
    isGameOver = true;
    statusText.innerText = `${playerTurn} wins!`;

    if (playerTurn === 'X') {
      p1Count++;
    } else {
      p2Count++;
    }

    p1CountHTML.forEach((count) => {
      count.innerHTML = p1Count;
    });
    p2CountHTML.forEach((count) => {
      count.innerHTML = p2Count;
    });
  }

  if (isGameOver) {
    popup.style.display = 'flex';
    restartBtn.style.display = 'block';
    restartBtn.style.zIndex = '1001';
    c.style.zIndex = '1000';

    bigFields.forEach((field) => {
      field.style.pointerEvents = 'none';
    });
  }
}

restartBtn.addEventListener('click', () => {
  moves = 0;
  playerTurn = 'X';
  isGameOver = false;
  draw = false;

  fields.forEach((field) => {
    field.innerText = '';

    // resets highlight onclick
    field.style.background = 'none';
  });

  bigFields.forEach((field) => {
    // remove a bunch of classes
    field.classList.remove('won');
    field.classList.remove('X');
    field.classList.remove('O');

    field.classList.remove('clicked');
    field.style.pointerEvents = 'all';

    field.setAttribute('won', 'false');
  });

  popup.style.display = 'none';
  restartBtn.style.display = 'none';

  bigFieldPlacedMoves = ['', '', '', '', '', '', '', '', ''];
  placeableMoves = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ];

  c.style.zIndex = '-1';
  ctx.clearRect(0, 0, c.width, c.height);

  playerTurnHTML.innerHTML = `${playerTurn}'s Turn`;

  gameStart();
});

function changePlayer() {
  if (playerTurn === 'X') {
    playerTurn = 'O';
  } else if (playerTurn === 'O') {
    playerTurn = 'X';
  }
  playerTurnHTML.innerHTML = `${playerTurn}'s Turn`;
}

function getCenterPosition(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return { x: centerX, y: centerY };
}

const c = document.getElementById('stroke');
const ctx = c.getContext('2d');

function drawLineThroughWinningFields(options) {
  c.style.display = 'block';

  // Get the center positions of the winning big fields
  const centerPositions = options.map((index) => {
    const field = bigFields[index];
    return getCenterPosition(field);
  });

  // Set the canvas size to match the window size
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // Draw a line through the center positions of the winning big fields
  ctx.beginPath();

  if (centerPositions[0].x === centerPositions[2].x) {
    ctx.moveTo(centerPositions[0].x, centerPositions[0].y - 50);
    ctx.lineTo(centerPositions[2].x, centerPositions[2].y + 50);
    console.log('vertikal');
  } else if (centerPositions[0].y === centerPositions[2].y) {
    ctx.moveTo(centerPositions[0].x - 50, centerPositions[0].y);
    ctx.lineTo(centerPositions[2].x + 50, centerPositions[2].y);
    console.log('horizontal');
  } else {
    ctx.moveTo(centerPositions[0].x - 50, centerPositions[0].y - 50);
    ctx.lineTo(centerPositions[2].x + 50, centerPositions[2].y + 50);
    console.log('diagonal');
  }

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#606060';
  ctx.lineJoin = 'round';
  ctx.stroke();
}
