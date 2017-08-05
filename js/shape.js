import { Sprite } from 'athenajs';
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

    getShapeMatrix() {
        return this.shape.rotations[this.rotation];
    }

    nextRotation() {
        this.rotation++;
        if (this.rotation > 3) {
            this.rotation = 0;
        }
        this.setShape(this.shapeName, this.rotation);
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