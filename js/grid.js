import { Scene, Map } from 'athenajs';
import Shape from 'shape';

export default class Grid extends Scene {
    constructor() {
        super({
            resources: [{
                id: 'tiles',
                type: 'image',
                src: 'img/tetris_tiles.png'
            }]
        });
    }

    createMap() {
        try {
            const map = new Map({
                src: 'tiles',
                tileWidth: 20,
                tileHeight: 20,
                width: 240,
                height: 420,
                buffer: new ArrayBuffer(12 * 21 * 2)
            });

            map.addTileSet([{
                offsetX: 140,
                offsetY: 440,
                width: 20,
                height: 20
            }]);

            return map;
        } catch (err) {
            debugger;
        }
    }

    createShape() {
        return new Shape('shape', {
            x: 0,
            y: 0
        });
    }

    onLoad() {
        this.rotate = 0;
        this.score = 0;

        this.shape = this.createShape();
        this.nextShape = null;

        this.setMap(this.createMap(), 300, 100);
        this.setBackgroundImage('img/background.png');

        this.map.addObject(this.shape);
    }

    startGame() {
        this.score = 0;
    }
}