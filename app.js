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
  return { squares };
})();

//players are stored as objects -- use factory (is used multiple times)
const Person = (aname) => {
  const _name = aname;
  function sayName() {
    return aname;
  }
  // let sayAName = function () {
  //   return aname;
  // };

  return { sayName };
};

const player = Person('player');
const computer = Person('computer');

//an object to control the flow of the game - we only need this once - make it a module

const gameFlow = (function () {
  let whoseTurn = 0;
  let currentMark = 'X'; //will change when whoseturn changes.
  let scorePlayer = 0;
  let scoreComputer = 0;
  let someoneWon = false;
  let allowPlayAgainBtn = false;

  function checkIfTaken(e) {
    console.log('checking');
    let thisDiv = e.target;
    console.log('thisDiv.textContent = ' + thisDiv.textContent);

    if (thisDiv.textContent == '') {
      myDisplayController.placeMark(e);
    } else {
      // there's a mark here already! Do nothing.
    }
  }

  return {
    whoseTurn,
    currentMark,
    scorePlayer,
    scoreComputer,
    someoneWon,
    allowPlayAgainBtn,
    checkIfTaken,
  };
})();

//module
const DisplayController = (function () {
  function drawCells() {
    console.log('drawing cells');
    const gameboardArea = document.getElementById('gameboard-area');
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.id = i;
      gameboardArea.appendChild(cell);

      // //for now, add Xs and Os, to be taken out when we have click to add X or Os
      // let aLetter = '';
      // if (Math.floor(Math.random() * 2) == 0) {
      //   aLetter = 'X';
      // } else {
      //   aLetter = 'O';
      // }
      // let aLetterNode = document.createTextNode(aLetter);
      // cell.appendChild(aLetterNode);

      cell.addEventListener('click', gameFlow.checkIfTaken);
    }
  }

  function placeMark(e) {
    console.log('placing mark');

    let currentMarker = gameFlow.currentMark;
    let thisDiv = e.target;
    thisDiv.textContent = currentMarker;
  }

  return { drawCells, placeMark };
})();
let myDisplayController = DisplayController; //i just need to make this once
myDisplayController.drawCells();

function lol() {
  const gameboardArea = document.getElementById('gameboard-area');
  const cell = document.createElement('div');
  cell.classList.add('cell');
  gameboardArea.appendChild(cell);
}
