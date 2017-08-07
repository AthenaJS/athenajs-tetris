import { Scene, Map, Tile } from 'athenajs';
import Shape from 'shape';

// size constants
const MAP_ROWS = 22,
    MAP_COLS = 12,
    TILE_WIDTH = 20,
    TILE_HEIGHT = 20,
    MAP_TILES_OFFSET_Y = 440,
    WALL_TILE_OFFSET_X = 140,
    WALL_TILE = 8,
    TOTAL_WIDTH = 800,
    TOTAL_HEIGHT = 600;

export default class Grid extends Scene {
    constructor() {
        super({
            resources: [{
                id: 'tiles',
                type: 'image',
                src: 'img/tetris_tiles.png'
            }]
        });

        // here we keep game-related properties
        this.score = 0;
        this.level = 0;
        this.timing = 1200;
        this.scoreTable = [
            40,
            100,
            300,
            1200
        ];

        // we only need to catch the 'ground' event from the 'shape' element
        this.bindEvents('shape:ground');
    }

    /**
     * Generate tileset for the tetris map, mostly hardcoded stuff
     * 
     * @returns {Array} The tileset for the map
     */
    generateTileSet() {
        // create the list of all tiles for the map
        const tiles = [{
            offsetX: WALL_TILE_OFFSET_X,
            offsetY: MAP_TILES_OFFSET_Y,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
        }];

        // add a tile for each color
        for (let i = 0, offset = 0; i < 7; ++i, offset += TILE_WIDTH) {
            tiles.push(
                {
                    offsetX: offset,
                    offsetY: MAP_TILES_OFFSET_Y,
                    width: TILE_WIDTH,
                    height: TILE_HEIGHT
                }
            );
        }

        tiles.push({
            offsetX: 160,
            offsetY: MAP_TILES_OFFSET_Y,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
        });

        return tiles;
    }

    /**
     * Generates the map of the game, adding walls around the playground
     */
    createMap() {
        // first create the map with an empty buffer
        const map = new Map({
            src: 'tiles',
            tileWidth: TILE_WIDTH,
            tileHeight: TILE_WIDTH,
            width: TILE_WIDTH * MAP_COLS,
            height: TILE_HEIGHT * MAP_ROWS,
            buffer: new ArrayBuffer(MAP_COLS * MAP_ROWS * 2)
        });

        // set map tiles around the playground as wall tiles
        for (let i = 0; i < map.numRows; ++i) {
            map.updateTile(0, i, WALL_TILE, Tile.TYPE.WALL);
            map.updateTile(map.numCols - 1, i, WALL_TILE, Tile.TYPE.WALL);
        }

        for (let i = 0; i < map.numCols; ++i) {
            map.updateTile(i, map.numRows - 1, WALL_TILE, Tile.TYPE.WALL);
        }

        // finally add the tileset
        map.addTileSet(this.generateTileSet());

        return map;
    }

    /**
     * Generates the tile sprite that will be moved by the player
     */
    createShape() {
        return new Shape('shape', {
            data: {
                speed: 800
            }
        });
    }

    /**
     * Called when the scene is ready: generates the map and adds the player's shape
     * sprite onto the screen
     */
    onLoad() {
        this.shape = this.createShape();

        this.nextShape = null;

        const map = this.createMap();
        // center map
        this.setMap(map, (TOTAL_WIDTH - map.width) / 2, (TOTAL_HEIGHT - map.height) / 2);
        this.setBackgroundImage('img/background.png');

        this.map.addObject(this.shape);

        this.shape.moveToTop();
        this.shape.setRandomShape();
    }

    /**
     * This method is called whenever an event that has been registered is received
     * 
     * @param {Object} event the event object
     */
    onEvent(event) {
        switch (event.type) {
            case 'shape:ground':
                // update the map with the new shape
                this.updateMap();
                // check for lines to remove
                this.removeLinesFromMap(event.data.startLine, event.data.numRows);
                // TODO: we should change the shape of the "next shape" instead
                this.shape.setRandomShape();
                this.shape.moveToTop();
                // we may have a game over here: if the shape collides with another one
                if (!this.shape.snapTile(0, 0, false)) {
                    alert('game over!');
                } else {
                    this.shape.movable = true;
                }
                // set new next shape
                // set shape to movable
                break;
        }
    }

    /**
     * checks if the shape is at the top of the screen
     */
    isTop() {
        const matrix = this.shape.getMatrix();

    }

    /**
     * This method is called when a shape has reached the ground: in this case
     * we simply update the map using the shape's matrix
     */
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

    /**
     * returns the number of lines that contains no hole, starting from
     * startLine up to startLine + height
     * 
     * @param {Number} startLine the first line to remove
     * @param {Number} height the number of lines to remove
     * 
     * @returns {Array} an array containing the line numbers that are full, sorted
     * from the bottom to the top
     */
    getLinesToRemove(startLine, height) {
        console.log('getting lines to remove');
        const map = this.map;
        let lines = [],
            lastLine = startLine + height - 1;

        // avoid bottom ground
        if (lastLine > map.numRows - 2)
            lastLine = map.numRows - 2;

        for (let j = lastLine; j >= startLine; --j) {
            let hole = false;
            for (let i = 1; i < map.numCols - 1; ++i) {
                hole = hole || map.getTileBehaviorAtIndex(i, j) !== Tile.TYPE.WALL;
            }
            if (!hole) {
                lines.push(j);
            }
        }

        return lines;
    }

    /**
     * Updates the player's score using line number & current level
     * 
     * @param {Number} lines the number of lines that have been removed
     */
    increaseScore(lines) {
        this.score += this.scoreTable[lines - 1] + this.level * this.scoreTable[lines - 1];
        // TODO: update score element?
    }

    /**
     * Removes lines from the map, shifting the map as needed, and adding
     * empty tiles at the top
     * 
     * @param {Number} startLine the first line to remove
     * @param {Number} height the number of lines to remove
     */
    removeLinesFromMap(startLine, height) {
        const map = this.map,
            lines = this.getLinesToRemove(startLine, height);

        // no full lines detected
        if (!lines.length) {
            return;
        }

        // shift the map for each line to remove
        for (let i = 0; i < lines.length; ++i) {
            map.shift(lines[i] + i, 1);
        }

        // add wall at each side of the new lines
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < map.numCols; ++j) {
                map.updateTile(j, i, 0, Tile.TYPE.AIR);
            }
            map.updateTile(0, i, 8, Tile.TYPE.WALL);
            map.updateTile(map.numCols - 1, i, 8, Tile.TYPE.WALL);
        }

        this.increaseScore(lines.length);
    }
}