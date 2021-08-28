// Global Variables
const url =
	'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';

/* ---- app's state variables ---- */
let questionsDB = [];
let questionNum;
let currentScore;
let currentQuestion;

/*----  Cached DOM Elements --- */

const startModal = document.querySelector('.modal');
const startBtn = document.querySelector('.start');
const optionsBtn = document.querySelector('#options');
const score = document.querySelector('#final-score');
const currentTopic = document.querySelector('#current-topic');
const currentQ = document.querySelector('#question');
const answers = document.querySelector('#answers');
// const endModal = document.getElementById('end');
const modalText = document.querySelector('.modal-textbook');

/*------------------- Functions -------------------*/

/* -- Start Game and Check Progress -- */

function init() {
	// initialize game state variables
	questionNum = 0;
	currentScore = 0;
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
	currentQ.innerText = question.text;
	question.answers.forEach((choice, idx) => {
		document.getElementById(idx).innerText = choice;
	});
}

function checkAnswer(correctAns, userAns) {
	// take correct answer and compare it to user answer
	if (correctAns == userAns) {
		currentScore++;
	}
	questionNum++;
	currentQuestion = questionsDB[questionNum];
}

// triggered after each round to check if game is over
function isGameOver() {
	if (questionNum > 9) return true;
	render(currentQuestion);
}

function endGame() {
	// modifies start modal and displays final score and asks to play again
	toggleModal(startModal);
	modalText.innerHTML = `<h2>GAME OVER!</h2>
			<div class="modal-textbook">
				<h3 id="final-score">Final Score: ${currentScore} </h3>
			</div>`;
	startBtn.innerText = "Play Again"
	score.innerText = `FINAL SCORE: ${currentScore}`;
}

function toggleModal(targetModal) {
	if (targetModal.style.display === 'none') {
		targetModal.style.display = 'block';
		console.log('changed style');
	} else {
		targetModal.style.display = 'none';
	}
}

class Question {
	// creates a single question obj and randomizes the answer choices before sending obj to questions array
	constructor(question) {
		this.text = question.question;
		this.answers = question.incorrect_answers;
		this.correct = question.correct_answer;
		// add correct answer to random location in answers array
		let ranNum = Math.floor(Math.random() * 4);
		this.answers.splice(ranNum, 0, this.correct);
		// replace correct value with index value of correct answer
		this.correct = this.answers.indexOf(this.correct);
	}
}

/* ----------------------- Main Game Events ---------------------*/
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
		checkAnswer(currentQuestion.correct, e.target.id);
		// check if game is over
		if (isGameOver()) {
			endGame();
		}
	}
});

////////////////// Removed Functions START ///////////////////

// function nextQuestion() {
//     // gets the next question in the database and calls render on it
//     if (questionNum < 10) {
//         questionNum++;
//         render(questionsDB[questionNum])
//     } else {
//         console.log("Game Over")
//     }
// }

/*- Hide and Show Start Modal -*/
// add event listener to start button to close modal and begin game
// startBtn.addEventListener('click', () => {
// 	toggleModal(startModal);
// 	// initialize game
// 	// displayQuestion(questions)
//     init();
// });

// function question(results) {
// 	// creates a single question obj and randomizes the answer choices before sending obj to questions array
// 		let text = results.question;
// 		let answers = results.incorrect_answers;
// 		let correctAns = results.correct_answer;
// 		// add correct answer to random location in array
// 		let ranNum = Math.floor(Math.random() * 4);
// 		this.answers.splice(ranNum, 0, correctAns);
// 		let correct = answers.indexOf(correctAns);
//         let new_question = {text : text, answers: answers, correct: correct}
//         questions.push(new_question);

// }

/* ----- Get Question and Create Questions Data Base ---- */

// function getData(url) {
// 	// use url to fetch data
// 	// send data to formatData() to render it on page
// 	return (fetch(url)
// 		.then((res) => res.json())
// 		.then((res) => {
// 			createQuestions(res.results);
// 		})
// 		.catch((error) => {
// 			console.log('Something went wrong.', error);
// 		}));
// }

// fetch(url)
// 	.then((res) => res.json())
// 	.then((res) => {
// 			createQuestions(res.results);
// 	})
// 	.catch((error) => {
// 			console.log('Something went wrong.', error);
// 	});

// State Variables
// url takes three params: category #, difficulty, and type = [easy, medium, hard]

// let paramsObj = {"category": "18", "type": "multiple", "difficulty": "easy"}

////////////////// Removed Functions END ///////////////////

/////////////////// GAME LOGIC ///////////////////////
// API DATA:
// "results" : [obj, obj, obj]
// "category": "science: computers"
// "question": "str"
// "correct_answer": "str"
// "incorrect_answer": ["str", "str", "str"]

//PAGE LOAD
// User sees modal with a brief description of game and a start button
// Hits start
// Modal toggled to display none
// trigger getQuestions() to retrieve data

// Display Question and Answers to User
// "click" event listener to start button
// if clicked
// use getQuestions to fetch data from API and store it
// send first obj in array to displayQuestion
// remove first obj so the question is not repeated

// send data to displayQuestion()
// display question will set the current question on the page
// set #question to data.question
// FOR EACH: set #answers to data.choice
// set event listener to each answer choice button
// if "click"
// sent current choice to checkAnswer();
// if target.innerText is same as data.correct_answer
// return true
// else return false
// if success -->
//change target background color to red
// update score by 1
// decrease currentQuestion -1
// else
// target.style.backgroundColor = red
// display next question

// GAME ENDS
// if user clicks Options
// display reset button
// "click" on reset --> start over
// if no more questions left
// currentQuestion = 0;

// create endGame()



// for endgame change modal content to display user score 
// change start button to display play again 