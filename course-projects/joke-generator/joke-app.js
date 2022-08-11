/*
    I'm getting brave. This time I stopped after he explained the idea of the project, and now I will attempt the entire thing on my own.
    
    Ok, I think I'm happy with it. I was only prompted to make something where I could load a specified number of chuck norris jokes from the ICNDb site.
    I succeeding in making styling the site (just a little bit, didn't want to go crazy), and then scripting its functionality.

    Here are the site features:
        Input number of desired jokes, limited from one to ten
        After submitting, the site requests n jokes from ICNDb
        The returned jokes are placed into their own divs for styling
        The total told jokes is incremented and saved to local storage
    
    Bonus features:
        The submit button kicks to the right when clicked
        Added cowboy hat canvas I found online, and then made it spin
        Put jokes in fancy divs that move and change when you hover over them
    
    Overall this project was pretty easy. Using XHR is pretty straightforward, so I didn't want to spend too much time on this one.

    Here are my thoughts as I watch Brad create this site:
        He uses fancer form stuff than I know how to do.



*/

// Document variables
const jokeForm = document.getElementById('joke-form');
const inputField = document.querySelector('.text-input');
const warnText = document.getElementById('warning-text');
const jokeText = document.getElementById('joke-box');
const jokesLoaded = document.getElementById('jokes-loaded');

// Live-use variables
let loadingData = false; // Ensure user can't request more when a request is issued
let totalJokes = 0;

// Variables for cowboy hat graphic
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cWid = 500;
const cHei = 500;
let wave;




// Event Listener for submitting joke request
jokeForm.addEventListener('submit', function(e) {

    if(warnText.style.visibility === 'hidden') { // save me from checking the stuff an extra time -- will be hidden if there is a valid number in the field
        if(!loadingData) {
            requstJokesFromSite();
        }
    }

    e.preventDefault();
});

// Event listener for when the user changes the number in the input field
inputField.addEventListener('input', function() {
    // if the user changes the entry to something invalid
    if(typeof inputField.value === 'undefined' || inputField.value === '' || inputField.value < 1 || inputField.value > 10) {
        warnText.style.visibility = 'visible'; // display the error message
        inputField.classList.add('error-field'); // make the text box have a red border
    }
    else {
        warnText.style.visibility = 'hidden'; // If the input is valid, make hide the error message
        inputField.classList.remove('error-field'); // and change the text field back to normal
    }
});

// create XHR for jokes from the ICNDb site
function requstJokesFromSite() {
    loadingData = true; // stop future requests until we are finished listening for a joke

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `http://api.icndb.com/jokes/random/${inputField.value}`); // Send request for inputField.value number of jokes

    xhr.onload = function() { // Upon getting a response
        loadingData = false; // allow for another request
        if(xhr.status === 200) { // If we get the all clear status
            parseResponse(this.responseText); // run the response through the parser
        }
        else {
            console.error('XML Http Requst status not 200!', xhr); // otherwise, write xhr to error in console.
        }
    };

    xhr.onerror = function() { // If we don't get a response (such as a wrong url)
        loadingData = false; // allow for another request
        console.error('Error loading data!', xhr);
    }

    xhr.send(); // Send the prepared xhr to the server
}

// Take in the response from the xhr and convert it to the html divs
function parseResponse(rawData) {
    
    const data = (typeof rawData === 'undefined' ? undefined : JSON.parse(rawData)); // only try to parse the json if it isn't undefined

    let output = ''; // prepare the screen output 

    if(typeof data !== 'undefined' && data.type === 'success') { // if we get a good response
        data.value.forEach(function(jokeObj, i){ // loop through each joke response
            output += `<div class="told-joke">${jokeObj.joke}</div>\n`; // and add each to the output in a div
        });

        lsUpdateJokeCount(); // Increase the number of jokes told accordingly
    }
    else { // In case there is a problem with the response
        output = 'Sorry, there was an error loading jokes! Chuck Norris must have accidentally caused an earthquake near the server when he jumped over a puddle.'
        console.error('Error loading jokes! Received an undefined response.', rawData);
    }

    jokeText.innerHTML = output; // put the generated output into the jokeText div to be displayed
}

// I would make a class for this but it's pointless to make static classes this small. It's not like I'm making a library to reuse.
// This function is called initially to load the number of jokes told from a previous sesssion
function lsLoadJokeCount() {
    const ls = localStorage.getItem('joke-count'); // load jokes from storage

    if(typeof ls !== 'undefined' && ls && ls !== 'NaN' && ls !== '') { // if the loaded data is valid
        totalJokes = parseInt(ls); // store the number of jokes told in the past
    }
    else {
        totalJokes = 0; // if we don't have valid data, we probably haven't told any jokes yet
    }
    jokesLoaded.innerHTML = 'Jokes Loaded: ' + totalJokes; // updtae the displayed number of jokes to be what we loaded
}

// Called when more jokes are told
function lsUpdateJokeCount() {
    totalJokes += parseInt(inputField.value); // increment the number of jokes told by how many we loaded
    jokesLoaded.innerHTML = 'Jokes Loaded: ' + totalJokes; // display number of jokes
    localStorage.setItem('joke-count', totalJokes); // save number of jokes
}

// I decided to add a fun graphic next to the title
function drawHat() { 
    // I found this line path online. I thought about trying to make it myself but boy that would have been a waste of time
    // Here's where I got it: https://codepen.io/kimlarocca/pen/bNVgVR?css-preprocessor=sass
    ctx.clearRect(0, 0, 500, 500);

    // prepare to draw hat lines 
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = '#303030';
    ctx.lineWidth = 15;

    // I decided the plain hat wasn't cool enough so I made it spin
    // Having line width makes it look 3d, no extra work required!
    wave = Math.sin(Date.now()/1000);

    //the brim
    scaleMoveTo(50, 270); // I made custom functions to allow me to spin the hat without rewriting a bunch of code (which I don't really understand because these are just a ton of coordinates that describe the hat shape. I don't know which line is which)
    scaleBezierCurveTo(250, 520, 450, 130, 450, 290);
    scaleBezierCurveTo(440, 470, 200, 470, 50, 300);
    scaleBezierCurveTo(20, 265, 35, 255, 45, 265);
    ctx.closePath();
    
    //top of the hat
    scaleMoveTo(180, 325);
    scaleBezierCurveTo(150, 56, 186, 20, 240, 100);
    scaleBezierCurveTo(240, 50, 330, 20, 330, 285);
    scaleMoveTo(330, 283);
    scaleQuadraticCurveTo(245, 350, 178, 324);
    
    ctx.fill();
    ctx.stroke();	

    // Hide issues with narrow bezier curve at top and bottom of 0 width hat, this hides that graphical issue
    ctx.clearRect(0, 0, 500, 55);
    ctx.clearRect(0, 434, 500, 500);

    window.requestAnimationFrame(drawHat); // keep the drawing going
}

// Allows me to add a sin wave to the horizontal stretch of bezier curves
function scaleBezierCurveTo(x1, y1, x2, y2, x3, y3) {
    ctx.bezierCurveTo( 
        cWid/2 + (cWid/2 - x1)*wave, y1,
        cWid/2 + (cWid/2 - x2)*wave, y2,
        cWid/2 + (cWid/2 - x3)*wave, y3
    );
}

// Allows me to add a sin wave to the horizontal stretch of quadratic curves
function scaleQuadraticCurveTo(x1, y1, x2, y2) {
    ctx.quadraticCurveTo( 
        cWid/2 + (cWid/2 - x1)*wave, y1,
        cWid/2 + (cWid/2 - x2)*wave, y2
    );
}

// Allows me to add a sin wave to the horizontal stretch of draw point positioning
function scaleMoveTo(x1, y1) {
    ctx.moveTo(cWid/2 + (cWid/2 - x1)*wave, y1);
}

document.addEventListener('DOMContentLoaded', lsLoadJokeCount); // Wait until the document is ready before loading jokes, as we are editing part of the DOM
ctx.scale(0.2,0.2); // set the scale of the hat, as I want it on a smaller canvas than the original design.
window.requestAnimationFrame(drawHat); // Begin animating the hat