import Scene from 'athenajs';

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