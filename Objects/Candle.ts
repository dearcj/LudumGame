import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {m} from "../Neu/Math";
import {TweenMax} from "../Neu/Application";

/**
 * Created by KURWINDALLAS on 17.11.2014.
 */
export class Candle extends O{
    public vx: number = 0.5;
    private skewx: number;
    init(props: any = null) {
        super.init( props);
        this.skewx = -0.01;
        const tw3 = new TweenMax(this, 0.2, {skewx: 0.01, yoyo: true, repeat: -1});
        tw3.progress(Math.random());
        let initScale = [this.gfx?this.gfx.scale.x: 1, this.gfx?this.gfx.scale.y: 1];
        let inx = this.gfx ? this.gfx.parent.getChildIndex(this.gfx): 0;
        O.rp(this.gfx);
        this.gfx = _.cm("CandleAnim", null,false, [1, 1, 1.5, 1,  1.4, 1, 1]);
        this.gfx.animationSpeed = 0.018;
        this.gfx.scale.x = initScale[0];
        this.gfx.scale.y = initScale[1];
        this.layer.addChildAt(this.gfx, inx);
        this.gfx.gotoAndPlay(m.rint(0, this.gfx.totalFrames- 1));
    }

    process() {
        this.gfx.skew.x = this.skewx;
        super.process()
    }

    onDestroy(){
        TweenMax.killTweensOf(this.gfx.scale);
        TweenMax.killTweensOf(this);
        super.onDestroy()
    }

}