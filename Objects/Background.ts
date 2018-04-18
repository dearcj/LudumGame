import {O} from "../Neu/BaseObjects/O";
import {Camera} from "../Neu/BaseObjects/Camera";
import {Vec2} from "../Neu/Math";
import {_} from "../main";
/**
 * Created by KURWINDALLAS on 17.11.2014.
 */
export class Background extends O{
    private initPos: Vec2;

    init(props: any) {
        super.init(props);
        this.initPos = [this.pos[0], this.pos[1]];
        _.sm.camera.updateTransform(this, this.gfx);
    }

    process() {
    }
}