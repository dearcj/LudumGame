import {Tower} from "./Tower";
import {_} from "../main";
import {Power1, TweenMax} from "../Neu/Application";

export class TowerDeath extends Tower {
    init(p: any) {
        this.layer = _.sm.stage.layers['main'];
        super.init(p);

        this.on("loaded").call(()=>{
            this.alignToCell();

            let prev = this.gfx.scale.x;
            this.gfx.scale.x = 0;
            this.gfx.scale.y = 0;
            TweenMax.to(this.gfx.scale, 0.5, {x: prev, y: prev, ease: Power1.easeOuts});
        }).apply();
    }
}