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

        // behavior properties can be defined here
        this.state = 0;        
    }

    /**
     * Simple onMove handler that checks for a wall or hole
     * 
     */
    onMove(timestamp) {
        const sprite = this.sprite,
            map = sprite.currentMap;
        
        if (IM.isKeyDown('LEFT')) {
            console.log('need to move to the left');
            sprite.vx = map.getMaxDistanceToTile(sprite, -3, Tile.TYPE.WALL);
            sprite.cancelMoveTo();

            this.state = -1;
        } else if (IM.isKeyDown('RIGHT')) {
            console.log('need to move to the right');
            sprite.vx = map.getMaxDistanceToTile(sprite, 3, Tile.TYPE.WALL);
            sprite.cancelMoveTo();

            this.state = 1;
        } else if (this.state) {
            sprite.vx = 0;

            this.state = 0;

            // TODO: snap to left/right tile
        }

        sprite.x += sprite.vx;
    }
}

export default ShapeBehavior;