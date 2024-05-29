import { Game } from './game.js';
import * as utils from './scrabbleUtils.js';
import { Rack } from './rack.js';

// Fetch the dictionary from the server.
const response = await fetch('dictionary.json');
if (!response.ok) {
  console.log(response.error);
} else {
  window.dictionary = await response.json();
}

// Updates and displays the current payers turn.
function updateTurn() {
  document.getElementById('turn').innerText = document.getElementById(
    `p${(turn % NUMBER_OF_PLAYERS) + 1}-name`
  ).value;
}

function renderGame(game) {
  game.render(document.getElementById('board'));
}

function renderRacks(racks) {
  racks.forEach((rack, i) =>
    rack.render(document.getElementById(`p${i + 1}-rack`))
  );
}

// Create a new game.
const game = new Game();

// Display the player's turn.
updateTurn();

// An array of racks.
const racks = [];

// An array of scores for each player.
const scores = Array.from(Array(NUMBER_OF_PLAYERS), () => 0);

// Initialize the racks and player name's event handler.
for (let i = 0; i < NUMBER_OF_PLAYERS; ++i) {
  racks[i] = new Rack();

  racks[i].takeFromBag(7, game);

  // When the player's name changes, update the player's turn.
  document
    .getElementById(`p${i + 1}-name`)
    .addEventListener('change', updateTurn);
}

// Render the racks and the game board.
renderRacks(racks);
renderGame(game);

// Several changes to account for two players and dictionary.
document.getElementById('play').addEventListener('click', async () => {
  const word = document.getElementById('word').value;
  const x = parseInt(document.getElementById('x').value);
  const y = parseInt(document.getElementById('y').value);
  const direction = document.getElementById('direction').value === 'horizontal';

  // Get the rack for the current player's turn.
  const rack = racks[turn % NUMBER_OF_PLAYERS];

  // We need to remove tiles already on the grid from the word trying to be
  // constructed.
  let remaining = word;
  for (let i = 0; i < word.length; ++i) {
    const tile = direction
      ? game.getGrid()[x + i][y]
      : game.getGrid()[x][y + i];
    if (tile !== null) {
      if (tile !== word[i]) {
        alert(`The word intercepts already placed tiles.`);
        return;
      } else {
        remaining = remaining.replace(tile, '');
      }
    }
  }

  if (remaining === '') {
    alert('You need to place at least one tile!');
  }

  if (!utils.canConstructWord(rack.getAvailableTiles(), remaining)) {
    alert(`The word ${word} cannot be constructed.`);
  } else {
    try {
      const score = game.playAt(word, { x, y }, direction);
      scores[turn % NUMBER_OF_PLAYERS] += score;
      document.getElementById('word').value = '';
      renderGame(game);

      // TODO: Save the player's name, word, and score to the server. You will
      //       need to use the `POST /wordScore` endpoint to do this. We
      //       recommend you write functions to do this for you rather than
      //       make calls to `fetch` directly in this function. For example:
      //
      //       `await saveWordScore(name, word, score);`
      //
      //       You will also want to update the word score table in the UI.
      //       Again, we recommend a function for this. For example:
      //
      //       `displayWordScore(name, word, score);`

      if(turn % NUMBER_OF_PLAYERS === 0) {
        await saveWordScore(document.getElementById("p1-name").value, word, score);
        displayWordScore(document.getElementById("p1-name").value, word, score);
      } else {
        await saveWordScore(document.getElementById("p2-name").value, word, score);
        displayWordScore(document.getElementById("p2-name").value, word, score);
      }

      const used = utils.constructWord(rack.getAvailableTiles(), remaining);
      used.forEach((tile) => rack.removeTile(tile));
      rack.takeFromBag(used.length, game);
      renderRacks(racks);
      ++turn;

      updateTurn();
    } catch (e) {
      alert(e);
    }
  }
});

document.getElementById('reset').addEventListener('click', () => {
  game.reset();
  game.render(board);
});

document.getElementById('help').addEventListener('click', () => {
  // Updates to account for two racks.
  const availableTiles = racks[turn % NUMBER_OF_PLAYERS].getAvailableTiles();
  console.log(availableTiles);
  const possibilities = utils.bestPossibleWords(availableTiles);
  // const possibilities = utils.bestPossibleWords(
  //   racks[turn].getAvailableTiles()
  // );
  const hint = possibilities[Math.floor(Math.random() * possibilities.length)];
  document.getElementById('hint').innerText = hint;
});

document.getElementById('end').addEventListener('click', async () => {
  // TODO: Add a button whose id is `end` before you complete this method.

  // TODO: Save the game scores to the server. You will need to use the
  //      `POST /gameScore` endpoint to do this. We recommend you write
  //      functions to do this for you rather than make calls to `fetch`
  //      directly in this function. For example:
  //
  //     `await saveGameScore(name, scores[i]);`
  //
  //      Where `i` is the i'th player.
  for (let i = 0; i < NUMBER_OF_PLAYERS; ++i) {
    await saveGameScore(document.getElementById(`p${i + 1}-name`).value, scores[i]);
  }
});

async function saveWordScore(name, word, score) {
  try {
      const response = await fetch(`/wordScore/${name}/${word}/${score}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          }
      });
      const data = await response.json();
      return data;
  }
  catch(err) {
      console.log(err);
  }
}

async function saveGameScore(name, score) {
  try {
      const response = await fetch(`/gameScore/${name}/${score}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          }
      });
      const data = await response.json();
      return data;
  }
  catch(err) {
      console.log(err);
  }
}

function displayWordScore(name, word, score) {
  let row = document.getElementById("wordScoresTable").insertRow();
  let nameCell = row.insertCell();
  nameCell.innerText = name;
  let wordCell = row.insertCell();
  wordCell.innerText = word;
  let scoreCell = row.insertCell();
  scoreCell.innerText = score;
}

async function getGameScores() {
  try {
      const response = await fetch(`/highestGameScores`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          }
      });
      const data = await response.json();
      return data;
  }
  catch(err) {
      console.log(err);
  }
}

async function getWordScores() {
  try {
      const response = await fetch(`/highestWordScores`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          }
      });
      const data = await response.json();
      return data;
  }
  catch(err) {
      console.log(err);
  }
}

let topGameScores = await getGameScores();
for(let entry in topGameScores) {
  let row = document.getElementById("topGameScoresTable").insertRow();
  let nameCell = row.insertCell();
  nameCell.innerText = topGameScores[entry].name;
  let scoreCell = row.insertCell();
  scoreCell.innerText = topGameScores[entry].score;
}

let topWordScores = await getWordScores();
for(let entry in topWordScores) {
  let row = document.getElementById("topWordScoresTable").insertRow();
  let nameCell = row.insertCell();
  nameCell.innerText = topWordScores[entry].name;
  let scoreCell = row.insertCell();
  scoreCell.innerText = topWordScores[entry].score;
}