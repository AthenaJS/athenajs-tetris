import { Behavior, Tile, InputManager as IM, AudioManager as AM } from 'athenajs';
import { cpus } from 'os';

/**
 * Simple Behavior for the tetris shape that moves the shape on cursor key press
 * and when timer is reached
 *
 *
 * @see {Behavior}
 */
class ShapeBehavior extends Behavior {
    constructor(sprite, options) {
        super(sprite, options);

        // current behavior state: moving down === 1, left === 2, right === 3
        this.state = 0;
        // when lastRotation happened
        this.lastRotation = 0;
        this.ts = 0;
        // long delay before starting to move quickly
        this.LONG_DELAY = 250;
        // repeat-delay once the long delay has been reached
        this.SMALL_DELAY = 70;

        this.xToMove = 0;

        this.reset();
    }

    reset() {
        IM.clearEvents();

        // current delay before repeating a key
        this.delay = this.LONG_DELAY;
        this.key = 0;
        this.timerEnabled = true;
        this.startTime = 0;
        this.ground = false;
    }

    /**
     * When the player keeps a key down, we wait for a long delay before
     * quickly moving the piece: we don't want to miss-interpret his move.
     *
     * If he quickly releases the key and quickly presses it, we have to
     * react though
     *
     * @param {Number} state the new state (key) pressed
     * @param {Number} timestamp current timestamp
     *
     * @returns {Boolean} true if we should to react to the action
     */
    ready(state, timestamp) {
        // if the player pressed a different key
        // we react immediately but have to wait a long_delay
        // before repeating the key if he keeps pressing it
        if (this.state !== state) {
            this.ts = timestamp;
            this.state = state;
            this.delay = this.LONG_DELAY;
            return true;
        } else if (timestamp - this.ts > this.delay) {
            // player keeps pressing the key for a long delay
            // we react and set delay to a smaller one to quickly
            // repeat the action
            this.ts = timestamp;
            this.delay = this.SMALL_DELAY;
            return true;
        } else {
            // repeat delay not reached
            return false;
        }
    }

    /**
     * Checks tetris timer
     *
     * @param {Number} timestamp current update timestamp
     *
     * @returns {Boolean} true if timer was reached
     */
    timer(timestamp) {
        const sprite = this.sprite;
        if (!this.startTime) {
            this.startTime = timestamp;
        } else {
            if (timestamp - this.startTime > sprite.data.speed) {
                // timer reached
                this.startTime = 0;
                return true;
            }
        }
        return false;
    }

    checkKeyDelay(key, timestamp, x, y) {
        if (this.ready(key, timestamp)) {
            this.sprite.snapTile(x, y) && AM.play('move');
        }
    }

    /**
     * This method is called when updating the shape's position
     * and updates its position when cursor keys are pressed or
     * the timer happened
     */
    onUpdate(timestamp) {
        const sprite = this.sprite;

        // debug: stop the timer when t key is pressed
        if (IM.isKeyDown(84)) {
            this.timerEnabled = !this.timerEnabled;
            return;
        }

        // first check timer
        if (this.timerEnabled/* && this.timer(timestamp)*/) {
            // timer reached: move the sprite down
            if (!this.ground) {
                // console.log('moving down');
                this.ground = !sprite.snapTile(0, 1);
                if (this.ground) {
                    console.log('ground', this.ground);
                }
            } else if (this.timer(timestamp)) {
                console.log('timer');
                AM.play('ground');
                sprite.notify('ground', {
                    startLine: sprite.getStartLine(),
                    numRows: sprite.shape.height / sprite.currentMap.tileHeight
                });
            }
        }

        // Then checks cursor keys
        if (IM.isKeyDown('DOWN')) {
            // this.checkKeyDelay(1, timestamp, 0, 1);
            console.log('down');
            if (!this.ground) {
                sprite.snapTile(0, 2);
            }
        } else if (IM.isKeyDown('LEFT') && !this.moving) {
            console.log('snapTile');
            sprite.snapTile2(-1);
            // this.checkKeyDelay(2, timestamp, -1, 0);
        } else if (IM.isKeyDown('RIGHT') && !this.moving) {
            sprite.snapTile2(1);
            // this.checkKeyDelay(3, timestamp, 1, 0);
        } else if ((IM.isKeyDown('UP') || IM.isKeyDown('SPACE')) && (timestamp - this.lastRotation > 150)) {
            this.lastRotation = timestamp;
            sprite.nextRotation();
        } else if (this.state) {
            // key released
            this.ready(0, timestamp);
        }
    }
}

export default ShapeBehavior;