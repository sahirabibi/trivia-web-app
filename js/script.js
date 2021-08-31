/* ---- app's state variables ---- */
let questionsDB;
let questionNum;
let currentScore;
let currentQuestion;
let category = '18'; // default
let difficulty = 'easy'; // default
let url;
let scoresData;
/*----  Cached DOM Elements --- */

const startModal = document.querySelector('.modal');
//buttons
const startBtn = document.querySelector('.start');
const returnBtn = document.querySelector('.return');
const optionsBtn = document.querySelector('#options');
const categoryBtn = document.querySelector('#category');
const difficultyBtn = document.querySelector('#difficulty');
const scoreModal = document.querySelector('#score-modal');
const highScoreBtn = document.querySelector('#high-scores');
const closeBtn = document.querySelector('#close');
// main elements
const score = document.querySelector('#final-score');
const currentTopic = document.querySelector('#current-topic');
const currentQ = document.querySelector('#question');
const answers = document.querySelector('#answers');
const modalText = document.querySelector('.modal-textbook');
// drop-down menues
const categoriesMenu = document.querySelector('#category-menu');
const difficultyMenu = document.querySelector('#difficulty-menu');

/*------------------- Functions -------------------*/

function updateParams(button, id, target) {
	// get params from user and set to element id
	button.setAttribute('data-id', id);
	button.innerText = target.innerText;
}

// toggle modals
function toggleModal(targetModal) {
	if (targetModal.style.display === 'none') {
		targetModal.style.display = 'block';
	} else {
		targetModal.style.display = 'none';
	}
}

/* -- Start Game and Check Progress -- */

function init() {
	// initialize game state variables
	getScores();
	questionsDB = [];
	questionNum = 0;
	currentScore = 0;
	let userCategory = categoryBtn.getAttribute('data-id');
	let userDifficulty = difficultyBtn.getAttribute('data-id');
	if (userCategory) {
		category = userCategory;
	}
	if (userDifficulty) {
		difficulty = userDifficulty;
	}
	url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
	currentTopic.innerText = categoryBtn.innerText;
	currentQuestion = questionsDB[questionNum];
}

function createQuestions(results) {
	results.forEach((element) => {
		let new_question = new Question(element);
		questionsDB.push(new_question);
	});
	// render question
	currentQuestion = questionsDB[questionNum];
	render(currentQuestion);
}

function render(question) {
	// display current question and choices to user
	currentQ.innerHTML = question.text;
	question.answers.forEach((choice, idx) => {
		document.getElementById(idx).innerHTML = choice;
	});
}

function checkAnswer(correctAns, userAns, target) {
	// take correct answer and compare it to user answer
	if (correctAns == userAns) {
		currentScore++;
		target.classList.add('flash-green');
		setTimeout(function () {
			target.classList.remove('flash-green');
		}, 250);
	} else {
		// flash red for wrong answer
		target.classList.add('flash-red');
		setTimeout(function () {
			target.classList.remove('flash-red');
		}, 250);
	}
	questionNum++;
	currentQuestion = questionsDB[questionNum];
}

// triggered after each round to check if game is over
function isGameOver() {
	if (questionNum === questionsDB.length) return true;
	setTimeout(function () {
		render(currentQuestion);
	}, 500);
}

function endGame() {
	// modifies start modal and displays final score and asks to play again
	toggleModal(startModal);
	modalText.innerHTML = `<h2>GAME OVER!</h2>`;
	startBtn.innerText = 'Play Again';
	score.innerText = `FINAL SCORE: ${currentScore}`;
	score.style.display = 'block';
	// add final stats to high scores
	updateScores(currentTopic, difficulty, currentScore);
}

// update high scores

function getScores() {
	// at start of game, display all previous scores
	scoresData = JSON.parse(localStorage.getItem('high-score'));
	if (scoresData) {
		// clear table
		let tbody = document.querySelector('tbody');
		while (tbody.firstChild.id !== 'criteria') {
			tbody.removeChild(tbody.firstChild);
		}
		// if scores present, add them to the table
		scoresData.forEach((score) => displayScore(score));
	} else {
		scoresData = [];
	}
}

function displayScore(score) {
	// add score to the high scores table
	let table = document.querySelector('#score-body');
	// create row to put into tbody
	let row = document.createElement('tr');
	row.innerHTML = `<th>${score.category}</th>
					<th>${score.level}</th>
					<th>${score.score}</th>`;

	// append row onto table
	table.appendChild(row);
}

function updateScores(category, level, currentScore) {
	// at the end of each game, add new score
	let newScore = {
		category: category.innerText,
		level: level,
		score: currentScore,
	};
	scoresData.push(newScore);
	// add updates scores data to local storage
	localStorage.setItem('high-score', JSON.stringify(scoresData));
}

class Question {
	// creates a single question obj and randomizes the answer choices before sending obj to questions array
	constructor(question) {
		this.text = `<p>${question.question}</p>`;
		this.answers = question.incorrect_answers;
		this.answers.forEach((element) => `<p>${element}</p>`);
		this.correct = `${question.correct_answer}`;
		// add correct answer to random location in answers array
		let ranNum = Math.floor(Math.random() * 4);
		this.answers.splice(ranNum, 0, this.correct);
		// replace correct value with index value of correct answer
		this.correct = this.answers.indexOf(this.correct);
	}
}

/* ----------------------- Main Game Events ---------------------*/
// get user choices for quiz type
categoriesMenu.addEventListener('click', function getCategory(e) {
	if (e.target.tagName === 'P') {
		// categoryBtn.setAttribute("data-id", e.target.id)
		updateParams(categoryBtn, e.target.id, e.target);
	}
});

difficultyMenu.addEventListener('click', function getDifficulty(e) {
	if (e.target.tagName === 'P') {
		updateParams(difficultyBtn, e.target.id, e.target);
		// difficultyBtn.setAttribute('data-id', e.target.id);
	}
});

// click start button to begin game
startBtn.addEventListener('click', function () {
	toggleModal(startModal);
	init();
	// fetch url
	fetch(url)
		.then((res) => res.json())
		.then((res) => {
			createQuestions(res.results);
		})
		.catch((error) => {
			console.log('Something went wrong.', error);
		});
});

// click an answer to progress through game
answers.addEventListener('click', (e) => {
	if (e.target.className === 'answer-choice') {
		// check if answer is correct
		checkAnswer(currentQuestion.correct, e.target.id, e.target);
		// check if game is over
		if (isGameOver()) {
			setTimeout(function () {
				endGame();
			}, 1000);
		}
	}
});

optionsBtn.addEventListener('click', () => {
	toggleModal(startModal);
	returnBtn.style.display = 'inline-block';
	startBtn.innerText = 'Restart';
	modalText.innerHTML = `<h2>Trivia!</h2>
	<h3>Choose a new category or return to your game.</h3>`;
});

returnBtn.addEventListener('click', () => {
	toggleModal(startModal);
});

highScoreBtn.addEventListener('click', () => {
	toggleModal(scoreModal);
});

closeBtn.addEventListener('click', () => {
	toggleModal(scoreModal);
});
