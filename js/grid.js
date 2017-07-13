import { Scene, Map } from 'athenajs';

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
                buffer: new ArrayBuffer(200 * 400 * 2)
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

    onLoad() {
        debugger;
        this.rotate = 0;
        this.score = 0;

        this.shape = null;
        this.nextShape = null;

        this.setMap(this.createMap(), 300, 100);
    }

    startGame() {
        this.score = 0;
    }
}