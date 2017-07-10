import { Circle, Game, Scene, Map } from 'athenajs';

class Tetris extends Game {
    constructor() {
        super({
            name: 'athena-tetris',
            showFps: true,
            width: 800,
            height: 600
        });
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
        this.scene = new Grid();
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
            { name: 'I', width: 80, height: 80 },
            { name: 'L', width: 60, height: 60 },
            { name: 'LF', width: 60, height: 60 },
            { name: 'S', width: 80, height: 60 },
            { name: 'Z', width: 60, height: 60 },
            { name: 'ZF', width: 60, height: 60 },
            { name: 'T', width: 60, height: 60 }
        ];

        let offsetY = 0;

        sprites.forEach((shape) => {
            let offsetX = 0;
            for (let i = 0; i < 4; ++i) {
                this.addAnimation(`${shape.name}${i}`, 'img/tetris_tiles.png', {
                    offsetY: offset, offsetX: offsetX, frameWidth: shape.width, frameHeight: shape.height, frameDuration: 1, numFrames: 1
                });
                offsetX += shape.width;
            }
            offsetY += shape.height;
        });
    }
}

tetris.setScene(scene);

scene.onStart(function () {
    const shape = new Shape();
});