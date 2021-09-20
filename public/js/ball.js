const startSpeed = 7;
const speedIncrement = .1;
const ballSize = 20;

/**
 * The ball that bounces back and forth
 */
class Ball {
    constructor(id, x, y) {
        this.id = id;
        this.startX = x;
        this.startY = y;
        this.width = ballSize;
        this.height = ballSize;
        this.radius = ballSize / 2;
        this.color = 'white';
        this.resetPosition();
    }

    static #generateStartAngleRad() {
        let angleDeg = -45 + Math.floor(Math.random() * 90);
        if (Math.random() < 0.5) {
            angleDeg += 180;
        }
        return angleDeg * (Math.PI/180);
    }

    resetPosition() {
        this.x = this.startX;
        this.y = this.startY;
        this.speed = startSpeed;
        let angle = Ball.#generateStartAngleRad();
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;
    }

    #move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    #isColliding(paddle) {
        paddle.top = paddle.y;
        paddle.right = paddle.x + paddle.width;
        paddle.bottom = paddle.y + paddle.height;
        paddle.left = paddle.x;

        this.top = this.y;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
        this.left = this.x;

        return this.left < paddle.right
            && this.top < paddle.bottom
            && this.right > paddle.left
            && this.bottom > paddle.top;
    }

    #checkForPaddleBounces(paddle) {
        if (this.#isColliding(paddle, ball)) {
            // bounce towards the opponent
            this.velocityX = Math.abs(this.velocityX + speedIncrement) * (this.x < paddle.x ? -1 : 1);

            // ball curving (changes the y velocity by moving the paddle while hitting it)
            const damping = 6;
            this.velocityY -= paddle.up * moveSpeed / damping;
            this.velocityY += paddle.down * moveSpeed / damping;
        }
    }

    #checkForWallBounces() {
        // bounce top and bottom walls
        if (this.y + this.height >= app.height || this.y <= 0) {
            this.velocityY = -this.velocityY;
        }

        // right side
        if (this.x > app.width) {
            app.getNode('player1').addScore();
            app.restartMatch();
        }
        // left side
        else if (this.x + this.width < 0) {
            app.getNode('player2').addScore();
            app.restartMatch();
        }
    }

    update(time) {
        this.#move();
        this.#checkForPaddleBounces(app.getNode('player1'));
        this.#checkForPaddleBounces(app.getNode('player2'));
        this.#checkForWallBounces();
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

