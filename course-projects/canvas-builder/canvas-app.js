/*




*/

const mainCanvas = document.getElementById('main-canvas');
const mctx = mainCanvas.getContext('2d');


let trueMainCanvasSize = 500;

mainCanvas.width = trueMainCanvasSize;
mainCanvas.height = trueMainCanvasSize;





function mainDraw() {

    mctx.fillStyle = 'black';
    mctx.fillRect(0,0,500,500);

    window.requestAnimationFrame(mainDraw);
}

document.addEventListener('DOMContentLoaded', function() {
    mainDraw();
});








