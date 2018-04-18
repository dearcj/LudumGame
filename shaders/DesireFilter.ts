import {_} from "../main";
export class DesireFilter extends PIXI.Filter<{center, params, time}> {

    constructor() {
        super(
            _.rm.shaders['default.vert'],
            _.rm.shaders['desire.frag'],
            {
                center: {type: 'v2', value: {x: 0.5, y: 0.5}},
                params: {type: 'v3', value: {x: 10, y: 0.8, z: 0.1}},
                time: {type: '1f', value: 1}
            });

        this.center = [0.5, 0.5];
        this.params = [4, 7.8, 0.3];
        //this.time = 1;
    }

    get center() {
        return this.uniforms.center;
    }

    set center(value) {
        this.uniforms.center = value;
    }

    get params() {
        return this.uniforms.params;
    }

    set params(value) {
        this.uniforms.params = value;
    }

    get time() {
        return this.uniforms.time;
    }

    set time(value) {
        this.uniforms.time = value;
    }
}