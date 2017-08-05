import { Sprite, Tile } from 'athenajs';
import ShapeBehavior from 'shape_behavior';

export default class Shape extends Sprite {
    constructor(name, options = {}) {
        super('shape', Object.assign({}, {
            imageSrc: 'tiles',
            easing: 'linear',
            behavior: ShapeBehavior
        }, options));

        this.shapes = [
            {
                name: 'I', width: 80, height: 80, rotations: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
                ]
            },
            {
                name: 'J', width: 60, height: 60, rotations: [
                    [1, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 1, 1, 0]
                ]
            },
            {
                name: 'L', width: 60, height: 60, rotations: [
                    [0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'O', width: 80, height: 60, rotations: [
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0]
                ]
            },
            {
                name: 'S', width: 60, height: 60, rotations: [
                    [0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 0, 1, 1, 1, 1, 0],
                    [1, 0, 0, 1, 1, 0, 0, 1, 0]
                ]
            },
            {
                name: 'Z', width: 60, height: 60, rotations: [
                    [1, 1, 0, 0, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 1, 0, 1, 1, 0, 1, 0, 0]
                ]
            },
            {
                name: 'T', width: 60, height: 60, rotations: [
                    [0, 1, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 1, 0],
                    [0, 1, 0, 1, 1, 0, 0, 1, 0]
                ]
            }
        ];

        this.addAnimations();
        this.setShape('J', 0);
    }

    setShape(name, rotation) {
        this.shapeName = name;
        this.rotation = rotation;
        this.shape = this.shapes.find((shape) => shape.name === this.shapeName);
        this.setAnimation(`${name}${rotation}`);
    }

    getShapeMatrix(rotation = -1) {
        return this.shape.rotations[rotation === -1 ? this.rotation : rotation];
    }

    snapTile(horizontal = 0, vertical = 0) {
        const map = this.currentMap,
            buffer = this.getShapeMatrix(),
            tilePos = map.getTileIndexFromPixel(this.x, this.y),
            newX = tilePos.x + horizontal,
            newY = tilePos.y + vertical;

        if (!map.checkMatrixForCollision(buffer, this.shape.width, newX, newY, Tile.TYPE.WALL)) {
            this.x += horizontal * map.tileWidth;
            this.y += vertical * map.tileHeight;
            return true;
        } else {
            return false;
        }
    }

    nextRotation() {
        let matrix = null,
            newRotation = this.rotation + 1;
        const map = this.currentMap,
            tilePos = map.getTileIndexFromPixel(this.x, this.y);

        if (newRotation > 3) {
            newRotation = 0;
        }

        matrix = this.getShapeMatrix(newRotation);

        // TODO: test me with screen borders !
        if (!map.checkMatrixForCollision(matrix, this.shape.width, tilePos.x, tilePos.y, Tile.TYPE.WALL)) {
            this.setShape(this.shapeName, newRotation);
        } else {
            console.log('rotation not possible');
        }
    }

    addAnimations() {
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