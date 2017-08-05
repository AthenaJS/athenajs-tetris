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
        this.longPress = false;
        this.LONG_DELAY = 250;
        this.SMALL_DELAY = 80;
        this.delay = this.LONG_DELAY;
        this.key = 0;
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
        if (!this.startTime) {
            this.startTime = timestamp;
        } else {
            if (timestamp - this.startTime > this.sprite.data.speed) {
                // TODO: check collisions
                // next line
                // EVENT ?
                this.sprite.y += this.sprite.currentMap.tileHeight;
                this.startTime = timestamp;
                return true;
            }
        }
        return false;
    }

    snapTile(isLeft) {
        const sprite = this.sprite,
            map = sprite.currentMap,
            buffer = sprite.getShapeMatrix(),
            tilePos = map.getTileIndexFromPixel(sprite.x, sprite.y),
            newX = isLeft ? tilePos.x - 1 : tilePos.x + 1;

        if (!map.checkMatrixForCollision(buffer, sprite.shape.width, newX, tilePos.y, Tile.TYPE.WALL)) {
            sprite.x += isLeft ? -map.tileWidth : map.tileWidth;
        }
    }

    /**
     * Simple onMove handler that checks for a wall or hole
     * 
     */
    onMove(timestamp) {
        const sprite = this.sprite;

        let key = 0;

        // if (this.timer(timestamp)) {
        //     return;
        // }

        if (IM.isKeyDown('DOWN')) {
            key = 1;
        } else if (IM.isKeyDown('LEFT')) {
            console.log('need to move to the left');
            key = 2;

            if (this.ready(-1, timestamp)) {
                this.snapTile(true);
            }
        } else if (IM.isKeyDown('RIGHT')) {
            console.log('right');
            key = 3;
            if (this.ready(-1, timestamp)) {
                this.snapTile(false);
            }
        } else if (IM.isKeyDown('UP') && (timestamp - this.lastRotation > 150)) {
            key = 4;
            // TODO: check that we may rotate first
            this.lastRotation = timestamp;
            sprite.nextRotation();
            sprite.vx = 0;
        } else if (this.state && !key) {
            console.log('key released');
            this.ready(0, timestamp);
        }
    }
}

export default ShapeBehavior;