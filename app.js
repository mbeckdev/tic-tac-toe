'use strict';

// Your main goal here is to have as little global code as possible.
// Try tucking everything away inside of a module or factory.
// Rule of thumb: if you only ever need ONE of something // (gameBoard, displayController), use a module.
// If you need multiples  of something (players!), create them with factories.
// https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/tic-tac-toe

//make the gameboard an array
// const squares = [];
// for (let i = 0; i < 3; i++) {
//   squares.push(i);
//   squares[i] = new Array(3);
//   for (let j = 0; j < 3; j++) {
//     squares[i].push(j);
//   }
// }

//gameboard = module pattern (only happens once)
const gameboard = (function () {
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  console.log('made squares');

  let gameboardStatus = [];
  function getGameboardStatus() {
    gameboardStatus = [];
    document.querySelectorAll('.cell').forEach((div) => {
      gameboardStatus.push(div.textContent);
    });
    console.log('gameboardStatus = ' + gameboardStatus);
    console.log('gameboard.gameboardStatus = ' + gameboard.gameboardStatus);
    gameboard.gameboardStatus = gameboardStatus;
  }
  return { squares, getGameboardStatus, gameboardStatus };
})();

//players are stored as objects -- use factory function (it's used multiple times)
const Person = (aName, aMarker) => {
  const _name = aName;
  function sayName() {
    return _name;
  }
  let marker = aMarker;

  return { sayName, marker };
};

const player = Person('player', 'X');
const computer = Person('computer', 'O');

// an object to control the flow of the game
// - we only need this once - make it a module pattern
const gameFlow = (function () {
  let whoseTurn = 'player';
  let currentMark = 'X'; //will change when whoseturn changes.
  let scorePlayer = 0;
  let scoreComputer = 0;
  let endOfGame = false;
  let allowPlayAgainBtn = false;

  function checkIfTaken(e) {
    console.log('checking');
    let thisDiv = e.target;
    console.log('thisDiv.textContent = ' + thisDiv.textContent);

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

  function switchWhoseTurn() {
    if (gameFlow.whoseTurn == 'player') {
      //after player's turn:
      gameFlow.whoseTurn = 'computer';
      gameFlow.currentMark = computer.marker;
      console.log('currentMark = ' + gameFlow.currentMark);
      window.setTimeout(function () {
        _computerTakesTurn();
        gameFlow.checkGameOver();
        if (!gameFlow.endOfGame) {
          switchWhoseTurn(); // should go to the else stuff below
        }
      }, 500);
    } else {
      gameFlow.whoseTurn = 'player';
      gameFlow.currentMark = player.marker;
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
      console.log(lilArray);

      // lilArray[0] //3
      // gameboard.gameboardStatus[lilArray[0]] // ''  or 'X' or 'O'
      let spotA = gameboard.gameboardStatus[lilArray[0]]; // ''  or 'X' or 'O'
      let spotB = gameboard.gameboardStatus[lilArray[1]]; // ''  or 'X' or 'O'
      let spotC = gameboard.gameboardStatus[lilArray[2]]; // ''  or 'X' or 'O'

      //check if player won
      if (
        spotA == player.marker &&
        spotB == player.marker &&
        spotC == player.marker
      ) {
        //yes player has won
        console.log('Player has won!!!!');
        gameFlow.winHappened(player);
        break;
      }

      //check if computer won
      if (
        spotA == computer.marker &&
        spotB == computer.marker &&
        spotC == computer.marker
      ) {
        //yes computer has won
        console.log('computer has won!!!!');
        gameFlow.winHappened(computer);
        break;
      }

      if (i == winningIds.length - 1 && round >= 9) {
        //tie game
        gameFlow.tieHappened();
      }
    }
  }
  // let gameboardStatus = [];
  // function getGameboardStatus() {
  //   gameboardStatus = [];
  //   document.querySelectorAll('.cell').forEach((div) => {
  //     gameboardStatus.push(div.textContent);
  //   });
  // }

  function _computerTakesTurn() {
    // placeMark();
    // check possible places to put mark

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
    console.log('end');
  }

  function winHappened(whichPlayer) {
    console.log('win happened to ' + whichPlayer.sayName());
    gameFlow.endOfGame = true;
  }
  function tieHappened() {
    console.log('Tie Game');
    gameFlow.endOfGame = true;
  }
  return {
    whoseTurn,
    currentMark,
    scorePlayer,
    scoreComputer,
    endOfGame,
    allowPlayAgainBtn,
    checkIfTaken,
    checkGameOver,
    winHappened,
    tieHappened,
  };
})();

//module
const displayController = (function () {
  function drawCells() {
    console.log('drawing cells');
    const gameboardArea = document.getElementById('gameboard-area');
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.id = i;
      gameboardArea.appendChild(cell);

      cell.addEventListener('click', gameFlow.checkIfTaken);
    }
  }
  drawCells();

  function placeMark(e) {
    console.log('placing mark');
    let currentMarker = gameFlow.currentMark;
    let thisDiv = '';
    if (gameFlow.whoseTurn == 'player') {
      thisDiv = e.target;
      // ^ based on user clicking a certain div
      // e here is a PointerEvent
    } else {
      thisDiv = document.querySelector(`[data-id=${CSS.escape(e)}]`);
      // ^ based on some math that determines the number 'e'
    }

    thisDiv.textContent = currentMarker;

    thisDiv.style.transform = 'rotate(180deg)';
  }

  return { drawCells, placeMark };
})();

// function lol() {
//   const gameboardArea = document.getElementById('gameboard-area');
//   const cell = document.createElement('div');
//   cell.classList.add('cell');
//   gameboardArea.appendChild(cell);
// }
