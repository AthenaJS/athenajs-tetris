import { Game, Map } from 'athenajs';
import Shape from 'shape';
import Grid from 'grid';

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