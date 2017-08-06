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
        ];

        this.bindEvents('shape:ground');
    }

    createMap() {
        try {
            const map = new Map({
                src: 'tiles',
                tileWidth: 20,
                tileHeight: 20,
                width: 240,
                height: 440,
                buffer: new ArrayBuffer(12 * 22 * 2)
            });

            for (let i = 0; i < map.numRows; ++i) {
                map.updateTile(0, i, 0, Tile.TYPE.WALL);
                map.updateTile(map.numCols - 1, i, 0, Tile.TYPE.WALL);
            }

            for (let i = 0; i < map.numCols; ++i) {
                map.updateTile(i, map.numRows - 1, 0, Tile.TYPE.WALL);
            }

            const tiles = [{
                offsetX: 140,
                offsetY: 440,
                width: 20,
                height: 20
            }];

            for (let i = 0, offset = 0; i < 7; ++i, offset += 20) {
                tiles.push(
                    {
                        offsetX: offset,
                        offsetY: 440,
                        width: 20,
                        height: 20
                    }
                );
            }

            map.addTileSet(tiles);

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

    onEvent(event) {
        switch (event.type) {
            case 'line_drop':
                this.removeLinesFromMap(data.startLine, data.height);
                this.increaseScore(data.height);
                break;

            case 'shape:ground':
                debugger;
                // update the map with the new shape
                this.updateMap();
                // check for lines to remove
                const lines = this.getLinesToRemove(event.data.startLine, event.data.numRows);
                if (lines) {

                }
                // set new shape from next shape
                // position shape on top / center of playground
                // increase score ?
                // set new next shape
                // set shape to movable
                console.log('ground', event.data);
                break;
        }
    }

    updateMap() {
        const shape = this.shape,
            data = this.shape.shape,
            map = this.map,
            pos = map.getTileIndexFromPixel(shape.x, shape.y),
            buffer = shape.getMatrix(),
            rows = data.height / map.tileHeight,
            cols = data.width / map.tileWidth;

        for (let j = 0; j < rows; ++j) {
            for (let i = 0; i < cols; ++i) {
                if (buffer[j * cols + i]) {
                    map.updateTile(pos.x + i, pos.y + j, data.color, Tile.TYPE.WALL);
                }
            }
        }
    }

    getLinesToRemove(startLine, height) {
        console.log('getting lines to remove');
        const map = this.map;
        let lines = [];

        for (let j = startLine + height - 1; j >= startLine; --j) {
            let hole = false;
            for (let i = 1; i < map.numCols - 1; ++i) {
                console.log(map.getTileBehaviorAtIndex(i, j), Tile.TYPE.WALL);
                hole = hole || map.getTileBehaviorAtIndex(i, j) !== Tile.TYPE.WALL;
            }
            if (!hole) {
                lines.push(j);
            }
        }

        return lines;
    }

    increaseScore(lines) {
        this.score += this.scorteTable[lines - 1] * this.level;
        // TODO: update score element?
    }

    removeLinesFromMap(startLine, height) {
        const map = this.map;

        // TODO: forEach... for each line
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