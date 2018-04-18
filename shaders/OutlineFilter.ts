import {_} from "../main";
export class OutlineFilter extends PIXI.Filter<{thickness, outlineColor}> {

    constructor(thickness: number = 3, color: number = 0xff00ff) {
        let shader = _.rm.shaders['outline.frag'].replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7));
        super(
            _.rm.shaders['outline.vert'],
            shader,
            {
                thickness : {type: '1f', value: 1},
                outlineColor : {type: 'v4', value: {x: 0, y: 0, z: 0, w: 1}},
            });

        this.uniforms.thickness = thickness;
        this.color = color;
    }

    get color(): number {
        return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    }

    set color(value: number) {
        PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    }

}