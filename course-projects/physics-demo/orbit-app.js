/*
    This is just a fun project to play around with ES6 classes

    Hey listen. I had to do some jank stuff to get this to work. 
        Specifically I am struggling to understand what happens when I do a forEach loop on an array within a class.
            What is "this"? I thought it would be object that is having the method called from it, but I guess maybe it's the loop? or the function?
        I probably in fixing this did some stuff that is illegal. I am still learning. Also none of my distance functions work except the static one. Not sure what that's about, probably more "this" confusion. I mean I understand "this" calls the object you're working in, but why is "this" not working sometimes. I'm losing the context I guess, but I don't know how to maintain it other than just doing like const curThis = this. stupid.

*/

// Get canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const bodyColorPicker = document.getElementById('body-color-picker');


// Some detail variables
const borderSize = 2;
const colors = ['red', 'orange', 'gray', 'green', 'blue', 'purple'];
const maxNewCircleSize = 50;
const massMult = 1; // Need to try a size (mass) multiplier instead
const shootVelMult = 0.05;
const gravity = 0.22;
const ignoreDistance = 500;
const deleteDistance = 1000;
const closestPossible = 0;



// Some control settings
let inputMode = ['wait', ''];
let bodies = [];
let tempBody = null;
let uniqueID = 0;
let toggles = {
    'physics': false,
    'showVel': false,
    'randColor': true,
    'isStatic': false,
};





//  Body class
class Body {

    constructor(x, y, size, velX, velY, color, isStatic) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.mass = size*massMult;
        this.velX = velX;
        this.velY = velY;
        this.color = typeof color === 'undefined' || color === '' 
            ? (toggles.randColor ? colors[Math.floor((Math.random()*colors.length))] : bodyColorPicker.value) 
            : color;
        this.isStatic = typeof isStatic === 'undefined' ? false : isStatic;

        this.xx = -1;
        this.yy = -1;

        this.uid = uniqueID++;
    }



    static distance(x1, y1, x2, y2) {
        return Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1,2) );
    }

    distance(body) {
        return Body.distance(this.x, this.y, body.x, body.y);
    }

    distance(x, y) {
        return Body.distance(this.x, this.y, x, y);
    }

    grav() {
        const thisBody = this;

        
        bodies.forEach(function(body) {
            
            if(thisBody.uid !== body.uid && Body.distance(thisBody.x, thisBody.y, body.x, body.y) < ignoreDistance) {

                const xDist = thisBody.x - body.x;
                const yDist = thisBody.y - body.y;

                const totalDist = Body.distance(thisBody.x, thisBody.y, body.x, body.y);

                const force = gravity * ((thisBody.mass*body.mass) / (totalDist*totalDist));


    
                thisBody.velX += force * (-xDist/totalDist);
                thisBody.velY += force * (-yDist/totalDist);
            }
            
        });
    }

    move() {
        if(!this.isStatic) {

            const newX = this.x + this.velX;
            const newY = this.y + this.velY;

            for(let i = 0; i < bodies.length; i++) {
                let otherBod = bodies[i];
                if(otherBod === this) {
                    continue;
                }

                // There will be a collision
                if(Body.distance(newX, newY, otherBod.x, otherBod.y) < this.size + otherBod.size) { 
                    // let incomingNormal = normalize(this.velX, this.velY);

                    this.velX = -this.velX;
                    this.velY = -this.velY;
                }
            }

            

            this.x += this.velX;
            this.y += this.velY;
        }
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 360);
        ctx.fill();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 360);
        ctx.stroke();

        if(this.isStatic) {
            const lineSize = this.size/4;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x-lineSize, this.y-lineSize);
            ctx.lineTo(this.x+lineSize, this.y+lineSize);

            ctx.moveTo(this.x-lineSize, this.y+lineSize);
            ctx.lineTo(this.x+lineSize, this.y-lineSize);
            ctx.stroke();
        }
    }
}

function toggleBtn(element) {
    element.classList.toggle('enabled');
    toggles[element.id] = !toggles[element.id];
}

function triggerBtn(element) {
    switch(element.id) {
        case "clear":
            bodies = [];
            break;
        
        case "default":
            defaultBalls();
            break;
    }
}

function normalize(x, y) {
    let c = Math.sqrt(x*x + y*y);
    return [x/c, y,c];
}



canvas.addEventListener('mousedown', function(e) {
    const rect = e.target.getBoundingClientRect(); // found this online
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch(inputMode[0]) {
        case 'wait':
            //console.log(bodies[0].velX);
            inputMode = ['draw','newCircle'];

            tempBody = new Body(x, y, 1);
            tempBody.isStatic = toggles.isStatic;
            break;
        case 'draw':
            if(inputMode[1] === 'newCircle') {
                if(tempBody.isStatic) {
                    bodies.push(new Body(tempBody.x, tempBody.y, tempBody.size, 0, 0, tempBody.color, true));
                    inputMode = ['wait', ''];
                    tempBody = null;
                }
                inputMode[1] = 'strength';
                tempBody.xx = x;
                tempBody.yy = y;
            }
            else if(inputMode[1] === 'strength') {
                // launch!
                bodies.push(new Body(tempBody.x, tempBody.y, tempBody.size, 
                    (tempBody.x - tempBody.xx)*shootVelMult,
                    (tempBody.y - tempBody.yy)*shootVelMult,
                    tempBody.color, false));
                inputMode = ['wait', ''];
                tempBody = null;
            }
        default:
            break;
    }
});

canvas.addEventListener('mousemove', function(e) {
    const rect = e.target.getBoundingClientRect(); // found this online
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch(inputMode[0]) {
        case 'draw':
            if(inputMode[1] === 'newCircle') {
                tempBody.size = Math.min(Math.round(tempBody.distance(x,y)/2), maxNewCircleSize);
            }
            else if(inputMode[1] === 'strength') {
                tempBody.xx = x;
                tempBody.yy = y;
            }
            break;
        default:
            break;
    }

});

function draw() {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(borderSize, borderSize, canvas.width - borderSize*2, canvas.height - borderSize*2);

    if(tempBody !== null) {
        tempBody.render();
    }
    
    if(inputMode[0] === 'draw' && inputMode[1] === 'strength') {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tempBody.x, tempBody.y);
        ctx.lineTo(tempBody.x + (tempBody.x-tempBody.xx), tempBody.y + (tempBody.y-tempBody.yy));
        ctx.stroke();
    }

    if(toggles.physics) {
        bodies.forEach(function(body) {body.grav();});
        bodies.forEach(function(body) { body.move(); });
    }

    for(let i = bodies.length-1; i >= 0; i--) { // chop out stuff that gets too far away
        if(Body.distance(canvas.width/2, canvas.height/2, bodies[i].x, bodies[i].y) > deleteDistance) {
            bodies.splice(i, 1);
        }
    }

    bodies.forEach(function(body) {body.render();});
    
    if(toggles.showVel) {
        bodies.forEach(function(body) {
            if(!body.isStatic) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(body.x, body.y);
                ctx.lineTo(body.x + body.velX/shootVelMult, body.y + body.velY/shootVelMult);
                ctx.stroke();
            }
        });
    }
    


    
    window.requestAnimationFrame(draw);
}

//bodies.push(new Body(100,100,30,0,0));
//bodies.push(new Body(150,150,30,0,0));

function defaultBalls() {
    bodies = [];

    bodies.push(new Body(250, 250, 50, 0, 0, 'green', true));

    bodies.push(new Body(400, 250, 10, 0, 0.9, 'orange'));
    bodies.push(new Body(100, 250, 20, 0, -1.2, 'red'));
}
defaultBalls();

// bodies.push(new Body(380, 250, 1, -0.1, 1.2, 'black'));

draw();