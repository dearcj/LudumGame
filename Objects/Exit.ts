import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {CellObject} from "./CellObject";
import {Light} from "../Neu/BaseObjects/Light";
import {ParticleSystem} from "./ParticleSystem";

export class Exit extends CellObject {
    private light: Light;
    init(p: any) {
        this.gfx = _.cs("exit");

        this.light = new Light([this.x, this.y ]);
        this.light.gfx = _.cs("lightness", _.game.layers['lighting']);
        this.light.init({candle: true});
        this.layer.addChildAt(this.gfx, 0);
        this.setMyCell_noOCCUPY();
       /* this.wait(0.05).call(()=>{
            let part: ParticleSystem = <ParticleSystem >_.sm.findOne("ps1");
            this.setInterval(()=>{
                let p = part.addParticle(this.x + (Math.random() - 0.5)*50, this.y + (Math.random() - 0.5)*50);
                p.v[1] = -261  - Math.random()*266;
                p.lifeTime *= 0.3;
            }, 0.4);

        }).apply();*/
        super.init();
    }

    onDestroy() {
        super.onDestroy();

        this.light = O.rp(this.light);
    }

    onPlayerMovePriority(): boolean {
        if (_.game.player.cell == this.cell) {
            _.game.win = true;
            this.wait(0.2).call(()=>{
                _.game.next();
            }).apply();
        }
        return true;
    }

}