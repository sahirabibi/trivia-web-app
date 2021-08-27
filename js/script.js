// Global Variables 
const api_url =
	'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';

// State Variables 
// url takes three params: category #, difficulty, and type = [easy, medium, hard]

// let paramsObj = {"category": "18", "type": "multiple", "difficulty": "easy"} 

/* ---- app's state variables ---- */
let questions = [];
let currentQuestion;
let remainingQuestions;
let currentScore;


/*----  Cached DOM Elements --- */

const startModal = document.querySelector("#start-modal")
const startBtn = document.querySelector("#start");
const optionsBtn = document.querySelector("#options");
const score = document.querySelector("#score");
const currentTopic = document.querySelector("#current-topic");
const currentQ = document.querySelector("#question");
const answers = document.querySelector("#answers");


/*- Hide and Show Start Modal -*/
// add event listener to start button to close modal and begin game
startBtn.addEventListener("click", () => {
    toggleModal(startModal);
    // initialize game
    Game.startGame(api_url);
})



/*---- Functions -----*/

function getData(url) {
        // use url to fetch data
        // send data to formatData() to render it on page
        fetch(url)
            .then(res => res.json())
            .then(res => this.createQuestions(res.results))
            .catch(error => {console.log("Something went wrong.", error)})
    }

function createQuestions(data) {
        // create a new question obj for each element in api results
        data.forEach((q) =>
            new Question(q.question, q.incorrect_answers, q.correct_answer)
        );
}


function displayQuestion(question) {
        // displays a single question and its choices
    }

function checkAnswer(userChoice, correct_answer) {
		// checks if users choice is correct
	}


class Question {
    // creates a single question obj and randomizes the answer choices before sending obj to questions array
    constructor(text, answers, correct) {
        this.text = text;
        this.answers = answers;
        this.correct = correct  
        // add correct answer to random location in array
        let ranNum = Math.floor(Math.random() * 4)
        answers.splice(ranNum, 0, correct);
        // create new question obj
        this.question = {"text": text, "answers": answers, "correct": this.correct}  
        // add question to the questions array
        questions.push(this.question);
    }
}

class Game {
    // triggered after each round to check if game is over
    static isGameOver() {
        // checks remainingQuestions is greater than 0
        // if true, triggers playAgain

    }

    static playAgain() {
        // displays modal asking user to play again and final score
        // if playAgain 
            // calls ResetGame
    }

    static startGame(url) {
        // triggers call to API via Data 
        // sets score to 0
        // sets remainingQuestions to 0
        currentScore = 0;
        remainingQuestions = 10;
        getData(url);

    }

}

function toggleModal(targetModal) {
	if ((targetModal.style.display === 'none')) {
		targetModal.style.display = 'block';
	} else {
		targetModal.style.display = 'none';
	}
}


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

       
