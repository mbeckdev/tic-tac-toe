'use strict';

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
  // const
  return { sayName };
};

const player = Person('player');
const computer = Person('computer');

//an object to control the flow of the game - we only need this once - make it a module
// let gameFlow = {
//   whoseTurn: 0, // 0 or 1
//   scorePlayer: 0,
//   scoreComputer: 0,
//   someoneWon: false, //true when someone got 3 in a row
//   allowPlayAgainBtn: false, // should turn true when someone won
// };

const gameFlow = (function () {
  let whoseTurn = 0;
  let scorePlayer = 0;
  let scoreComputer = 0;
  let someoneWon = false;
  let allowPlayAgainBtn = false;

  return {
    whoseTurn,
    scorePlayer,
    scoreComputer,
    someoneWon,
    allowPlayAgainBtn,
  };
})();
