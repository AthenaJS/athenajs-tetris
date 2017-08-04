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

        // current behavior state
        this.state = 0;
        // when lastRotation happened
        this.lastRotation = 0;
    }

    /**
     * Simple onMove handler that checks for a wall or hole
     * 
     */
    onMove(timestamp) {
        const sprite = this.sprite,
            map = sprite.currentMap;

        if (IM.isKeyDown('DOWN')) {

        } else if (IM.isKeyDown('LEFT')) {
            console.log('need to move to the left');
            // sprite.vx = map.getMaxDistanceToTile(sprite, -3, Tile.TYPE.WALL);
            // sprite.cancelMoveTo();
            // 1. can we move in this direction?
            const buffer = sprite.getShapeMatrix();

            if (!map.checkMatrixForCollision(buffer, sprite.shape.width, sprite.x - map.tileWidth, sprite.y, Tile.TYPE.WALL)) {
                const pos = map.getTilePos(sprite.x - map.tileWidth, sprite.y);
                sprite.moveTo(pos.x * map.tileWidth, pos.y * map.tileHeight, 130);
            }
        } else if (IM.isKeyDown('RIGHT')) {
            const buffer = sprite.getShapeMatrix();
            console.log('need to move to the right');
            if (!map.checkMatrixForCollision(buffer, sprite.shape.width, sprite.x + map.tileWidth, sprite.y, Tile.TYPE.WALL)) {
                const pos = map.getTilePos(sprite.x + map.tileWidth, sprite.y);
                sprite.moveTo(pos.x * map.tileWidth, pos.y * map.tileHeight, 130);
            }
        } else if (IM.isKeyDown('UP') && (timestamp - this.lastRotation > 150)) {
            // TODO: check that we may rotate first
            sprite.nextRotation();
            // since onMove method is called every 15ms and the player most likely doesn't want to rotate
            // the shape at this rate, we save time when last rotation happened
            this.lastRotation = timestamp;
        } else if (this.state) {
            sprite.vx = 0;

            this.state = 0;
        }
    }
}

export default ShapeBehavior;