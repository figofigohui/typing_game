const totalRounds = 5;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const roundEl = document.getElementById("round");
const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const timeEl = document.getElementById("time");
const letterEl = document.getElementById("letter");
const promptEl = document.querySelector(".prompt");
const inputEl = document.getElementById("typed");
const restartBtn = document.getElementById("restart");
const finalEl = document.getElementById("final");
const finalScoreEl = document.getElementById("final-score");
const finalTimeEl = document.getElementById("final-time");

let round = 1;
let score = 0;
let currentLetter = "A";
let startTime = null;
let timerId = null;
let hideLetterTimeout = null;

const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];

const updatePrompt = () => {
  currentLetter = getRandomLetter();
  letterEl.textContent = currentLetter;
  inputEl.value = "";
  inputEl.focus();
  promptEl.classList.remove("is-hidden");
  if (hideLetterTimeout) {
    clearTimeout(hideLetterTimeout);
  }
  hideLetterTimeout = setTimeout(() => {
    promptEl.classList.add("is-hidden");
  }, 2000);
};

const updateStatus = () => {
  roundEl.textContent = `${round} / ${totalRounds}`;
  scoreEl.textContent = score;
};

const updateTime = () => {
  if (!startTime) {
    timeEl.textContent = "0.0s";
    return;
  }
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  timeEl.textContent = `${elapsedSeconds.toFixed(1)}s`;
};

const setResult = (message) => {
  resultEl.textContent = message;
};

const finishGame = () => {
  inputEl.disabled = true;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (hideLetterTimeout) {
    clearTimeout(hideLetterTimeout);
    hideLetterTimeout = null;
  }
  promptEl.classList.add("is-hidden");
  finalScoreEl.textContent = score;
  finalTimeEl.textContent = timeEl.textContent;
  finalEl.hidden = false;
  setResult("Game over!");
};

const handleInput = (event) => {
  if (!startTime) {
    startTime = Date.now();
    timerId = setInterval(updateTime, 100);
  }
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
  startTime = null;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (hideLetterTimeout) {
    clearTimeout(hideLetterTimeout);
    hideLetterTimeout = null;
  }
  promptEl.classList.remove("is-hidden");
  finalEl.hidden = true;
  inputEl.disabled = false;
  setResult("—");
  updateTime();
  updateStatus();
  updatePrompt();
};

inputEl.addEventListener("input", handleInput);
restartBtn.addEventListener("click", restartGame);

updateStatus();
updateTime();
updatePrompt();
