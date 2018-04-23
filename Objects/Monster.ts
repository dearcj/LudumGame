import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {TweenMax} from "../Neu/Application";
import {ActiveCellObject} from "./ActiveCellObject";



export class Monster extends ActiveCellObject {
    public dead: boolean = false;
    die() {
        //this.gfx.parent.setChildIndex(this.gfx, 0);
    //    O.rp(this.gfx);
     //   _.game.layers['tilebg'].addChild(this.gfx);
        if (this.gfx) {
          //  TweenMax.to(this, 0.3, {y: this.y + 3});
            let def = this.gfx.scale.x;

            this.gfx.state.clearTrack(0);
            this.gfx.skeleton.setToSetupPose();
            TweenMax.to(this.gfx.scale, 0.3, {x: 0.3*def, y: 0.4*def});
          //  TweenMax.to(this.gfx.skew, 0.1, {x: 0.05, yoyo: true, repeat: 1});
           // _.pa.DamageTint(this, 0.3);
            this.wait(0.4).kill().apply();

            this.dead = true;
        }
        let x = this.x;
        let y = this.y;
        _.rm.requestSpine("Blood", (d)=>{
            let o = new O([x, y + 70], new PIXI.heaven.spine.Spine(d));
            _.game.layers['tilebg'].addChild(o.gfx);
            o.init({});
            o.gfx.scale.set(0.42);
            o.gfx.state.setAnimation(0, "animation", false);
            o.wait(1).kill().apply();
        });

    }
}




