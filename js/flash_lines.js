import { Canvas } from 'athenajs';

export default class FlashLines extends Canvas {
    constructor(name, options = {}) {
        super('flashlines', Object.assign({}, {
        }, options));

        this.lines = [];
        this.lineHeight = options.lineHeight;
    }

    flash(times, duration) {
        return this.animate('Fade', {
            startValue: 1,
            endValue: 0,
            duration: 400,
            loop: 2
        })
    }

    render() {
        for (let i = 0; i < this.lines.length; ++i) {
            const line = this.lines[i];
            this.rect(0, line * this.lineHeight, this.w, this.lineHeight, 'white');
        }
    }
}