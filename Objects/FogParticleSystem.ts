import {Actor} from "./Actor";
import {O} from "../Neu/BaseObjects/O";
import {Camera} from "../Neu/BaseObjects/Camera";
import {m, Vec2} from "../Neu/Math";
import {config} from "../config";
import {_} from "../main";
import {EnemyObject} from "../protoTypeScript/compiled";
import {PauseTimer} from "../Neu/PauseTimer";
import {BaseParticleSystem} from "../Neu/BaseObjects/BaseParticleSystem";

const PARTICLE_COUNT = 45;

export class FogParticleSystem extends BaseParticleSystem{


    private running: boolean = false;
    particle: string;
    spd: number = 1;
    init(props: any): void{
        super.init( props);
        let w = 100;
        let h = 200;
        this.doOProcess = false;
        for (let x = 0; x < PARTICLE_COUNT; x++) {
            let dx = (Math.random() - 0.5);
            let dy = (Math.random() - 0.5);
            let x = dx*w;
            let y = dy*h;
            let mlt = 9999999999;
            let p = _.cs(this.particle);
            p.rotation = Math.random()*Math.PI*2;
            this.add({
                br: Math.random()*Math.PI,
                vx: dx*2,
                vy: dy*2,
                alpha: 0.8,
                angle: Math.random()*Math.PI*2,
                speed: (Math.random() + 0.4)*this.spd,
                x: x,
                y: y,
                a: (Math.random() - 0.5)*0.04 ,
                lifeTime: mlt,
            }, p)
        }
    }

    onDestroy(): void{
        super.onDestroy();
    }

    processParticle(i: number, delta: number) {
        let p: PIXI.heaven.Sprite = this.gfx.children[i];
        let pobj: any = this.particles[i];


        if (this.running) {
            pobj.vx = Math.abs(pobj.vx)*1.1;// - (_.sm.camera.offset[0]);
            p.scale.x *= 0.98;
            p.scale.y *= 0.98;
            if (pobj.lifeTime < 0.5) {
                pobj.alpha = pobj.lifeTime / 0.5;
            }
            p.rotation += pobj.a * p.alpha;
        } else {
            p.rotation += pobj.a / 10.;
            pobj.angle += pobj.speed / 2;
            pobj.vx = _.fMath.cos(pobj.angle)*pobj.speed;
            pobj.vy = _.fMath.sin(pobj.angle)*pobj.speed;
            p.scale.x += pobj.vx / 20;
            p.scale.y += pobj.vy / 20;
            p.scale.x = 1 * 0.8 + p.scale.x *0.2;
            p.scale.y = 1 * 0.8 + p.scale.y *0.2;
        }
        pobj.x += pobj.vx;
        pobj.y += pobj.vy;
        p.alpha = pobj.alpha;
        p.x = pobj.x;// - (_.sm.camera.offset[0]);
        p.y = pobj.y;// - (_.sm.camera.offset[1]);
    }

    process() {
        super.process();
    }

    runAndKill() {
        this.running = true;
        let max = 0;
        for (let x of this.particles) {
            let mlt = Math.random()*0.3 + 0.6;
            x.lifeTime = mlt;
            max = Math.max(mlt, max)
        }

        this.wait(max).kill().apply();
    }
}