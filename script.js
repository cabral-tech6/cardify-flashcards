// ===== DOM Elements =====
const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const themeToggleBtn = document.getElementById('theme-toggle');

// ===== State =====
let editMode = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

// ===== UI Events =====
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  errorMessage.classList.add("hide");
  addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editMode) editMode = false;
});

cardButton.addEventListener("click", () => {
  const tempQuestion = question.value.trim();
  const tempAnswer  = answer.value.trim();

  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
    return;
  }

  if (editMode) flashcards = flashcards.filter(f => f.id !== originalId);

  const id = Date.now();
  flashcards.push({ id, question: tempQuestion, answer: tempAnswer });
  localStorage.setItem('flashcards', JSON.stringify(flashcards));

  container.classList.remove("hide");
  errorMessage.classList.add("hide");
  renderCards();

  question.value = "";
  answer.value = "";
  editMode = false;
  addQuestionCard.classList.add("hide");
});

// ===== Render Cards =====
function renderCards() {
  const listCard = document.querySelector(".card-list-container");
  listCard.innerHTML = '';
  flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

  flashcards.forEach(flashcard => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.setAttribute('data-id', flashcard.id);

    div.innerHTML = `
      <p class="question-div">${flashcard.question}</p>
      <p class="answer-div hide">${flashcard.answer}</p>
      <button class="show-hide-btn">Show / Hide</button>
      <div class="buttons-con">
        <button class="edit" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;

    const displayAnswer = div.querySelector(".answer-div");
    const showHideBtn = div.querySelector(".show-hide-btn");
    const editButton = div.querySelector(".edit");
    const deleteButton = div.querySelector(".delete");

    showHideBtn.addEventListener("click", () => {
      displayAnswer.classList.toggle("hide");
    });

    editButton.addEventListener("click", () => {
      editMode = true;
      modifyCard(editButton, true);
      addQuestionCard.classList.remove("hide");
      container.classList.add("hide");
    });

    deleteButton.addEventListener("click", () => {
      modifyCard(deleteButton);
    });

    listCard.appendChild(div);
  });
}

// ===== Modify / Delete Card =====
const modifyCard = (element, edit = false) => {
  const parentDiv = element.closest('.card');
  const id = Number(parentDiv.getAttribute('data-id'));
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;

  if (edit) {
    const parentAnswer = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAnswer;
    question.value = parentQuestion;
    originalId = id;
    disableEditButtons(true);
  } else {
    flashcards = flashcards.filter(f => f.id !== id);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    parentDiv.remove();
  }
};

// ===== Disable Edit Buttons =====
const disableEditButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((el) => el.disabled = value);
};

// ===== Load / Theme-Aware Particles =====
function loadParticles(theme = 'neon') {
  const colors = theme === 'dark'
    ? { dots: ["#6aa7ff", "#7de0b0", "#8a6bff"], lines: "#6aa7ff" }
    : { dots: ["#36f49a", "#00d4ff", "#8a2be2"], lines: "#36f49a" };

  if (window.pJSDom && window.pJSDom.length) {
    try { window.pJSDom[0].pJS.fn.vendors.destroypJS(); window.pJSDom = []; } catch(e){}
  }

  particlesJS("particles-js", {
    particles: {
      number: { value: 85, density: { enable: true, value_area: 900 } },
      color: { value: colors.dots },
      shape: { type: "circle" },
      opacity: { value: 0.8 },
      size: { value: 2.5, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: colors.lines,
        opacity: 0.35,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        out_mode: "out",
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 150, line_linked: { opacity: 0.6 } } }
    },
    retina_detect: true
  });
}

// ===== Theme Toggle =====
const THEME_KEY = 'cardify-theme';
function applyTheme(theme){
  document.documentElement.classList.toggle('dark', theme === 'dark');
  themeToggleBtn.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  loadParticles(theme);
  localStorage.setItem(THEME_KEY, theme);
}

const savedTheme = localStorage.getItem(THEME_KEY) || 'neon';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const current = localStorage.getItem(THEME_KEY) || 'neon';
  applyTheme(current === 'neon' ? 'dark' : 'neon');
});

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", renderCards);
