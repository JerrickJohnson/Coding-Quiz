const startButton = document.getElementById('start-btn');
const questionEl = document.getElementById('question');
const questionContainerEl = document.getElementById('question-container');
const questionButtonsEl = document.getElementById('answer-buttons');
const answerButtonsEl = document.getElementById('answer-buttons');
const correctWrongEl = document.getElementById('correctWrong');
const timeRemainingEl = document.getElementById('time-remaining');
const highScoreButton = document.getElementById('highScore-button');
const startContainer = document.getElementById('start');

let shuffledQuestions, currentQuestionIndex;
let timeRemaining = 60;
let timerId;
let score = 0;

/*Hide the Questions*/
questionEl.classList.add('hide');

startButton.addEventListener('click', startQuiz);

highScoreButton.addEventListener('click', viewHighScores);

/*Start the Quiz*/
function startQuiz() {
    console.log('Started!');
    hideStart();
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;

    timeRemaining = 60;
    clearInterval(timerId);
    showTimeRemaining();

    questionContainerEl.classList.remove('hide');
    startContainer.classList.add('hide');
    questionEl.classList.remove('hide');
    answerButtonsEl.classList.remove('hide');

    showQuestion();
    startTimer ();
}

/*Timer*/
function startTimer() {
    timerId = setInterval(() => {
        timeRemaining--;
        showTimeRemaining();
        
        if(timeRemaining <= 0) {
            clearInterval(timerId);
            endGame();
        }
    }, 1000);
}

function showTimeRemaining() {
    timeRemainingEl.textContent = `Time: ${timeRemaining}`;
}

/*Hide the Start Button*/
function hideStart() {
    startButton.classList.add('hide');
}

/*Bring in and Show the Question*/
function showQuestion() {
    resetState();
    const question = shuffledQuestions[currentQuestionIndex];
    questionEl.innerText = question.question;
    questionEl.classList.remove('hide');
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text;
        button.classList.add('btn')
        button.classList.add('answer-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsEl.appendChild(button);
    })

}

/*Reset State*/
function resetState() {
    answerButtonsEl.classList.remove('answered');
    correctWrongEl.classList.remove('correct');
    correctWrongEl.classList.remove('wrong');
    correctWrongEl.classList.add('hide');
    while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        };
 }

 /*Select Answer Function*/
function selectAnswer(event) {

    answerButtonsEl.classList.add('answered');

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct;

    if (isCorrect) {
        correctWrongEl.innerText = 'Correct!';
        correctWrongEl.classList.add('correct');
        score++;
    } else {
        correctWrongEl.innerText = 'Wrong';
        correctWrongEl.classList.add('wrong');
        timeRemaining -= 10;
        showTimeRemaining();
    }
    correctWrongEl.classList.remove('hide');

    setTimeout(() => {
    correctWrongEl.classList.add('hide');
    const currentQuestion = shuffledQuestions[currentQuestionIndex];    
    const correctAnswerButton = answerButtonsEl.querySelector(`[data-correct='true']`);
    correctAnswerButton.classList.add('correct');
    selectedButton.classList.remove('correct-answer', 'wrong-answer');
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        endGame();
    }

    if (timeRemaining === 0) {
        // Clears interval
        resetState();
        endGame();
      }


  }, 2000);
}

/* Function EndGame or end of the Quiz*/
function endGame() {
    clearInterval(timerId);

    questionEl.classList.add('hide');
    answerButtonsEl.classList.add('hide');

    const finalScore = Math.round((score / shuffledQuestions.length) * 100);

    const resultsContainer = document.createElement('div');
    resultsContainer.innerHTML = 
    `<hw style="font-size: 40px;"> All Done!</h2>
    <p>Your Final score is ${finalScore.toFixed(2)}%.</p>
    <label for="initials"> Enter Initials: </label>
    <input type="text" id="initials" maxlength="3" />
    <button id="submit-btn" class="btn">Submit</button>`;

    questionContainerEl.appendChild(resultsContainer);

    const submitButton = document.getElementById('submit-btn');
    submitButton.addEventListener('click', saveHighScore);
}

/*Scoring and HighScores*/
function saveHighScore() {
    const initialsInput = document.getElementById('initials');
    const initials = initialsInput.value.toUpperCase();
    const finalScore = Math.round((score / shuffledQuestions.length) * 100);

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ initials, score: finalScore });
    localStorage.setItem('highScores', JSON.stringify(highScores));

    viewHighScores();
}

function viewHighScores() {
    questionContainerEl.innerHTML = '';

    startContainer.classList.add('hide');
    startButton.classList.add('hide');

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const sortedHighScores = highScores.sort((a, b) => b.score - a.score);
    const highScoresList = document.createElement("ul");
    highScoresList.id = "high-scores-list";
    sortedHighScores.forEach((scoreItem, index) => {
        const listItem = document.createElement('li');
        listItem.className = "high-score-item";

        listItem.textContent = `${index + 1}. ${scoreItem.initials} - ${scoreItem.score}%`;
        highScoresList.appendChild(listItem);
    });
    questionContainerEl.appendChild(highScoresList);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.innerHTML = 
    `<button id="go-back-btn" class="btn">Go Back</button>
    <button id="clear-high-scores-btn" class="btn">Clear High Scores</button>`;
    questionContainerEl.appendChild(buttonsContainer);

    const goBackButton = document.getElementById('go-back-btn');
    goBackButton.addEventListener('click', () => {
        location.reload();
    });

    const clearHighScoresButton = document.getElementById('clear-high-scores-btn');
    clearHighScoresButton.addEventListener('click', () => {
        localStorage.removeItem("highScores");
        viewHighScores();
    });

    highScoreButton.classList.add('hide');
    questionContainerEl.classList.remove('hide');
}

/*Reset the Quiz or Restart from Beginning*/
function resetQuiz() {
    shuffledQuestions = null;
    currentQuestionIndex = 0;
    timeRemaining = 60;
    clearInterval(timerId);

    questionEl.classList.add('hide');
    answerButtonsEl.classList.add('hide');
    correctWrongEl.classList.add('hide');
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild(questionContainerEl.firstChild);
    }
    highScoreButton.classList.remove('hide');
    startContainer.classList.remove('hide');

    startButton.addEventListener('click', startQuiz);

    const initialsInput = document.getElementById('initials');
    initialsInput.value = '';
}

/*The Questions */
const questions = [
    {
      question: 'Commonly used data types Do Not Include:', 
      answers: [
        { text: '1.strings', correct: true},
        { text: '2.booleans', correct: false},
        { text: '3.alerts', correct: false},
        { text: '4.numbers', correct: false}
      ],
    },
    {
      question: 'The condition in an IF/ else statement is enclosed with:', 
      answers: [
        { text: '1.quotes', correct: false},
        { text: '2.curley brackets', correct: true},
        { text: '3.parenthesis', correct: false},
        { text: '4.square brackets', correct: false}
      ],
    },
    {
      question: 'String Values must be enclosed within ___ when being assigned Variables', 
      answers: [
        { text: '1.commas', correct: false},
        { text: '2.curley brackets', correct: false},
        { text: '3.quotes', correct: true},
        { text: '4.parenthesis', correct: false}
      ],
    },
    {
      question: 'Arrays in JavaScript can be used to store _____', 
      answers: [
        { text: '1.numbers and strings', correct: false},
        { text: '2.other arrays', correct: false},
        { text: '3.booleans', correct: false},
        { text: '4.All the Above', correct: true}
      ]
    },
    {
        question: 'A very useful tool during development and debugging for printing content to the debugger is:', 
        answers: [
          { text: '1.JavaScript', correct: false},
          { text: '2.terminal/bash', correct: false},
          { text: '3.for loops', correct: false},
          { text: '4.console.log', correct: true}
        ]
      }
];
