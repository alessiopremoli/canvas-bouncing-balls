// https://www.html5canvastutorials.com/advanced/html5-canvas-bouncing-balls/

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var speed = 2;
var balls = [];
var mouseX = 0;
var mouseY = 0;

var ballDefinition = [
    {
        color: '#FF4136',
        title: 'Disegno'
    },
    {
        color: '#FFC107',
        title: 'Musica'
    },
    {
        color: '#85144b',
        title: 'Coding'
    },
    {
        color: '#060607',
        title: 'Stampa'
    },
]

// function to generate random number

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    // if min = 10 max = 15 random var = 0.1544465; it will return approzimately 10 because of math.floor
    return num;
}

class Ball {
    constructor(color) {
        this.velX = random(-speed, speed);
        this.velY = random(-speed, speed);
        this.color = color;
        this.size = random(50, 100);
        this.x = random(this.size, width - this.size);
        this.y = random(this.size, height - this.size);

        if (this.velX === 0)
            this.velX++

        if (this.velY === 0)
            this.velY++
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        if (this.x < 0) {
            this.x *= -1;
            this.velX = -(this.velX);
        }

        if (this.y < 0) {
            this.y *= -1;
            this.velY = -(this.velY);
        }

        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {


        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if ((!(this.x === balls[j].x && this.y === balls[j].y && this.velX === balls[j].velX && this.velY === balls[j].velY))) {
                let dx = this.x - balls[j].x;
                let dy = this.y - balls[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    this.velX *= -1;
                    this.velY *= -1;
                    this.draw();
                    this.update();
                }
            }
        }
    }

    detectCollisionWithMouseBubble() {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 100, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();

        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 + this.size) {
            // console.log({mouseX, mouseY}, distance, 100 + this.size, distance - 100 - this.size);
            this.x += distance - 100 - this.size;
            this.y += distance - 100 - this.size;
            this.velX *= -1;
            this.velY *= -1;
        }
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
}, false);


function loop() {
    ctx.fillStyle = '#C2EFEF';
    ctx.fillRect(0, 0, width, height);

    count = 0;
    while (balls.length < ballDefinition.length) {
        let ball = new Ball(ballDefinition[count].color);
        balls.push(ball);
        count++;
    }

    for (i = 0; i < balls.length; i++) {
        balls[i].detectCollisionWithMouseBubble();
        balls[i].collisionDetect();
        balls[i].draw();
        balls[i].update();
    }

    requestAnimationFrame(loop);
}

(function () {
    var canvas = document.querySelector('canvas')
    // context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
        loop();
    }
    resizeCanvas();

    loop();

})();

