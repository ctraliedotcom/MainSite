//Programmer: Chris Tralie
//Purpose: To provide an engine for the wheel of fortune app
var namestxt;

var names = [];
var angle = 0;
var finalAngle = 0;
var spinning = false;
var targetTime = 0;
var startTime = Date.now();
var omega0 = 0; //Initial angular velocity
var alpha = 0.2; //Negative angular acceleration
var angle0 = 0;

function updateNames() {
    var textInput = document.getElementById("names");
    names = textInput.value.split("\n");
}

function drawWheel() {
    var colors = ['#FFAAAA', '#AAFFAA', '#AAAAFF', '#FFFF00', '#00FFFF', '#FF00FF'];
    var N = names.length;
    var theta = 2*Math.PI/N;    
    var canvas = document.getElementById("wof");
    var ctx = canvas.getContext("2d");
    var W = canvas.width;
    var H = canvas.height;
    var nextX = W/2*Math.cos(theta);
    var nextY = W/2*Math.sin(theta);
    
    ctx.clearRect(0, 0, W, H);
    ctx.font = "30px Arial";
    ctx.translate(W/2, H/2);
    ctx.rotate(angle);
    
    //Draw all of the colored triangles
    for (var i = 0; i < N; i++) {
        ctx.rotate(2*Math.PI*i/N);
        ctx.fillStyle = colors[i%colors.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(W/2, 0);
        ctx.lineTo(nextX, nextY);
        ctx.closePath();
        ctx.fill();    
        ctx.rotate(-2*Math.PI*i/N);
    }
    //Draw all of the names
    ctx.fillStyle = "#000000";
    for (var i = 0; i < N; i++) {
        ctx.rotate(2*Math.PI*(i- 0.25)/N);
        ctx.fillText(names[i],W/6, 0);
        ctx.rotate(-2*Math.PI*(i - 0.25)/N);
    }
    ctx.rotate(-angle); //Undo global rotation
    
    ctx.beginPath();
    ctx.moveTo(W/2.5, 0);
    ctx.lineTo(W/2, 0);
    ctx.lineTo(W/2, H/20);
    ctx.fill();
    
    ctx.translate(-W/2, -H/2);
    if (spinning) {
        var t = (Date.now() - startTime) / 1000.0;
        angle = angle0 + omega0*t - 0.5*alpha*t*t; //The magic constant deceleration formula
        if (targetTime - t < 0) { //Stop when the target time is reached
            //console.log("targetTime = " + targetTime + ", stopping t = " + t + ", angle = " + angle + ", finalAngle = " + finalAngle);
            spinning = false;
        }
        requestAnimationFrame(drawWheel);
    }
}
