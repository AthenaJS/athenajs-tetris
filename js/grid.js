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
                width: 200,
                height: 400,
                buffer: new ArrayBuffer(10 * 20 * 2)
            });

            map.setTiles([{
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
        debugger;
        this.rotate = 0;
        this.score = 0;

        debugger;
        this.shape = this.createShape();
        this.nextShape = null;

        this.setMap(this.createMap(), 300, 100);

        this.map.addObject(this.shape);
    }

    startGame() {
        this.score = 0;
    }
}