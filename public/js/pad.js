const moveSpeed = 4;
const padWidth = 20;
const padHeight = 100;

/**
 * A pad is a player-controlled node for bouncing the ball
 */
class Pad {
    constructor(id, x, y, upKey, downKey) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = padWidth;
        this.height = padHeight;
        this.color = 'black';
        this.upKey = upKey;
        this.downKey = downKey;
        this.up = false;
        this.down = false;

        this.#addKeyBindings();
    }

    #addKeyBindings() {
        window.addEventListener("keydown", event => this.#keyboardEvent(event));
        window.addEventListener("keyup", event => this.#keyboardEvent(event));
    }

    #keyboardEvent(event) {
        if (event.type === "keydown") {
            if (event.key === this.upKey) {
                this.up = true;
            } else if (event.key === this.downKey) {
                this.down = true;
            }
        } else if (event.type === "keyup") {
            if (event.key === this.upKey) {
                this.up = false;
            } else if (event.key === this.downKey) {
                this.down = false;
            }
        }
    }

    #move() {
        if (this.up) {
            this.y -= moveSpeed;
        }
        if (this.down) {
            this.y += moveSpeed;
        }
    }

    #clamp() {
        let min = 0;
        let max = app.height - this.height;
        this.y = Math.min(Math.max(this.y, min), max);
    }

    update(time) {
        this.#move();
        this.#clamp();
    }
}

