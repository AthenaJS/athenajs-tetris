import { Behavior, InputManager as IM, AudioManager as AM } from 'athenajs';
import { TILE_HEIGHT } from './grid';

const HORIZONTAL_MOVE_DURATION = 80;
const DOWN = 1,
    LEFT = 2,
    RIGHT = 3;

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
        this.startY = this.sprite.y;
        this.ground = false;
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
            this.startY = sprite.y;
        } else {
            const diff = timestamp - this.startTime;
            if (diff > sprite.data.speed) {
                // timer reached
                this.startTime = timestamp;
                if (sprite.snapTile(0, 1)) {
                    sprite.y = this.startY + TILE_HEIGHT;
                    this.startY = sprite.y;
                } else if (!this.ground) {
                    console.log('ground do nothing');
                    // collision detected but we do not react yet:
                    // we have to wait for another timer to be reached
                    this.ground = true;
                } else if (sprite.movable) {
                    console.log('onCollide');
                    // collision detected and another timer reached
                    this.onCollide();
                }
                return true;
            } else {
                this.moveShapeDown(diff);
            }
        }
        return false;
    }

    onCollide() {
        const sprite = this.sprite;

        sprite.movable = false;
        AM.play('ground');
        sprite.notify('ground', {
            startLine: sprite.getStartLine(),
            numRows: sprite.shape.height / sprite.currentMap.tileHeight
        });
    }

    moveShapeDown(duration, force) {
        const sprite = this.sprite;
        const pixels = (duration * TILE_HEIGHT) / sprite.data.speed;
        // console.log('moveShapeDown', pixels);
        if (sprite.snapTile(0, 1)) {
            if (force) {
                // FIXME: don't go too far, snap tile only tests one px below
                this.startY += 4;
                sprite.y += 4;
            } else {
                sprite.y = this.startY + pixels;
            }
        } else {
            this.ground = true;
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


        if (this.timerEnabled) {
            this.timer(timestamp);
        }

        if (this.key === LEFT && !IM.isKeyDown('LEFT')) {
            console.log('left released');
            // moveTo
            this.key = 0;
        } else if (this.key === RIGHT && !IM.isKeyDown('RIGHT')) {
            console.log('right released');
            this.key = 0;
            // moveTo
        }

        if (IM.isKeyDown('DOWN') && !this.ground) {
            // this.checkKeyDelay(1, timestamp, 0, 1);
            console.log('down');
            this.moveShapeDown(0, true);
        } else if (IM.isKeyDown('LEFT')) {
            // cancelMoveTo
            this.key = LEFT;
            sprite.snapTile2(-3, 0);
            // this.checkKeyDelay(2, timestamp, -1, 0);
        } else if (IM.isKeyDown('RIGHT')) {
            // cancelMoveTo            
            this.key = RIGHT;
            sprite.snapTile2(3, 0);
            // this.checkKeyDelay(3, timestamp, 1, 0);
        } else if ((IM.isKeyDown('UP') || IM.isKeyDown('SPACE')) && (timestamp - this.lastRotation > 150)) {
            this.lastRotation = timestamp;
            sprite.nextRotation();
        } else {
            // key released

        }
    }
}

export default ShapeBehavior;