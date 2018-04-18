import {_} from "../main";
export class MoonFilter extends PIXI.Filter<{time: number, resxy: any}> {

    constructor() {
        super(
            _.rm.shaders['default.vert'],
            _.rm.shaders['moon.frag'],
            {
                resxy: {type: 'v2', value: {x: 800, y: 600}},
                time: {type: '1f', value: _.time}
            });
        this.uniforms.time = 0;
    }

    get time() {
        return this.uniforms.time;
    }

    set time(value) {
        this.uniforms.time = value;
    }
}