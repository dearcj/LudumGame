import {O} from "../Neu/BaseObjects/O";
import {CellObject} from "./Player";
import {_} from "../main";



export class Monster extends CellObject {
    public dead: boolean = false;

    die() {
        //O.rp(this.gfx);
        //this.gfx.parent.setChildIndex(this.gfx, 0);
        _.pa.DamageTint(this, 0.3);
        this.wait(0.3).kill().apply();
        this.dead = true;
    }
}




