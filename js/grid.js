import { Scene, Map, Tile } from 'athenajs';
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

        this.score = 0;
        this.level = 0;
        this.timing = 1200;
        this.scoreTable = [
            40,
            100,
            300,
            1200
        ]
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

            for (let i = 0; i < map.numRows; ++i) {
                map.updateTile(0, i, 0, Tile.TYPE.WALL);
                map.updateTile(map.numCols - 1, i, 0, Tile.TYPE.WALL);
            }

            map.addTileSet([{
                offsetX: 140,
                offsetY: 440,
                width: 20,
                height: 20
            }, {
                offsetX: 120,
                offsetY: 440,
                width: 20,
                height: 20
            }]);

            for (var i = 0; i < 20; ++i) {
                map.updateTile(Math.random() * 10 | 0 + 1, Math.random() * 18 | 0 + 3, 1, 2)
            }

            return map;
        } catch (err) {
            debugger;
        }
    }

    createShape() {
        return new Shape('shape', {
            x: 20,
            y: 0,
            data: {
                speed: 800
            }
        });
    }

    onLoad() {
        this.shape = this.createShape();
        this.nextShape = null;

        this.setMap(this.createMap(), 300, 100);
        this.setBackgroundImage('img/background.png');

        this.map.addObject(this.shape);
    }

    onEvent(event, data) {
        switch (event) {
            case 'line_drop':
                this.removeLinesFromMap(data.startLine, data.height);
                this.increaseScore(data.height);
                break;
        }
    }

    increaseScore(lines) {
        this.score += this.scorteTable[lines - 1] * this.level;
        // TODO: update score element?
    }

    removeLinesFromMap(startLine, height) {
        const map = this.map;

        map.shift(startLine, height);

        // add wall at each side of the new lines
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < map.numCols; ++j) {
                map.updateTile(j, i, 0, Tile.TYPE.AIR);
            }
            map.updateTile(0, i, 0, Tile.TYPE.WALL);
            map.updateTile(map.numCols - 1, i, 0, Tile.TYPE.WALL);
        }
    }
}