import {_} from "../main";

export class GlowFilter extends PIXI.Filter<{distance, glowColor, outerStrength, innerStrength}> {

    constructor(distance: number = 10, outerStrength: number = 4, innerStrength: number = 0, color: number = 0xffffff, quality: number = 0.1) {
        let shader = _.rm.shaders['glow.frag'].replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7)).replace(/%DIST%/gi, '' + distance.toFixed(7));
        //console.log(shader);
        super(
            _.rm.shaders['default.vert'],
            shader,
            {
                distance : {type: '1f', value: 1},
                glowColor : {type: 'v4', value: {x: 0, y: 0, z: 0, w: 1}},
                outerStrength : {type: '1f', value: 1},
                innerStrength : {type: '1f', value: 1},
            });

        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
    }


    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.glowColor);
    }

    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
    }

    /**
     * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
     * @member {number}
     * @default 10
     */
    get distance() {
        return this.uniforms.distance;
    }

    set distance(value) {
        this.uniforms.distance = value;
    }

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    get outerStrength() {
        return this.uniforms.outerStrength;
    }

    set outerStrength(value) {
        this.uniforms.outerStrength = value;
    }

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    get innerStrength(): number {
        return this.uniforms.innerStrength;
    }

    set innerStrength(value) {
        this.uniforms.innerStrength = value;
    }
}