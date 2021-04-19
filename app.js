'use strict';

// Your main goal here is to have as little global code as possible.
// Try tucking everything away inside of a module or factory.
// Rule of thumb: if you only ever need ONE of something // (gameBoard, displayController), use a module.
// If you need multiples  of something (players!), create them with factories.
// https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/tic-tac-toe

//gameboard = module pattern (only happens once)
const gameboard = (function () {
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  let gameboardStatus = [];
  function getGameboardStatus() {
    gameboardStatus = [];
    document.querySelectorAll('.cell').forEach((div) => {
      gameboardStatus.push(div.textContent);
    });
    gameboard.gameboardStatus = gameboardStatus;
  }
  return { squares, getGameboardStatus, gameboardStatus };
})();

//players are stored as objects -- use factory function (it's used multiple times)
const Person = (aName, aMarker) => {
  let _name = aName;

  function sayName() {
    return _name;
  }
  let marker = aMarker;

  function updateName1() {
    _name = document.getElementById('player1').value;
  }
  function updateName2() {
    _name = document.getElementById('player2').value;
  }

  return { sayName, marker, updateName1, updateName2 };
};

const player1 = Person('player1', 'X');
const player2 = Person('player2', 'O');

document
  .getElementById('player1')
  .addEventListener('change', player1.updateName1);
document
  .getElementById('player2')
  .addEventListener('change', player2.updateName2);

// an object to control the flow of the game
// - we only need this once - make it a module pattern
const gameFlow = (function () {
  let whoseTurn = 'player1';
  let currentMark = 'X'; //will change when whoseturn changes.
  let endOfGame = false;
  let allowPlayAgainBtn = false;
  let checkboxSection = document.getElementById('checkbox-section');

  function checkIfTaken(e) {
    let thisDiv = e.target;

    if (!gameFlow.endOfGame) {
      if (thisDiv.textContent == '') {
        displayController.placeMark(e);
        gameFlow.checkGameOver();
        if (!gameFlow.endOfGame) {
          switchWhoseTurn();
        }
      } else {
        // there's a mark here already! Do nothing.
      }
    }
  }

  const isCompCheckbox = document.getElementById('is-computer');
  let p2IsComputer = true; //initial condition
  isCompCheckbox.addEventListener('click', getCheckboxChecked);

  function getCheckboxChecked(e) {
    gameFlow.p2IsComputer = e.target['checked'];
  }

  function switchWhoseTurn() {
    if (gameFlow.whoseTurn == 'player1') {
      //after player's turn:
      gameFlow.whoseTurn = 'player2';
      document.getElementById('whose-turn').textContent =
        player2.sayName() + "'s turn";
      gameFlow.currentMark = player2.marker;

      if (gameFlow.p2IsComputer == true) {
        window.setTimeout(function () {
          _computerTakesTurn();
          gameFlow.checkGameOver();
          if (!gameFlow.endOfGame) {
            switchWhoseTurn(); // should go to the else stuff below
          }
        }, 500);
      } else {
        // you click as player 2
      }
    } else {
      gameFlow.whoseTurn = 'player1';
      document.getElementById('whose-turn').textContent =
        player1.sayName() + "'s turn";
      gameFlow.currentMark = player1.marker;
    }
  }

  function checkGameOver() {
    gameboard.getGameboardStatus();
    // gameboard.gameboardStatus;

    const winningIds = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let round = 0;
    gameboard.gameboardStatus.forEach((thisCell) => {
      if (!(thisCell == '')) {
        round++;
      }
    });

    for (let i = 0; i < winningIds.length; i++) {
      let lilArray = winningIds[i];

      // lilArray[0] //3
      // gameboard.gameboardStatus[lilArray[0]] // ''  or 'X' or 'O'
      let spotA = gameboard.gameboardStatus[lilArray[0]]; // ''  or 'X' or 'O'
      let spotB = gameboard.gameboardStatus[lilArray[1]]; // ''  or 'X' or 'O'
      let spotC = gameboard.gameboardStatus[lilArray[2]]; // ''  or 'X' or 'O'

      //check if player won
      if (
        spotA == player1.marker &&
        spotB == player1.marker &&
        spotC == player1.marker
      ) {
        //yes player has won
        gameFlow.winHappened(player1);
        break;
      }

      //check if computer won
      if (
        spotA == player2.marker &&
        spotB == player2.marker &&
        spotC == player2.marker
      ) {
        //yes player2 has won
        gameFlow.winHappened(player2);
        break;
      }

      if (i == winningIds.length - 1 && round >= 9) {
        //tie game
        gameFlow.tieHappened();
      }
    }
  }

  function _computerTakesTurn() {
    gameboard.getGameboardStatus();

    //create an array of spaces left, eg. ['0','2','8']
    const spacesLeft = [];
    let k = 0;
    gameboard.gameboardStatus.forEach((box) => {
      if (box == '') {
        //it's open, add it to the spacesLeft
        spacesLeft.push(k);
      }
      k++;
    });

    // randomly chose one of those places
    let chosenId = 0;
    let randomSpotInArray = Math.floor(Math.random() * spacesLeft.length);
    chosenId = spacesLeft[randomSpotInArray];
    // place mark

    displayController.placeMark(chosenId);
  }

  function winHappened(whichPlayer) {
    document.getElementById('whose-turn').textContent =
      whichPlayer.sayName() + ' won!';

    gameFlow.endOfGame = true;
    gameFlow.checkboxSection.classList.remove('hidden');
    displayController.changeBtnText();
  }
  function tieHappened() {
    document.getElementById('whose-turn').textContent = 'Tie Game';
    gameFlow.endOfGame = true;
    gameFlow.checkboxSection.classList.remove('hidden');
    displayController.changeBtnText();
  }
  return {
    whoseTurn,
    currentMark,
    endOfGame,
    allowPlayAgainBtn,
    checkIfTaken,
    checkGameOver,
    winHappened,
    tieHappened,
    p2IsComputer,
    checkboxSection,
  };
})();

//module
const displayController = (function () {
  const _gameboardArea = document.getElementById('gameboard-area');

  function drawCells() {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.id = i;
      _gameboardArea.appendChild(cell);

      cell.addEventListener('click', gameFlow.checkIfTaken);
    }
  }

  const _startResetBtn = document.getElementById('start-reset-btn');

  function _initialStart() {
    drawCells();
    _disableCells();
    _startResetBtn.addEventListener('click', resetGame);
  }

  _initialStart();

  function _disableCells() {
    const cells = document.getElementsByClassName('cell');
    Array.from(cells).forEach((cell) => {
      cell.removeEventListener('click', gameFlow.checkIfTaken);
    });
  }

  function _enableCells() {
    const cells = document.getElementsByClassName('cell');
    Array.from(cells).forEach((cell) => {
      cell.addEventListener('click', gameFlow.checkIfTaken);
    });
  }

  let _beforeStartClicked = true;

  function resetGame() {
    gameFlow.checkboxSection.classList.add('hidden');
    if (_beforeStartClicked) {
      _beforeStartClicked = false; //this only happens once
      _enableCells();
    }

    if (document.getElementById('player1').value == '') {
      document.getElementById('player1').value = 'Happy Penguin';
      player1.updateName1();
    }
    if (document.getElementById('player2').value == '') {
      document.getElementById('player2').value = document.getElementById(
        'player2'
      ).placeholder;
      player2.updateName2();
    }
    resetCellValues();
    resetGameValues();
    displayController.changeBtnText();
    document.getElementById('whose-turn').textContent =
      player1.sayName() + "'s turn";
  }

  function resetCellValues() {
    let cells = Array.from(_gameboardArea.getElementsByClassName('cell'));
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.style.setProperty('transform', 'initial');
    });
  }

  function resetGameValues() {
    // stuff
    gameFlow.whoseTurn = 'player1';
    gameFlow.currentMark = 'X'; //will change when whoseturn changes.
    gameFlow.endOfGame = false;
    gameFlow.allowPlayAgainBtn = false;
  }

  function placeMark(e) {
    let currentMarker = gameFlow.currentMark;
    let thisDiv = '';
    if (gameFlow.whoseTurn == 'player1') {
      thisDiv = e.target;
      // ^ based on user clicking a certain div
      // e here is a PointerEvent
    } else {
      //player 2
      //computer is player 2
      if (gameFlow.p2IsComputer) {
        thisDiv = document.querySelector(`[data-id=${CSS.escape(e)}]`);
        // ^ based on some math that determines the number 'e'
      } else {
        //human is player 2
        thisDiv = e.target;
      }
    }

    thisDiv.textContent = currentMarker;
    thisDiv.style.transform = 'rotate(180deg)';
  }

  function changeBtnText() {
    if (gameFlow.endOfGame) {
      _startResetBtn.classList.remove('hidden');
      _startResetBtn.textContent = 'Play Again';
    } else {
      _startResetBtn.classList.add('hidden');
    }
  }

  return { drawCells, placeMark, changeBtnText };
})();
