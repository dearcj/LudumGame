import {O} from "../Neu/BaseObjects/O";
import {Camera} from "../Neu/BaseObjects/Camera";
import {Vec2} from "../Neu/Math";
import {_} from "../main";
/**
 * Created by KURWINDALLAS on 17.11.2014.
 */
export class BackgroundFar extends O{
    private initPos: Vec2;
    private baseY: number;

    init(props: any) {
        super.init(props);
        this.gfx.x = this.x+ _.screenCenterOffset[0];

        this.baseY = this.y;
    }

    process() {
        this.gfx.x = this.x + _.screenCenterOffset[0] - _.sm.camera.pos[0] / 10;
        this.gfx.y = this.baseY - _.SCR_HEIGHT;
    }
}