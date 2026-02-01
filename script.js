const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const gameDurationMs = 60_000;
const spawnIntervalMs = 1200;

const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const skyEl = document.querySelector(".sky");
const difficultyEl = document.getElementById("difficulty");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const finalEl = document.getElementById("final");
const finalScoreEl = document.getElementById("final-score");

const difficultySettings = {
  easy: { fallMultiplier: 1.35 },
  normal: { fallMultiplier: 1 },
  hard: { fallMultiplier: 0.8 },
  "very-hard": { fallMultiplier: 0.6 },
};

let score = 0;
let startTime = null;
let timerId = null;
let spawnId = null;
let isRunning = false;
let currentDifficulty = "normal";

const activeApples = new Map();

currentDifficulty = difficultyEl.value;

const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
const getRandomPosition = () => Math.floor(Math.random() * 80) + 10;
const getRandomFallDuration = () => {
  const baseDuration = Math.floor(Math.random() * 1500) + 2000;
  const { fallMultiplier } = difficultySettings[currentDifficulty];
  return Math.round(baseDuration * fallMultiplier);
};

const updateScore = () => {
  scoreEl.textContent = score;
};

const updateTime = () => {
  if (!startTime) {
    timeEl.textContent = "60s";
    return;
  }
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(gameDurationMs - elapsed, 0);
  timeEl.textContent = `${Math.ceil(remaining / 1000)}s`;

  if (remaining === 0) {
    endGame();
  }
};

const setResult = (message) => {
  resultEl.textContent = message;
};

const removeApple = (appleEl) => {
  const letter = appleEl.dataset.letter;
  activeApples.delete(letter);
  appleEl.remove();
};

const handleAppleMiss = (event) => {
  const appleEl = event.currentTarget;
  removeApple(appleEl);
};

const spawnApple = () => {
  const letter = getRandomLetter();
  if (activeApples.has(letter)) {
    return;
  }

  const apple = document.createElement("div");
  apple.className = "apple";
  apple.dataset.letter = letter;
  apple.textContent = letter;
  apple.style.left = `${getRandomPosition()}%`;
  apple.style.setProperty("--fall-duration", `${getRandomFallDuration()}ms`);
  apple.addEventListener("animationend", handleAppleMiss);

  activeApples.set(letter, apple);
  skyEl.appendChild(apple);
};

const handleKeydown = (event) => {
  if (!isRunning) {
    return;
  }
  const key = event.key.toUpperCase();
  if (!letters.includes(key)) {
    return;
  }

  const apple = activeApples.get(key);
  if (apple) {
    score += 1;
    updateScore();
    setResult(`Nice! +1 for ${key}`);
    removeApple(apple);
  } else {
    setResult(`No apple with ${key} yet.`);
  }
};

const clearApples = () => {
  activeApples.forEach((apple) => apple.remove());
  activeApples.clear();
};

const startGame = () => {
  if (isRunning) {
    return;
  }
  isRunning = true;
  startTime = Date.now();
  score = 0;
  updateScore();
  setResult("Type the letters before they hit the ground!");
  finalEl.hidden = true;
  startBtn.hidden = true;
  restartBtn.hidden = true;

  clearApples();
  updateTime();
  timerId = setInterval(updateTime, 200);
  spawnId = setInterval(spawnApple, spawnIntervalMs);
  spawnApple();
};

const endGame = () => {
  if (!isRunning) {
    return;
  }
  isRunning = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (spawnId) {
    clearInterval(spawnId);
    spawnId = null;
  }

  setResult("Time's up!");
  finalScoreEl.textContent = score;
  finalEl.hidden = false;
  startBtn.hidden = true;
  restartBtn.hidden = false;
  clearApples();
};

const restartGame = () => {
  clearApples();
  startTime = null;
  score = 0;
  updateScore();
  updateTime();
  setResult("—");
  finalEl.hidden = true;
  startBtn.hidden = false;
  restartBtn.hidden = true;
};

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
difficultyEl.addEventListener("change", (event) => {
  currentDifficulty = event.target.value;
});
window.addEventListener("keydown", handleKeydown);

updateScore();
updateTime();
