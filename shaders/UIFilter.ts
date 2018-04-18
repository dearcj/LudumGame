import {_} from "../main";
export class UIFilter extends PIXI.Filter<{center, params, time}> {

    constructor() {
        super(
            _.rm.shaders['default.vert'],
            _.rm.shaders['uifilter.frag'],
            {
                center: {type: 'v2', value: {x: 0.5, y: 0.5}},
                params: {type: 'v3', value: {x: 10, y: 0.8, z: 0.1}},
                time: {type: '1f', value: 1}
            });

        this.center = [0.35, 0.35];
        this.params = [8, .35, 0.15];
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