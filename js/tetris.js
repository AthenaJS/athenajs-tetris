import { Circle, Game, Scene, Map, Sprite } from 'athenajs';

class Tetris extends Game {
    constructor() {
        super({
            name: 'athena-tetris',
            showFps: true,
            width: 800,
            height: 600
        });

        this.createScene();
    }

    createMap() {
        return new Map({
            src: 'tiles',
            tileWidth: 32,
            tileHeight: 32,
            width: 200,
            height: 400,
            buffer: new ArrayBuffer(200 * 400 * 2)
        });
    }

    createScene() {
        const scene = new Grid();
        scene.onStart(function () {
            const shape = new Shape('shape', {
                x: 0,
                y: 0
            });
            debugger;
            this.addObject(shape);
        });
        this.setScene(scene); 
    }
};

class Grid extends Scene {
    constructor() {
        super({
            ressources: [{
                id: 'tiles',
                type: 'image',
                src: 'img/tetris_tiles.png'
            }]
        });
    }

    onLoad() {
        this.rotate = 0;
        this.score = 0;

        this.shape = null;
        this.nextShape = null;
    }

    startGame() {
        this.score = 0;
    }
}

class Shape extends Sprite {
    constructor() {
        super('shape', {
            imageSrc: 'tiles'
        });

        this.addAnimations();
    }

    setShape(name, rotation) {
        this.setAnimation(`${name}${rotation}`);
    }

    addAnimations() {
        const sprites = [
            {
                name: 'I', width: 80, height: 80, rotations: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
                ]
            }/*,
            {
                name: 'J', width: 60, height: 60, rotations: [
                    [1, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 1, 1, 1]
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
                name: 'T', width: 60, height: 60, rotations: [
                    [1, 1, 0, 0, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 1, 0, 1, 1, 0, 1, 0, 0]
                ]
            },
            {
                name: 'Z', width: 60, height: 60, rotations: [
                    [0, 1, 0, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 1, 1, 0, 1, 0],
                    [0, 0, 0, 1, 1, 1, 0, 1, 0],
                    [0, 1, 0, 1, 1, 0, 0, 1, 0]
                ]
            }*/
        ];

        let offsetY = 0;

        sprites.forEach((shape) => {
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
const tetris = new Tetris();

// tetris.setScene(scene);