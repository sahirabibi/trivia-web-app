// Global Variables
const url =
	'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';

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

/* ---- app's state variables ---- */
let questionsDB = [];
let questionNum = 0;
let remainingQuestions = 10;
let currentScore = 0;
let currentQuestion; 

/*----  Cached DOM Elements --- */

const startModal = document.querySelector('#start-modal');
const startBtn = document.querySelector('#start');
const optionsBtn = document.querySelector('#options');
const score = document.querySelector('#final-score');
const currentTopic = document.querySelector('#current-topic');
const currentQ = document.querySelector('#question');
const answers = document.querySelector('#answers');
const endModal = document.getElementById("end");
const playAgain = document.querySelector("#play-again")


/*---- Functions -----*/

function reset() {
	// triggers call to API via getData
	currentScore = 0;
	questionNum = 0;
	// getData(url).then((res) => {
	// 	render(questionsDB[questionNum]);
	// });
	render(questionsDB[questionNum]);
}

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

function createQuestions(results) {
	results.forEach((element) => {
		let new_question = new Question(element);
		questionsDB.push(new_question);
	});
	// render question
	currentQuestion = questionsDB[questionNum];
	render(currentQuestion);
}

/* ------ Render Game and Check Progress ----- */

function render(question) {
	// display current question and choices to user
	currentQ.innerText = question.text;
	question.answers.forEach((choice, idx) => {
		document.getElementById(idx).innerText = choice;
	});
}

function checkAnswer(correctAns, userAns) {
	if (correctAns == userAns) {
		currentScore++;
	}
	questionNum++;
	currentQuestion = questionsDB[questionNum]
	// check if game is over
}

// triggered after each round to check if game is over
function isGameOver() {
	if (questionNum < 10) {
		render(currentQuestion);
	} else {
		return true;	
	}
}

function toggleModal(targetModal) {
	if (targetModal.style.display === 'none') {
		targetModal.style.display = 'block';
		console.log("changed style")
	} else {
		targetModal.style.display = 'none';
	}
}

function endGame() {
	// displays modal asking user to play again and final score
	toggleModal(endModal);
	score.innerText = `FINAL SCORE: ${currentScore}`;
	
}

class Question {
	// creates a single question obj and randomizes the answer choices before sending obj to questions array
	constructor(question) {
		this.text = question.question;
		this.answers = question.incorrect_answers;
		this.correct = question.correct_answer;
		// add correct answer to random location in array
		let ranNum = Math.floor(Math.random() * 4);
		this.answers.splice(ranNum, 0, this.correct);

		this.correct = this.answers.indexOf(this.correct);
	}
}

/* ----------------------- Main Game Events ---------------------*/
// click start button to begin game
startBtn.addEventListener('click', function () {
	// fetch url
	toggleModal(startModal);
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
		console.log(currentQuestion.correct);
		console.log(e.target.id)
		// check if answer is correct
		checkAnswer(currentQuestion.correct, e.target.id);
		// check if game is over
		if (isGameOver()) {
			endGame()
		}
	}
});

/*- Hide and Show Start Modal -*/
// add event listener to start button to close modal and begin game
// startBtn.addEventListener('click', () => {
// 	toggleModal(startModal);
// 	// initialize game
// 	// displayQuestion(questions)
//     init();
// });

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
