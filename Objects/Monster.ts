import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {TweenMax} from "../Neu/Application";
import {ActiveCellObject} from "./ActiveCellObject";



export class Monster extends ActiveCellObject {
    public dead: boolean = false;
    die() {
        //this.gfx.parent.setChildIndex(this.gfx, 0);
        //O.rp(this.gfx);
        if (this.gfx) {
            TweenMax.to(this, 0.3, {y: this.y + 3});
            let def = this.gfx.scale.x;

            TweenMax.to(this.gfx.scale, 0.3, {x: 0.8*def, y: 0.7*def});
            _.pa.DamageTint(this, 0.3);
            this.wait(0.3).kill().apply();
            this.dead = true;
        }
    }
}




