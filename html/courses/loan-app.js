/*
    I am going to attempt to code this entire thing without the video. I've just finished watching the first part where we set up the UI.

    Things I added of my own volition:
        Can't press calculate if fields are empty
        Custom loading icon with canvas
        Showing/hiding loading icon and results during waiting period
        Random waiting period length
        Locking input fields while "calculating"
        He had inputs as number fields but I hated the up/down button at the end so I made it a text field
            Made sure inputs numbers. Allowed commans, and $ and % where relevant.

    I had to watch video in order to make actual loan calculator

    Everything was working prior to watching js part of the video. I added some stuff to pretty it up after watching (really error message box was the only improvement taken from the video)

    As I watched the video of him making script, I took notes about what he did differently.
    (I should note he gave a disclaimer at the beginning of the course he wouldn't always do things in the best practice. He said do things simply and beginner-friendly. So my criticisms are only of the program, not of his decision code in such a way)

    I made my inputs and outputs global variabes (in the scope of the script), he put them in his calculation function.
        I don't like this because I feel it's bad practice to re-allocate memory each time the function is called. You know the user will hit calculate, that's the whole reason they're there. I'd prefer to make the variables accessible throughout the script, especially in case I decided to edit them in some way outside of the caclulate funciton.

    He added a fancy div at the top to alert the user to errors. I like this, and I converted my alerts to use a custom alert function to generate an error messsage and then remove it after a specified amount of time.
        I had found the setTimeout function online, and it used what I now understand as an anonymous functin () => { }. I will leave it in now, but I now understand that setTimeout takes a function.
        I realized that the advantage of an anonymous function here is that you don't need to go looking for the error message, as it is visible by the in-place written function.
            I suppose you could pass the div variable to the delete funciton, but with such a simple function of deleting the div I think I prefer it this way.
    
    He used the .gif, and I went way out in left field and created a canvas
*/

// Grab the elements we need:
// Input elements
const loanAmount = document.querySelector('#amount');
const loanInterest = document.querySelector('#interest');
const repayYears = document.querySelector('#years');
const loanForm = document.querySelector('#loan-form');

// loanAmount.value = 1;
// loanInterest.value = 1;
// repayYears.value = 1;

const inputBtn = document.querySelector('#submit-btn');

// Canvas
const loadIcon = document.querySelector('#loading-canvas');
const ctx = loadIcon.getContext('2d');
const cWid = loadIcon.width;
const cHei = loadIcon.height;

//Output Elements
const results = document.querySelector('#results');
const monthlyPayment = document.querySelector('#monthly-payment');
const totalPayment = document.querySelector('#total-payment');
const totalInterest = document.querySelector('#total-interest');

// A few settings that may need to be tweaked:
const loadTimeMS = 2000; // how long the load icon should be visible
const loadTimeFlux = 1000; // variance in how long
const circleCount = 12;
const bigCircleRadius = Math.round(Math.min(cWid, cHei)/3); // roughly 1/3 canvas size

// For enabling and disabling the draw function
let drawing = false;

function createEventListeners() {

    // I created this whole function to create the event listeners, but I guess I only needed one!
    // Is this good practice?
    loanForm.addEventListener('submit', calculateLoan);
}

createEventListeners();

// This function will first verify the inputs are acceptable, display loading idicator, and then display calculated results
function calculateLoan(e) {

    // Ensure none of the fields are left blank
    if(loanAmount.value !== '' && loanInterest.value !== '' && repayYears.value !== '') {

        // Ensure all the fields are populated with acceptable strings (ex: not 30$ nor 50.12.5)
        if(isValidMoneyInput(loanAmount.value) && isValidPercentInput(loanInterest.value) && isValidNumberInput(repayYears.value)) {

            // Ensure that if the loan value < 1, the user inteded to enter it as a small percent
            // If the user already has a % symbol, don't bother with the popup either.
            if(loanInterest.value >= 1 || loanInterest.value.trim()[loanInterest.value.length-1] === '%' || confirm(`The interest should be entered as a percent. Submit as '${loanInterest.value}%'?`)) {

                // Turns off ability to edit inputs during calculation delay 
                inputsEnabled(false);
                
                // Shows loading icon, and hides results div in case it was already visible
                loadIcon.style.display = 'inline';
                results.style.display = 'none';
                
                // Initiates the animation of the loading icon
                drawing = true;
                window.requestAnimationFrame(draw);
                
                // Delay for loadTime seconds, and then calculate and display the outputs
                setTimeout(() => {
    
                    // Re-enabled input fields and button
                    inputsEnabled(true);
    
                    // Hide the loading icon and display the results
                    loadIcon.style.display = 'none';
                    results.style.display = 'inline';
    
                    // Stop updating canvas
                    drawing = false;
    
                    // Calculate loan output
                    // This section was taken from the video (with some additions)
                    
                    // Grab inputs and tweak them for the formulas
                    const principal = parseFloat(cleanMoneyStr(loanAmount.value));
                    const calculatedInterest = parseFloat(cleanPercentStr(loanInterest.value)) / 100 / 12;
                    const calculatedPayments = parseFloat(cleanNumberStr(repayYears.value)) * 12;

                    // Calculate the monthly 
                    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
                    const monthly = (principal*x*calculatedInterest) / (x - 1);
                    
                    // In the event that something broke such as x = 1, ensure output is not 1/0 and if not drop an error
                    if(isFinite(monthly)) {
                        monthlyPayment.value = fancifyMoneyNumber(monthly); 
                        totalPayment.value = fancifyMoneyNumber(monthly*calculatedPayments); 
                        totalInterest.value = fancifyMoneyNumber(monthly*calculatedPayments - principal); 
                    }
                    else {
                        showError('Error in calculation, please verify numbers enterred are correct.', 5000);
                    }
    
    
                }, loadTimeMS + Math.random()*loadTimeFlux*2 - loadTimeFlux);
            }

        }
        else {
            // Alert user if any forms contain non-numbers with fancy bulleted list
            showError('Please ensure the following field' + 
                ((isValidMoneyInput(loanAmount.value) + isValidPercentInput(loanInterest.value) + isValidNumberInput(repayYears.value) === 1) ? ' is' : 's are') + 
                ' properly formatted:' +
                (!isValidMoneyInput(loanAmount.value) ? ' Loan Amount (ex: $10,000) \u2022' : '') +
                (!isValidPercentInput(loanInterest.value) ? ' Loan Interest (ex: 5.2%) \u2022' : '') +
                (!isValidNumberInput(repayYears.value) ? ' Years to Repay (ex: 5)' : '') 
            , 10000);
        }

    }
    else {
        // If any fields are empty
        showError("Please ensure all three forms are populated before submitting.", 3000);
    }

    e.preventDefault();
}

// This specific function was created while watching the video
function showError(errorMsg, displayTimeMS) {

    // Get necessary ui elements
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');

    // Create error div
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';

    errorDiv.appendChild(document.createTextNode(errorMsg));

    card.insertBefore(errorDiv,heading);

    setTimeout(() => {

        errorDiv.remove();

    }, displayTimeMS);
}

// This function adds or removes the disabled attributes to the inputs so they cannot be used during the load time
function inputsEnabled(enabled) {
    if(!enabled) {
        loanAmount.setAttribute('disabled','');
        loanInterest.setAttribute('disabled','');
        repayYears.setAttribute('disabled','');
        inputBtn.setAttribute('disabled','');
    }
    else {
        loanAmount.removeAttribute('disabled');
        loanInterest.removeAttribute('disabled');
        repayYears.removeAttribute('disabled');
        inputBtn.removeAttribute('disabled');
    }
}

// Checks if a money string is valid or not
function isValidMoneyInput(str) {

    str = str.trim().replaceAll(',',''); // gets rid of commas and edge spaces

    if(str.length === 0) { // fails if the input was JUST spaces and commas
        return false;
    }

    if(str[0] == '$') { // if the input isn't just a $, chops that off as well
        if(str.length === 1) {
            return false
        }

        str = str.substring(1,str.length);
    }

    // the remaining string is for vailidity
    return !isNaN(str);
}

// Gets rid of allowed characters for a clean number string. String will have already been validated
function cleanMoneyStr(str) {
    return str.trim().replaceAll('$','').replaceAll(',','');
}

// Checks if a percent string is valid or not
function isValidPercentInput(str) {

    str = str.trim(); // trim spaces

    if(str.length == 0) { // fails if str was only spaces
        return false;
    }

    if(str[str.length-1] === '%') { // removes percent symbol from the end if present
        str = str.substring(0,str.length-1);
    }

    // Verify remaining string is a number
    return !isNaN(str);
    
}

// Gets rid of allowed characters for a clean number string. String will have already been validated
function cleanPercentStr(str) {
    return str.trim().replaceAll(',','').replaceAll('%','');
}

// Barring spaces and commas, is this a valid number?
function isValidNumberInput(str) {
    str = str.trim().replaceAll(',','');

    return !isNaN(str);
}

// Gets rid of allowed characters for a clean number string. String will have already been validated
function cleanNumberStr(str) {
    return str.trim().replaceAll(',','');
}

// Fancy up a number to a dollar amount
function fancifyMoneyNumber(num) {
    // Grab just the last 3 digits ( .XX )
    let decimal = num.toFixed(2);
    decimal = decimal.substring(decimal.length-3, decimal.length);

    // Grab the number without the decimal
    let whole = '' + Math.floor(num);
    let newWhole = ''; // ha...

    if(whole.length > 4) { // ignore 4 digit numbers and below
        for(let i = 0; i < whole.length; i++) {
            // Grab the numbers from the end, and every third insert a comma
            newWhole = whole[whole.length-i-1] + (i != 0 && i%3 == 0 ? ',' : '') + newWhole;
        }
    }
    else {
        newWhole = whole;
    }

    return '$' + newWhole + decimal;
}

// Draw the loading icon on the canvas.
// Don't tell anyone but I probably spent just as much time on this as anything above
// I have quite a bit of experience with this kind of stuff. I know it's largely not practical, I guess I'm just showing off what I can do with shape and color manipulation.
function draw() {

    // Clear canvas every iteration
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,cWid,cHei);

    if(drawing) { // only continue updating canvas if the canvas is visible
        
        // I messed around with a lot of different stuff. I think I like the simple cirlce the best


        // Draw outline circles
        // ctx.strokeStyle = '#aaccaa';
        // ctx.fillStyle = ctx.strokeStyle;
        // ctx.beginPath();
        // ctx.arc(cWid/2, cHei/2, bigCircleRadius*1.3, 0,360);
        // ctx.fill();

        // ctx.fillStyle = '#fafffa';
        // ctx.beginPath();
        // ctx.arc(cWid/2, cHei/2, bigCircleRadius*0.7, 0,360);
        // ctx.fill();

        // Draw spinning circles
        // let curCol = Math.floor( Math.abs(Math.sin(Date.now()/100)+1)/2*128+64 );
        ctx.fillStyle = 'black'; // `rgb(${curCol},${curCol},${curCol})`;

        // draw several circles. Could use a global i variable and draw one circle every update to save on processing power
        for(let i = 0; i < circleCount; i++) {

            let rad = Math.PI*2 / circleCount * i ; // selector for "degrees" around the circle

            ctx.beginPath();
            ctx.arc(
                cWid/2 + Math.sin( rad - Date.now()/1000) * bigCircleRadius, // the x and y coordinates of each circle
                cHei/2 + Math.cos( rad - Date.now()/1000) * bigCircleRadius, // uses the time to make them move
                bigCircleRadius/6 * (Math.sin( rad - Date.now()/200)/2+1),   // causes the circles to change size, adding a cool warble effect
                0,360
            );
            ctx.fill();

        }

        // ctx.fillStyle = 'black';
        // ctx.font = '48px serif';
        // ctx.fillText(curCol, 2, 80);
    
        window.requestAnimationFrame(draw); // continue drawing canvas next iteration
    }
}


