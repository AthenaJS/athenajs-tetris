import { Game, Map } from 'athenajs';
import Shape from 'shape';

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

const tetris = new Tetris();