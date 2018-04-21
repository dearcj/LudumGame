import {Lighting} from "../Neu/BaseObjects/Lighting";
import {_} from "../main";
import {TweenMax} from "../Neu/Application";
import {O} from "../Neu/BaseObjects/O";

export class Lighting2 extends Lighting {
    particles: PIXI.heaven.Sprite[] = [];
    private tween: any;

    onDestroy() {
        super.onDestroy();

        this.tween = _.killTween(this.tween);
    }

    init(props: any) {
        super.init(props);
        this.setInterval(()=> {
            this.addParticle();
        }, 0.5);

        for (let x = 0; x < 10; x++) {
            this.addParticle();
        }

        this.tween = TweenMax.to(this.ambient.scale, 2, {x: 1.02, y: 1.02, yoyo: true, repeat: -1});
    }

    private addParticle() {
        let p = _.cs("fog1");
        p.alpha = 0;
        p.scale.set(0.7 + Math.random()*0.3);


        let delta = 50;
        let dir;
        if (Math.random() > 0.5) {
            p.x = this.ambient.width  - 50 - Math.random()*delta;
            dir = -1;
        } else {
            p.x = 50 + Math.random()*delta;
            dir = 1;
        }
        TweenMax.to(p, 4, {alpha: 0.5 ,x:p.x + dir*Math.random()*45,  yoyo: true, repeat: 2, onComplete: ()=>{
            this.removeParticle(p);
        }});

        p.y = Math.random() * this.ambient.height;

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