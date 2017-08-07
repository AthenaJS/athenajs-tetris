import { Sprite, Tile } from 'athenajs';
import ShapeBehavior from 'shape_behavior';

export default class Shape extends Sprite {
    constructor(name, options = {}) {
        super('shape', Object.assign({}, {
            imageSrc: 'tiles',
            easing: 'linear',
            behavior: ShapeBehavior
        }, options));

        /**
         * Hardcoded tetris shapes. In addition to its width/height, color and
         * name, each shape contains a rotation a matrix for each rotation
         * that looks like:
         * 
         *  ---
         * |J
         * |JJJ
         * |
         *  ---
         * 
         * Matrix: [1, 0, 0,
         *          1, 1, 1
         *          0, 0, 0]
         * 
         * Each shape contains four different rotations
         */
        this.shapes = [
            {
                name: 'I', width: 80, height: 80, color: 7, rotations: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
                ]
            },
            {
                name: 'J', width: 60, height: 60, color: 6, rotations: [
                    [1, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 1, 1, 0]
                ]
            },
            {
                name: 'L', width: 60, height: 60, color: 5, rotations: [
                    [0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'O', width: 80, height: 60, color: 4, rotations: [
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0]
                ]
            },
            {
                name: 'S', width: 60, height: 60, color: 3, rotations: [
                    [0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 0, 1, 1, 1, 1, 0],
                    [1, 0, 0, 1, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'Z', width: 60, height: 60, color: 2, rotations: [
                    [1, 1, 0, 0, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 1, 0, 1, 1, 0, 1, 0, 0]
                ]
            },
            {
                name: 'T', width: 60, height: 60, color: 1, rotations: [
                    [0, 1, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 1, 0],
                    [0, 1, 0, 1, 1, 0, 0, 1, 0]
                ]
            }
        ];

        this.addAnimations();
        this.setShape('S', 0);
    }

    /**
     * Moves the shape at the top center of the map
     */
    moveToTop() {
        const map = this.currentMap,
            col = Math.floor(((map.width - this.shape.width) / 2) / map.tileWidth);

        this.moveTo(col * map.tileWidth, 0);
    }

    /**
     * Changes the sprite's shape and rotation
     * 
     * @param {String} name the name of the shape
     * @param {Number} rotation the rotation number
     */
    setShape(name, rotation) {
        this.shapeName = name;
        this.rotation = rotation;
        this.shape = this.shapes.find((shape) => shape.name === this.shapeName);
        this.setAnimation(`${name}${rotation}`);
    }

    /**
     * Pick a new random shape
     */
    setRandomShape() {
        const shapeName = this.shapes[Math.random() * 7 | 0].name,
            rotation = Math.random() * 4 | 0;

        this.setShape(shapeName, rotation);
    }

    /**
     * Returns current matrix for the shape
     * 
     * @param {Number} rotation rotation number: set to -1 to return current rotation
     * or any number to get the matrix for this particular rotation
     * 
     * @returns {Array} the matrix
     */
    getMatrix(rotation = -1) {
        return this.shape.rotations[rotation === -1 ? this.rotation : rotation];
    }

    /**
     * Move the shape on the map by a certain number of tiles
     * 
     * @param {Number} horizontal horizontal number of tiles to shift
     * @param {Number} vertical vertical number of tiles to move
     */
    snapTile(horizontal = 0, vertical = 0) {
        const map = this.currentMap,
            buffer = this.getMatrix(),
            tilePos = map.getTileIndexFromPixel(this.x, this.y),
            newX = tilePos.x + horizontal,
            newY = tilePos.y + vertical;

        // first check there is no collision with walls
        if (!map.checkMatrixForCollision(buffer, this.shape.width, newX, newY, Tile.TYPE.WALL)) {
            this.x += horizontal * map.tileWidth;
            this.y += vertical * map.tileHeight;
            return true;
        } else {
            // if a collision was detected and vertical == 1 it means the shape reached
            // the ground: in this case we send a notification for the grid
            // and make the shape stop responding to user input or timer
            if (vertical === 1) {
                this.movable = false;
                this.notify('ground', {
                    startLine: tilePos.y,
                    numRows: this.shape.height / map.tileHeight
                });
            }
            return false;
        }
    }

    /**
     * Switches to the next shape's rotation, if no collision found onto the map
     */
    nextRotation() {
        let matrix = null,
            newRotation = this.rotation + 1;

        const map = this.currentMap,
            tilePos = map.getTileIndexFromPixel(this.x, this.y);

        // cycles if last position reached
        if (newRotation > 3) {
            newRotation = 0;
        }

        // get current shape + position matrix
        matrix = this.getMatrix(newRotation);

        if (!map.checkMatrixForCollision(matrix, this.shape.width, tilePos.x, tilePos.y, Tile.TYPE.WALL)) {
            // change shape rotation if no collision detected
            this.setShape(this.shapeName, newRotation);
        } else {
            console.log('rotation not possible');
        }
    }

    /**
     * We add a new Sprite animation for each combination of rotation + shapeType:
     * {
     *  'J0', // first rotation of the J Shape
     * ....
     *  'J3', // last rotation of the J Shape
     *  'L0', // first rotation of the L shape
     *  ...
     * }
     */
    addAnimations() {
        // shape sprite images start at the top of the image file
        let offsetY = 0;

        this.shapes.forEach((shape) => {
            let offsetX = 0;
            for (let i = 0; i < 4; ++i) {
                this.addAnimation(`${shape.name}${i}`, 'img/tetris_tiles.png', {
                    offsetY: offsetY, offsetX: offsetX, frameWidth: shape.width, frameHeight: shape.height, frameDuration: 1, numFrames: 1
                });
                offsetX += shape.width;
            }
            offsetY += shape.height;
        });
    }
}