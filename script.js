/* ============================= */
/* CONSTANTS & GLOBAL VARIABLES  */
/* ============================= */
const PASS_PERCENT = 60;
let questions = {};
let currentCategory = "",
  currentIndex = 0,
  shuffled = [],
  correctAnswers = 0,
  canAnswer = true;

// Timer variables
let timerInterval;
let timeLeft = 15;

// History (localStorage)
let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];


/* ============================= */
/* INITIALIZATION                */
/* ============================= */
window.addEventListener("DOMContentLoaded", loadQuestions);


/* ============================= */
/* HELPER FUNCTIONS              */
/* ============================= */

// Shuffle array in-place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load questions from file
async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    questions = await res.json();
  } catch (err) {
    alert("Could not load questions file!");
  }
}


/* ============================= */
/* QUIZ FLOW FUNCTIONS           */
/* ============================= */

// Start quiz
function startQuiz() {
  currentCategory = document.getElementById("categorySelect").value;
  if (!currentCategory) {
    alert("Please select a category first!");
    return;
  }

  shuffled = [...questions[currentCategory]];
  shuffle(shuffled);
  currentIndex = 0;
  correctAnswers = 0;

  document.getElementById("categorySection").classList.add("hidden");
  document.getElementById("quizSection").classList.remove("hidden");
  document.getElementById("questionBox").classList.remove("hidden");

  loadQuestion();
}

// Load current question
function loadQuestion() {
  if (currentIndex >= shuffled.length) {
    finishQuiz();
    return;
  }

  canAnswer = true;
  const q = shuffled[currentIndex];
  document.getElementById("questionBox").innerText = q.q;

  // Render options
  document.getElementById("optionA").innerText = q.options[0];
  document.getElementById("optionB").innerText = q.options[1];
  document.getElementById("optionC").innerText = q.options[2];
  document.getElementById("optionD").innerText = q.options[3];

  const optionDivs = document.querySelectorAll("#optionsBox > div");
  optionDivs.forEach((div) => {
    div.classList.remove("correct", "wrong");
    div.onclick = () => checkAnswer(div, q.answer);
  });

  // Reset & start timer
  timeLeft = 15;
  document.getElementById("timerBox").innerText = timeLeft + "s";
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

// Timer countdown
function updateTimer() {
  timeLeft--;
  document.getElementById("timerBox").innerText = timeLeft + "s";
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    canAnswer = false;
    currentIndex++;
    setTimeout(loadQuestion, 500);
  }
}

// Check selected answer
function checkAnswer(div, correct) {
  if (!canAnswer) return;
  canAnswer = false;

  clearInterval(timerInterval);

  if (div.innerText === correct) {
    div.classList.add("correct");
    correctAnswers++;
  } else {
    div.classList.add("wrong");

    // Highlight the correct answer
    const optionDivs = document.querySelectorAll("#optionsBox > div");
    optionDivs.forEach((opt) => {
      if (opt.innerText === correct) {
        opt.classList.add("correct");
      }
    });
  }

  currentIndex++;
  setTimeout(loadQuestion, 1000);
}

// Finish quiz
function finishQuiz() {
  clearInterval(timerInterval);

  // Hide quiz UI
  document.getElementById("optionsBox").classList.add("hidden");
  document.getElementById("timerBox").classList.add("hidden");
  document.getElementById("questionBox").classList.add("hidden");

  // Show result
  const resultBox = document.getElementById("resultBox");
  resultBox.classList.remove("hidden");

  const total = shuffled.length;
  const percent = Math.round((correctAnswers / total) * 100);

  document.getElementById("scoreText").innerText =
    `Score: ${correctAnswers}/${total} (${percent}%)`;

  if (percent >= PASS_PERCENT) {
    document.getElementById("passFailText").innerText = "✅ You Passed!";
    document.getElementById("finishedBox").classList.remove("hidden");
    launchConfetti();
  } else {
    document.getElementById("passFailText").innerText = "❌ You Failed!";
    document.getElementById("finishedBox").classList.remove("hidden");
  }

  // Save history
  const attempt = {
    category: currentCategory,
    score: `${correctAnswers}/${total}`,
    percent,
    result: percent >= PASS_PERCENT ? "Pass" : "Fail",
    date: new Date().toLocaleString(),
  };
  quizHistory.push(attempt);
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

  document.getElementById("afterActions").classList.remove("hidden");
}


/* ============================= */
/* ACTION BUTTON HANDLERS        */
/* ============================= */

// Retake quiz
function retakeQuiz() {
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("optionsBox").classList.remove("hidden");
  document.getElementById("timerBox").classList.remove("hidden");
  document.getElementById("afterActions").classList.add("hidden");
  document.getElementById("questionBox").classList.remove("hidden");
  document.getElementById("historySection").classList.add("hidden");
  document.getElementById("finishedBox").classList.add("hidden");

  currentIndex = 0;
  correctAnswers = 0;
  shuffled = [...questions[currentCategory]];
  shuffle(shuffled);

  loadQuestion();
}

// Back to categories
function backToCategories() {
  document.getElementById("quizSection").classList.add("hidden");
  document.getElementById("categorySection").classList.remove("hidden");
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("afterActions").classList.add("hidden");
  document.getElementById("optionsBox").classList.remove("hidden");
  document.getElementById("timerBox").classList.remove("hidden");
  document.getElementById("historySection").classList.add("hidden");
  document.getElementById("finishedBox").classList.add("hidden");
}

// Show quiz history
function showHistory() {
  const historySection = document.getElementById("historySection");
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  quizHistory.forEach((h) => {
    const li = document.createElement("li");
    li.innerText =
      `[${h.date}] ${h.category} - ${h.score} (${h.percent}%) - ${h.result}`;
    historyList.appendChild(li);
  });

  historySection.classList.remove("hidden");
}


/* ============================= */
/* VISUAL EFFECTS                */
/* ============================= */
function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}




