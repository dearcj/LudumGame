import {Lighting} from "../Neu/BaseObjects/Lighting";
import {_} from "../main";
import {TweenMax} from "../Neu/Application";
import {O} from "../Neu/BaseObjects/O";

export class Lighting2 extends Lighting {
    particles: PIXI.heaven.Sprite[] = [];
    private tween: any;
    static POWER: number = 1;

    onDestroy() {
        super.onDestroy();

        this.tween = _.killTween(this.tween);
    }

    init(props: any) {
        super.init(props);
        this.setInterval(()=> {
            this.addParticle();
        }, 0.5);

        for (let x = 0; x < 30; x++) {
            this.addParticle();
        }
        this.ambient.scale.x *= 2;
        this.ambient.scale.y *= 2;
     //   this.tween = TweenMax.to(this.ambient.scale, 2, {x: 1.02, y: 1.02, yoyo: true, repeat: -1});
    }

    private addParticle() {
        let p = _.cs("fog1");
        p.alpha = 0.;
        p.scale.set(1 + Math.random()*(0.4*Lighting2.POWER) );
        p.color.setDark(0.1, 0., 0.)

        let delta = 90;
        let dir;
        if (Math.random() > 0.5) {
            p.x = 300 + this.ambient.width  - Lighting2.POWER * (Math.random()*delta);
            dir = -1;
        } else {
            p.x = -300+ Lighting2.POWER * Math.random()*delta;
            dir = 1;
        }
        p.x -= 100;

        if (Math.random() > 0.5) {
            p.scale.x -= p.scale.x;
        }

        let tw = TweenMax.to(p, 4, {alpha: 0.3 ,x:p.x + dir*Math.random()*45,  yoyo: true, repeat: 2, onComplete: ()=>{
            this.removeParticle(p);
        }});
        tw.progress(Math.random());

        p.y = 25 + 1.4 * Math.random() * this.ambient.height;

        this.ambientContainer.addChild(p);
    }

    private removeParticle(p: PIXI.heaven.Sprite) {
        let inx = this.particles.indexOf(p);
        if (~inx) {
            this.particles.splice(inx, 1);
            O.rp(p);
            TweenMax.killTweensOf(p);
        }
    }
}