/*

    Once again, I will attempt to create the entire script before I watch the non UI videos.
    Seeing as this is a pretty simple project, I'll try to spice it up as much as I can.

    This is the first time I've officially used objects in js. I have seen them used a little but am very familiar with the concept of OOP as I have experience in Java.
    Sorry I couldn't help myself, I just had to find a way to use another canvas. Pretty happy with the confetti.
    I was successful in creating the entire application (as I saw fit) prior to watching the scripting videos from the course.
    In hindsight I would have just made two object variables for the settings instead of an object containing two objects, but I like the idea of using objects in general.
    
    I will admit that when I started trying to change the look of this project I was a little discouraged. I still feel pretty out of my element (no pun intended) when working with html and css. 
        I have been able to figure it out (at least I think I've "figured it out") so far by just googling what I want to do and then fiddling with things until it looks how I want (pretty normal for programming, I know).
        I haven't tried adding my own class/id style changes, I have just been editing each tag individually. I believe this to be bad practice in general, but I am only doing it out of ignorance. I look forward to learning good style practice in the (near) future. It isn't relevant to the course. I'm trying to learn JS and then demonstrate my understanding. I hope all the stupid extra stuff I add demonstrates that.
    I would like to add something to keep track of total wins and losses, but I can't really add anything to the html as I am working on this without internet, so the style sheet doesn't load.
    
    I may make tweaks as I watch the videos. I will document any thoughts and changes as I watch:

*/

// Gather inputs
const difficultyForm = document.getElementById('difficulty-form');
const submissionForm = document.getElementById('submission-form');
const submissionField = document.getElementById('guess-input');
const heading = document.getElementById('heading1');

// Gather editable elements
const message = document.querySelector('.message');
const submissionBox = document.getElementById('guess-input');
const maxNum = document.querySelector('.max-num');

// Game Settings
const settings = { // Placing settings in objects allows for using a single variable, and grants the ability to access values programatically (such as settings.highNumbers[difficulty] ). 
    "highNumbers": {
        "easy":10,
        "medium":25,
        "hard":50
    },
    "guessNumbers": { // pretty steep difficulty curve. Not really going for fun here, just making it work
        "easy":5,
        "medium":4,
        "hard":3
    }
}

// Game Variables
let difficulty = 'easy';
let guesses = 0;
let pastGuesses = []; // to prevent the player from guessing the same number twice
let answer; // what the correct answer will be
let gameEnded = false; // for when the player has won/lost but has submitted a new guess for the next round



function init() { // Still not sure if it's good practice to put these bad boys in a function and then call it. Brad did it so I guess now I'm doing it. Please tell me if it's dumb, I don't see the point of it other than if it's good programming practice.

    // Create Event Listeners
    submissionForm.addEventListener('submit', guessed);
    difficultyForm.addEventListener('submit', setDifficulty);
    heading.addEventListener('click', shootConfetti);

    resetSubmissionForm(); // Make sure everything is clean at the start
}
init();

// Triggered when the player clicks on a difficulty button
function setDifficulty(e) {

    const selectedDifficulty = e.target.submitted; // will pull which button is presssed, as set by the 'onclick' element of each button

    if(typeof selectedDifficulty === 'string' && selectedDifficulty !== '') { // in case somehow they trigger the form without clicking one of my buttons
        
        difficulty = selectedDifficulty; // set difficulty

        resetSubmissionForm(); // set things back to default for that difficulty

    }
    else {
        console.error('Unexpected difficulty submission:',selectedDifficulty);
    }

    e.preventDefault();
}

function guessed(e) {

    const guess = submissionField.value; // grab the guess from the form. I leave it as a string and use == for comparison

    if(gameEnded) { // If the game is over and a new guess has been submitted, we first need to reset the game
        gameEnded = false;
        let tempGuess = submissionBox.value; // Since resetSubmissionForm wipes the guess, we want to save it in this once instance
        resetSubmissionForm();
        submissionBox.value = tempGuess;
    }

    // Checking most likely outcomes first
    if(guess !== '') {
        if(guess > 0 && guess <= settings.highNumbers[difficulty]) {

            if(guesses === 0) { // We don't need to pick the answer until the player starts playing. Then we always know we have a fresh answer. Not sure why I am using the plural pronoun 'we'. I guess you're along for the ride too now.
                answer = Math.floor(Math.random() * settings.highNumbers[difficulty]) + 1;
                console.log("Hey cheater, the answer is " + answer);
                drawing = false; // just in case the player starts playing while the confetti is falling
            }

            if(!pastGuesses[guess]) { // Makes sure the player hasn't already guessed this number before

                pastGuesses[guess] = true; // marks the number as "guessed"
                
                guesses++;

                if(guess == answer) {
                    shootConfetti(); // Who doesn't love confetti?!
                    setMessage(`You win! You guessed right in ${guesses} out of ${settings.guessNumbers[difficulty]} guesses!`, 'green');
                    submissionBox.style.borderColor = 'green';

                    gameEnded = true; // so we know to reset everything on the next guess
                }
                else {
                    if(guesses >= settings.guessNumbers[difficulty]) { // too many guesses for the difficulty
                        setMessage('You lose! Please play again for some of that sweet, sweet dopamine.' + (difficulty !== 'easy' ? ' Maybe try a lower difficulty.' : ''), 'red');
                        submissionBox.style.borderColor = 'red';
                        gameEnded = true; // so we know to reset everything on the next guess. wait I just wrote this
                    }
                    else {
                        setMessage(`Wrong! Remaining guesses: ${settings.guessNumbers[difficulty] - guesses}`, 'black'); // in the case the guess is legal but wrong
                    }
                }

            }
            else {
                setMessage(`You already guessed that number! Remaining guesses: ${settings.guessNumbers[difficulty] - guesses}`, 'blue'); // in the case the guess has been guessed
            }

        }
        else {
            setMessage(`Please enter a number within the range 1 to ${settings.highNumbers[difficulty]}`, 'red'); // in the case the guess isn't within the bounds
        }
    }
    else {
        setMessage('Please enter a number before submitting.', 'red'); // in the case the guess field is blank
    }

    e.preventDefault();
}

function resetSubmissionForm() { // Clears everything back to default
    
    guesses = 0; // Starts the guessing over
    pastGuesses = Array(settings.highNumbers[difficulty]).fill(false); // wipes the record of past guesses

    message.style.visibility = 'hidden'; // hides the info message
    message.style.color = 'black';

    maxNum.textContent = settings.highNumbers[difficulty]; // ensures the text says the correct guessing range, in case function was called by a difficulty change

    submissionBox.style.borderColor = ''; // resets guess box border in case it was green or red due to a game end scenario

    submissionBox.value = ''; // clears submission box (not needed in one instance but is handled appropriately in that instance)
}

// Allows for easy adjustment of the info message color and content
function setMessage(text, color) {
    message.style.visibility = 'visible';
    message.textContent = text;
    message.style.color = color;
}




// The following is all for drawing confetti. I'm sorry in advance.

// Create canvas context
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');

let drawing = false; // For stopping the self-reference of the draw() function
let conf = []; // confetti array

// Settings for confetti
const confCount = 300;
const drag = 0.9;
const grav = 0.8;
const drift = 0.3;
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const confSizeMin = 5;
const confSizeMax = 9;

// To be called to begin the confetti blast
function shootConfetti() {
    if(!drawing) { // in case somehow the user triggers confetti again before it's finished animating
        drawing = true; // enable drawing "loop"

        canvas.width = window.innerWidth; // ensure canvas is correct size when ready to shoot, in case it was resized after page loadd
        canvas.height = window.innerHeight;
        canvas.style.visibility = 'visible';

        const x = Math.round(canvas.width/2); // sets start point for each confetti at center of screen
        const y = Math.round(canvas.height/2);

        for(let i = 0; i < confCount; i++) { // loop through each confetti object and set all necessary variables
            conf[i] = {
                'x':x, // x and y coordinates
                'y':y,
                'velX': (Math.random()-0.5) * canvas.width*0.13, // x and y velocity of the confetti -- scales with size of window
                'velY': -Math.random() * canvas.height*0.1,
                'size': Math.floor(Math.random() * (confSizeMax-confSizeMin)) + confSizeMin, // size of each particle
                'color': colors[Math.floor(Math.random()*colors.length-1)+1]
            }
        }

        draw(); // triggers first iteration of the draw "loop"

        setTimeout(() => {drawing = false;}, 3000); // ensures confetti will stop being rendered after a certain amount of time
    }
}

// To be called to simulate the physics for a given confetti particle
function simConfetti(i) {
    
    conf[i].x += conf[i].velX; // move the confetti by its own velocity
    conf[i].y += conf[i].velY;

    conf[i].velX *= drag; // edit the x and y velocities based on drag 
    conf[i].velX += drift * (Math.round(Math.random()*2) - 1); // drift is made either + or -, which makes them flutter side to side nicely
    conf[i].velY *= drag;
    conf[i].velY += grav; // gravity is applied to make them fall down (or up, as lower on the screen is higher Y value)
}

function draw() {

    // Always clear the canvas between draws so old confetti isn't left behind. Looks like fireworks if you turn it off
    // Outside drawing condition so in case any confetti is still visible when it stops, it will all be erased
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(drawing) { // essentially, while drawing == true
        
        for(let i = 0; i < confCount; i++) { // loop through each confetti
            simConfetti(i); // simulate the physics for each particle

            ctx.fillStyle = conf[i].color; // prepare to draw the particle
            let size = conf[i].size * (Math.random()+0.5); // make the size fluxuate so it looks like it's tumbling
            ctx.fillRect(conf[i].x - size/2, conf[i].y - size/2, size, size); // draw the particle, offset by half the size so it draws from the center instead of the corner
        }

        window.requestAnimationFrame(draw); // call the draw function again when the browser window refreshes
    }
    else {
        canvas.style.visibility = 'hidden';
    }

}