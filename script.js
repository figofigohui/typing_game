const totalRounds = 5;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const roundEl = document.getElementById("round");
const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const letterEl = document.getElementById("letter");
const inputEl = document.getElementById("typed");
const restartBtn = document.getElementById("restart");
const finalEl = document.getElementById("final");
const finalScoreEl = document.getElementById("final-score");

let round = 1;
let score = 0;
let currentLetter = "A";

const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];

const updatePrompt = () => {
  currentLetter = getRandomLetter();
  letterEl.textContent = currentLetter;
  inputEl.value = "";
  inputEl.focus();
};

const updateStatus = () => {
  roundEl.textContent = `${round} / ${totalRounds}`;
  scoreEl.textContent = score;
};

const setResult = (message) => {
  resultEl.textContent = message;
};

const finishGame = () => {
  inputEl.disabled = true;
  finalScoreEl.textContent = score;
  finalEl.hidden = false;
  setResult("Game over!");
};

const handleInput = (event) => {
  const value = event.target.value.toUpperCase();
  if (!value) {
    return;
  }

  const isCorrect = value === currentLetter;
  if (isCorrect) {
    score += 1;
    setResult("Correct +1");
  } else {
    setResult(`Oops! It was ${currentLetter}`);
  }

  if (round === totalRounds) {
    updateStatus();
    finishGame();
    return;
  }

  round += 1;
  updateStatus();
  updatePrompt();
};

const restartGame = () => {
  round = 1;
  score = 0;
  finalEl.hidden = true;
  inputEl.disabled = false;
  setResult("—");
  updateStatus();
  updatePrompt();
};

inputEl.addEventListener("input", handleInput);
restartBtn.addEventListener("click", restartGame);

updateStatus();
updatePrompt();
