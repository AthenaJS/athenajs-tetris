import { Sprite, Tile, AudioManager as AM } from 'athenajs';
import ShapeBehavior from './shape_behavior';

class Shape extends Sprite {
    constructor(name, options = {}) {
        super(name, Object.assign({}, {
            imageId: 'tiles',
            easing: 'easeOutQuad',
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
                name: 'I', width: 80, height: 80, color: 6, rotations: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
                ]
            },
            {
                name: 'J', width: 60, height: 60, color: 5, rotations: [
                    [1, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 1, 1, 0]
                ]
            },
            {
                name: 'L', width: 60, height: 60, color: 4, rotations: [
                    [0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'O', width: 80, height: 40, color: 3, rotations: [
                    [0, 1, 1, 0, 0, 1, 1, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0]
                ]
            },
            {
                name: 'S', width: 60, height: 60, color: 2, rotations: [
                    [0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 0, 1, 1, 1, 1, 0],
                    [1, 0, 0, 1, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'Z', width: 60, height: 60, color: 1, rotations: [
                    [1, 1, 0, 0, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 1, 0, 1, 1, 0, 1, 0, 0]
                ]
            },
            {
                name: 'T', width: 60, height: 60, color: 0, rotations: [
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

        this.moveTo(col * map.tileWidth, this.getStartY());
        this.movable = true;
        // this.moveTo(5, 0);
        console.log(this, this.x);
    }

    getStartY() {
        const map = this.currentMap;
        const matrix = this.shape.rotations[this.rotation];
        const cols = this.shape.width / map.tileWidth;
        const rows = matrix.length / cols;
        let i = rows,
            found = false;

        while (i >= 0 && !found) {
            i--;
            for (let j = 0; j < cols; ++j) {
                found = found || matrix[i * cols + j];
            }
        }

        return -(i + 1) * map.tileHeight;
    }

    /**
     * Changes the sprite's shape and rotation
     *
     * @param {String} name the name of the shape
     * @param {Number} rotation the rotation number
     */
    setShape(name, rotation, duration = 0) {
        this.shapeName = name;
        this.rotation = rotation;
        this.shape = this.shapes.find((shape) => shape.name === this.shapeName);
        // we only use first animation and rotate the sprite for each rotation
        this.setAnimation(`${name}0`);

        if (duration) {
            console.log(this.angle);
            this.animate('Rotate', {
                startValue: this.angle,
                endValue: !rotation ? Math.PI * 2 : this.rotation * (Math.PI / 2),
                duration: duration,
                easing: 'easeOutQuad'
            }).then(() => {
                if (!rotation) {
                    this.angle = 0;
                }
            });
        } else {
            this.angle = this.rotation * (Math.PI / 2);
        }
    }

    /**
     * Pick a new random shape
     */
    setRandomShape(animate) {
        const shapeName = this.shapes[Math.random() * 7 | 0].name,
            rotation = Math.random() * 4 | 0;
        // const shapeName = 'T',
        //     rotation = 0;

        console.log(`[Shape] setRandomShape() - ${this.type}, ${shapeName}`);

        if (!this.movable) {
            this.animate('Custom', {
                startValue: 1,
                endValue: .3,
                duration: 200,
                easing: 'easeOutQuad',
                callback: val => {
                    this.setScale(val);
                }
            });
            this.animate('Fade', {
                duration: 200,
                startValue: 1,
                endValue: 0
            }).then(() => {
                this.setShape(shapeName, rotation);
                this.animate('Custom', {
                    startValue: 2,
                    endValue: 1,
                    duration: 200,
                    easing: 'easeOutQuad',
                    callback: val => {
                        this.setScale(val);
                    }
                });
                this.animate('Fade', {
                    duration: 200,
                    startValue: 0,
                    endValue: 1
                });
            })
        } else {
            this.setShape(shapeName, rotation);
        }
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
     * Attempts to move the shape of the specified amount of pixels onto the map
     * 
     * @param {number} [horizontal=0]
     * @param {number} [vertical=0]
     * @param {boolean} [testOnly=false] set to true to only perform test
     * 
     * @returns {object} an object containing the number of pixels that the piece moved. eg. {x:5, y:4}
     */
    moveOverGrid(horizontal = 0, vertical = 0, testOnly = false) {
        const map = this.currentMap,
            buffer = this.getMatrix(),
            shapeWidth = this.getCurrentWidth() / map.tileWidth,
            shapeHeight = this.getCurrentHeight() / map.tileWidth,
            nextTilePos = map.getTileIndexFromPixel(this.x + horizontal, this.y + vertical, false),
            startX = Math.floor(nextTilePos.x),
            endX = startX + (Number.isInteger(nextTilePos.x) ? shapeWidth - 1 : shapeWidth),
            startY = Math.floor(nextTilePos.y),
            endY = startY + (Number.isInteger(nextTilePos.y) ? shapeHeight - 1 : shapeHeight);

        let hit = false,
            xDiff = horizontal,
            yDiff = vertical;

        // if (this.id.match(/^shape/) && this.x >= 173) {
        //     debugger;
        // }

        hit = map.checkMatrixForCollision2(buffer, this.shape.width, startX, endX, startY, endY, Tile.TYPE.WALL);


        // if (this.x >= 179)
        //     debugger;
        // console.log('snapTile2', this.x, this.y);
        if (!hit) {
            // console.log('moving to', this.x + (horizontal * map.tileWidth));
            // this.moveTo(this.x + (horizontal * map.tileWidth), vertical, duration);
            // if (this.x >= 160) {
            //     debugger;
            //     map.checkMatrixForCollision2(buffer, this.shape.width, startX, endX, startY, endY, Tile.TYPE.WALL)
            // }
            if (!testOnly) {
                this.x += horizontal;
                this.y += vertical;
            }
            // console.log('movex', this.x);
        } else {
            // use returned tileIndex to get new horizontal: newX = (tilePos * mapNumCols) - 1 - this.currentWidth
            // TODO: align to leftmost (horizontal < 0) or (horizontal > 0) rightmost tile
            if (horizontal) {
                let old = this.x;
                if (!testOnly) {
                    if (horizontal < 0) {
                        this.x = Math.floor(this.x / map.tileWidth) * map.tileWidth;
                    } else {
                        this.x = Math.ceil(this.x / map.tileWidth) * map.tileWidth;
                    }
                }
                xDiff = this.x - old;
            }


            if (vertical) {
                let old = this.y;
                if (!testOnly) {
                    if (vertical < 0) {
                        this.y = Math.floor(this.y / map.tileHeight) * map.tileHeight;
                    } else {
                        this.y = Math.ceil(this.y / map.tileHeight) * map.tileHeight;
                    }
                }
                yDiff = this.y - old;
            }
            // this.x = (hit.i * map.numCols) - this.getCurrentWidth() - 1;
        }

        return { x: xDiff, y: yDiff };
    }

    /**
     * snaps the Shape on a tile, based on current direction
     * 
     * @param {number} [horizontal=0]
     */
    snapToTile(horizontal = 0) {
        const isLeft = horizontal < 0,
            map = this.currentMap,
            pos = map.getTileIndexFromPixel(this.x, this.y, false),
            decimal = pos.x % 1,
            absDecimal = Math.abs(decimal);

        let targetX = 0;

        // so close to a tile that we snap to it
        if (absDecimal && (absDecimal <= 0.1 || absDecimal >= 0.9)) {
            console.log('cas special');
            if (absDecimal <= 0.1) {
                targetX = decimal < 0 ? Math.ceil(pos.x) * map.tileWidth : Math.floor(pos.x) * map.tileWidth;
            } else {
                targetX = decimal < 0 ? Math.floor(pos.x) * map.tileWidth : Math.ceil(pos.x) * map.tileWidth;
            }
            console.log('moving to', this.x, targetX, '(' + pos.x + ', ' + (isLeft ? pos.x | 0 : Math.ceil(pos.x)) + ')');
            this.moveTo(targetX, undefined, 0);
        } else {
            console.log('cas normal');
            targetX = isLeft ? ((pos.x | 0) * map.tileWidth) : Math.ceil(pos.x) * map.tileWidth;
            console.log('moving to', this.x, targetX, '(' + pos.x + ', ' + (isLeft ? pos.x | 0 : Math.ceil(pos.x)) + ')');
            this.moveTo(targetX, undefined, Math.abs(10 * (targetX - this.x)));
        }

        // cas particulier: moveTo direct si fractionnal part >= 95 ou <= 5

    }

    getTilePos() {
        const map = this.currentMap;

        return map.getTileIndexFromPixel(this.x < 0 ? Math.floor(this.x) : Math.ceil(this.x), this.y < 0 ? Math.floor(this.y) : Math.ceil(this.y));
    }

    getStartLine() {
        const tilePos = this.getTilePos();

        return tilePos.y;
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
            this.setShape(this.shapeName, newRotation, 80);
            AM.play('rotate');
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
                this.addAnimation(`${shape.name}${i}`, 'tiles', {
                    offsetY: offsetY, offsetX: offsetX, frameWidth: shape.width, frameHeight: shape.height, frameDuration: 1, numFrames: 1
                });
                offsetX += shape.width + 2;
            }
            offsetY += shape.height + 2;
        });
    }
}

export default Shape;