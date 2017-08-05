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
        this.SMALL_DELAY = 100;
        this.delay = this.LONG_DELAY;
        this.key = 0;
    }

    snapToTile() {
        const sprite = this.sprite,
            map = sprite.currentMap;

        if (sprite.x % map.tileWidth) {
            const distance = map.getMaxDistanceToTile(sprite, this.state > 0 ? map.tileWidth : -map.tileWidth, Tile.TYPE.WALL);
            if (distance) {
                sprite.snapToMap(this.state === -1, true);
            }
        }
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

    /**
     * Simple onMove handler that checks for a wall or hole
     * 
     */
    onMove(timestamp) {
        const sprite = this.sprite,
            map = sprite.currentMap,
            buffer = sprite.getShapeMatrix();

        let key = 0;

        if (IM.isKeyDown('DOWN')) {
            key = 1;
        } else if (IM.isKeyDown('LEFT')) {
            console.log('need to move to the left');
            key = 2;
            sprite.vx = -3;
            if (this.ready(-1, timestamp) && !map.checkMatrixForCollision(buffer, sprite.shape.width, sprite.x + sprite.vx, sprite.y, Tile.TYPE.WALL)) {
                sprite.x += sprite.vx;
                this.snapToTile();
            }
        } else if (IM.isKeyDown('RIGHT')) {
            sprite.vx = 3;
            console.log('right');
            key = 3;
            if (this.ready(1, timestamp) && !map.checkMatrixForCollision(buffer, sprite.shape.width, sprite.x + sprite.vx, sprite.y, Tile.TYPE.WALL)) {
                //console.log('increasing', this.longPress, this.diffX, timestamp - this.ts);
                console.log('snap to tile');
                sprite.x += sprite.vx;
                this.snapToTile();
            }
        } else if (IM.isKeyDown('UP') && (timestamp - this.lastRotation > 150)) {
            key = 4;
            // TODO: check that we may rotate first
            sprite.nextRotation();
            this.lastRotation = timestamp;
            sprite.vx = 0;
        } else if (this.state && !key) {
            console.log('key released');
            this.ready(0, timestamp);
        }
    }
}

export default ShapeBehavior;