// Global Variables 
const questions = {};

// State Variables 
// url takes three params: category #, difficulty, and type = [easy, medium, hard]
let api_url =
	'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';
let paramsObj = {"category": "18", "type": "multiple", "difficulty": "easy"} 
let currentQuestion = {};
let remainingQuestions = 10;
let currentScore = 0;



/*----  Cached DOM Elements --- */

const startModal = document.querySelector("#start-modal")
const startBtn = document.querySelector("#start");
const optionsBtn = document.querySelector("#options");
const score = document.querySelector("#score");
const currentTopic = document.querySelector("#current-topic");
const currentQ = document.querySelector("#question");
const answers = document.querySelector("#answers");


/*---- Hide and Show Start Modal -----*/
// add event listener to start button to close modal and begin game
startBtn.addEventListener("click", () => {
    toggleModal(startModal);
    // get api data 
    Data(api_url, paramsObj);
})



/*---- Classes and Methods -----*/

class Data {
    // sends request to API to generate an object containing ten questions and answers
    constructor(url, paramsObj) {
        // takes a url and obj of params to modify api request
        
    }

    getData() {
        // stores fetched data in var
    }

    formatData() {
        // formats each question and answer in the data so answer order is different each time
    }


};

class Quiz {
	// access object and displays a question to user with MC answers
	constructor(data) {
		// takes formatted data and creates variables for one question
	}

	displayQuestion(question, answer) {
        // displays a single question and its choices
    }

	checkAnswer() {
		// checks if users choice is correct
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

    static resetGame() {
        // triggers call to API via Data 
        // resets score to 0
        // resets remainingQuestions to 0

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

       
