import {O} from "../Neu/BaseObjects/O";
import {Power1, TweenMax} from "../Neu/Application";

export class JumpRock extends O {
    SmallJump(power: number) {
        let del =Math.random()*0.05;
        TweenMax.killTweensOf(this);
        TweenMax.to(this, 0.07, {delay: del, y: this.y-6*power, ease: Power1.easeOut});
        TweenMax.to(this, 0.07, {delay: del + 0.07, y: this.y, ease: Power1.easeIn});
    }
}