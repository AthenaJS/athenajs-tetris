import { Behavior, Tile, InputManager as IM } from 'athenajs';

/*jshint devel: true, bitwise: false*/
// by default
/**
 * GroundMove is a simple behavior that causes an object to move along the horizontal
 * axis until a wall or tetris piece is detected
 * 
 * @param {Sprite} sprite The sprite to attach the behavior to.
 * @param {InputManager} Input A reference to the InputManager.
 * @param {Object} options General behavior & GroundMove specific options
 * @param {String} [options.direction="right"] The initial direction of the move, default = `right`.
 * 
 * @see {Behavior}
 */
class ShapeBehavior extends Behavior {
    constructor(sprite, Input, options) {
        super(sprite, Input, options);

        // current behavior state: moving right, left, top, bottom
        this.state = 0;
        // when lastRotation happened
        this.lastRotation = 0;
        this.ts = 0;
        this.LONG_DELAY = 250;
        this.SMALL_DELAY = 80;
        this.delay = this.LONG_DELAY;
        this.key = 0;
        this.timerEnabled = true;
    }

    ready(state, timestamp) {
        if (this.state !== state) {
            this.ts = timestamp;
            this.state = state;
            this.delay = this.LONG_DELAY;
            return true;
        } else if (timestamp - this.ts > this.delay) {
            this.ts = timestamp;
            this.delay = this.SMALL_DELAY;
            return true;
        } else {
            return false;
        }
    }

    timer(timestamp) {
        const sprite = this.sprite;
        if (!this.startTime) {
            this.startTime = timestamp;
        } else {
            if (timestamp - this.startTime > sprite.data.speed) {
                if (!sprite.snapTile(0, 1)) {

                }

                this.startTime = timestamp;
                return true;
            }
        }
        return false;
    }

    /**
     * Simple onMove handler that checks for a wall or hole
     * 
     */
    onMove(timestamp) {
        const sprite = this.sprite;

        let key = 0;

        if (IM.isKeyDown(84)) {
            this.timerEnabled = !this.timerEnabled;
            return;
        }

        // do not allow any other move if timer reached
        if (this.timerEnabled && this.timer(timestamp)) {
            return;
        }

        if (IM.isKeyDown('DOWN')) {
            key = 1;
            if (this.ready(key, timestamp)) {
                sprite.snapTile(0, 1);
            }
        } else if (IM.isKeyDown('LEFT')) {
            console.log('need to move to the left');
            key = 2;

            if (this.ready(key, timestamp)) {
                sprite.snapTile(-1);
            }
        } else if (IM.isKeyDown('RIGHT')) {
            console.log('right');
            key = 3;
            if (this.ready(key, timestamp)) {
                sprite.snapTile(1);
            }
        } else if (IM.isKeyDown('UP') && (timestamp - this.lastRotation > 150)) {
            key = 4;
            // TODO: check that we may rotate first
            this.lastRotation = timestamp;
            sprite.nextRotation();
            sprite.vx = 0;
        } else if (this.state && !key) {
            console.log('key released');
            this.ready(key, timestamp);
        }
    }
}

export default ShapeBehavior;