/* ---- app's state variables ---- */
let questionsDB;
let questionNum;
let currentScore;
let currentQuestion;
let category = "18";
let difficulty = "easy";
let url;
let scoreData = [];
/*----  Cached DOM Elements --- */

const startModal = document.querySelector('.modal');
const startBtn = document.querySelector('.start');
const returnBtn = document.querySelector('.return')
const optionsBtn = document.querySelector('#options');
const highScoreBtn = document.querySelector("#high-scores");
const closeBtn = document.querySelector('#close')
const score = document.querySelector('#final-score');
const currentTopic = document.querySelector('#current-topic');
const currentQ = document.querySelector('#question');
const answers = document.querySelector('#answers');
const modalText = document.querySelector('.modal-textbook');
const categoryBtn = document.querySelector('#category');
const difficultyBtn = document.querySelector('#difficulty');
const categoriesMenu = document.querySelector('#category-menu');
const difficultyMenu = document.querySelector('#difficulty-menu');
const scoreModal = document.querySelector("#score-modal");



/*------------------- Functions -------------------*/

function updateParams(button, id, target) {
	button.setAttribute('data-id', id);
	button.innerText = target.innerText;
}

/* -- Start Game and Check Progress -- */

function init() {
	// initialize game state variables
	displayHighScores();
	questionsDB = [];
	questionNum = 0;
	currentScore = 0;
	let userCategory = categoryBtn.getAttribute('data-id');
	let userDifficulty = difficultyBtn.getAttribute('data-id');
	if (userCategory) {
		category = categoryBtn.getAttribute('data-id');
	} 
	if (userDifficulty) {
		difficulty = difficultyBtn.getAttribute('data-id');
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
	updateScoreData(currentTopic, difficulty, currentScore)
}



// toggle modals 
function toggleModal(targetModal) {
	if (targetModal.style.display === 'none') {
		targetModal.style.display = 'block';
	} else {
		targetModal.style.display = 'none';
	}
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
			setTimeout(function() {endGame()}, 2000);
		}
	}
});

optionsBtn.addEventListener("click", () => {
	toggleModal(startModal);
	returnBtn.style.display = "inline-block"
	startBtn.innerText = 'Restart'
	modalText.innerHTML = `<h2>Trivia!</h2>
	<h3>Choose a new category or return to your game.</h3>`;	
});

returnBtn.addEventListener('click', () => {
	toggleModal(startModal);
});

highScoreBtn.addEventListener('click', () => {
	toggleModal(scoreModal);
})

closeBtn.addEventListener('click', () => {
	toggleModal(scoreModal)
})





// 
// Handle Storage

// stores key:value pairs 


function getHighScores() {
	// display high scores in table 
	// convert from string array to submit to table
	let strData = localStorage.getItem("high-score");
	if (strData){
		scoreData = JSON.parse(strData);
	
	} else {
		scoreData = [];
	}
}

// function score(category, level, score) {
	
// }

function updateScoreData(category, level, currentScore) {
	let newScore = {
		category:category.innerText,
		level: level,
		score:currentScore,
	}
	scoreData.push(newScore);
	// add score to high scores table 
	addScore(newScore)
	// add updated scores data to local storage 
	localStorage.setItem("high-score", JSON.stringify(scoreData))
}

function addScore(score) {
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

function displayHighScores() {
	let scores = localStorage.getItem("high-score");
	if (scores) {
		// if scores present, add them to the table
		JSON.parse(scores).forEach(score => addScore(score))
	} 
} 




// after adding score
// add the book to the local storage
// loop through scoreData and then add book to table
// at the end of a game
// grab the current score, the current category, and level
// create an object from this and send it to addScore so it can be added to the table
	// in function-> loop through the array, 
		// if current object is in array and the score is less then the current score 
		// set that objects score to the new score
// send this obj to local storage and set it as an item 




// Save score local storage
function saveHighScore(currentScore) {
	// save current score to high score
	localStorage.setItem('High Score', currentScore)
	// get high score 
	let previousScore = localStorage.getItem('High Score')
	if (previousScore) {
		if (previousScore < currentScore) {
			// if previousScore is present and less than current score
			// update previous score to be current score
			localStorage.setItem("High Score", currentScore)
		}	
		
	}
}

































//


/* ------------

- Add Num Question Options 
- Add High Scores Sheet 
- Add timed rounds

// set high score

// grab the users final score, category, level of difficulty
// create a html table --> Category Mode Score
// function -> AddScore
	// check if current cat, mode are in table
		// if so,
			// check if current score is > new score
				// if so --> change old score
	// else 
		// add new cat, mode, and score to table

// Data Persistence 


// grab event that will cause storage --> when game ends
// grab current score

-----------*/

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

// categoriesMenu.addEventListener('click', (e) => {
// 	let category;
// 	if (e.target.tagName === 'P') {
// 		category = e.target.id;
// 		categoryBtn.innerText = e.target.innerText;
// 	}
// });

// difficultyMenu.addEventListener('click', (e) => {
// 	if (e.target.tagName === 'P') {
// 		difficulty = e.target.id;
// 		difficultyBtn.innerText = e.target.innerText;
// 	}
// });

// function updateURL() {

// function getCategory() {
// 	if (e.target.tagName === 'P') {
// 		category = e.target.id;
// 		categoryBtn.innerText = e.target.innerText;
// 	}
// }

// function getDifficulty() {
// 	if (e.target.tagName === 'P') {
// 		difficulty = e.target.id;
// 		difficultyBtn.innerText = e.target.innerText;
// 	}
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

// create endGame()

// for endgame change modal content to display user score
// change start button to display play again

/// grab category id
// grab difficulty id

// APPROACH
// function that gets inputs and returns a modified url
