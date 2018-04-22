import {m, Vec2} from "../Neu/Math";
import {_} from "../main";
import {BaseParticleSystem} from "../Neu/BaseObjects/BaseParticleSystem";

export type Particle = {
    v: Vec2;
    x: number
    y: number
    angle: number
    mass: number
    lifeTime: number
    baseScaleX: number
    baseScaleY: number
    av: number
    alpha: number
}

export class ParticleSystem extends BaseParticleSystem{
    private wind: Vec2 = [0, 0];
    public includeWind = false;
    public partScale: Vec2 = [1, 1];

    addParticle(x: number, y: number): Particle {
        let s = "part1";
        if (Math.random() > 0.5) {
            s = "part2";
        }
        let p = _.cm(s);
        p.x = x - this.pos[0];
        p.y = y - this.pos[1];
        //TODO: SLOW PART
        let baseScaleX = 0.3 + Math.random()*0.8;
        let baseScaleY = 0.3 + Math.random()*0.8;
        p.scale.x = baseScaleX;
        p.scale.y = baseScaleY;

        const po: Particle = {
            alpha: 1,
            av: 0,
            baseScaleX: 2*baseScaleX,
            baseScaleY: 2*baseScaleY,
            v: [0,0],
            lifeTime: 20 + 22*Math.random(),
            x: p.x,
            y: p.y,
            angle: Math.random()*Math.PI * 2,
            mass: Math.random()*2 + 5};

        super.add(po, p);

        return po;
    }

    init(props: any): void{
        this.pos[0] -= _.screenCenterOffset[0];
        this.pos[1] -= _.screenCenterOffset[1];
        super.init(props);
        this.gfx.width = _.SCR_WIDTH;
        this.gfx.height = _.SCR_HEIGHT;
        this.wind = [0, 0];

        let addPart = (fixy: number = 0) => {
            this.addParticle(this.pos[0] + Math.random()*_.SCR_WIDTH,
                this.pos[1] + _.screenCenterOffset[1] + 50 + fixy);
        };

        this.setInterval(() => {
            addPart(Math.random()*1200);
        }, 0.8);
        for (let x = 0; x < 50; x++) {
            addPart(Math.random()*1200)
        }
        this.includeWind = true;

        for (let x = 0; x < 30; x++) {
            this.processParticles(0.5);
        }
        this.process();

    }

    onDestroy(): void{
        super.onDestroy();
    }

    explode(p: Vec2): void{
        const sqdist = 450*450;
        for (let x of this.particles) {
            let part: any = x;
            let worldx = this.pos[0] + x.x - _.SCR_WIDTH / 2;
            let worldy = this.pos[1] + x.y - _.SCR_HEIGHT / 2;

            const sqd = ((p[0] - worldx)*(p[0] - worldx) +
            (p[1] - worldy)*(p[1] - worldy));
            if (sqd < sqdist) {
                let d = Math.sqrt(sqd);
                let dx = (p[0] - worldx) / d;
                let dy = (p[1] - worldy) / d;
                let power = 0 + 2000 / (d + 100);
                part.v[0] -= power * dx;
                part.v[1] -= power* dy;
            }
        }
    }

    processParticle(i: number, delta: number) {
        let p = this.gfx.children[i];
        let pobj: any = this.particles[i];

        pobj.y += 0.15;
        let v = m.rv2(this.wind, pobj.angle);
        pobj.av = pobj.av * 0.8 + 0.2*((Math.random() + 1) / 100);

        pobj.angle += pobj.av;
        //TODO: slow place

        let dx = _.fMath.cos(pobj.angle);
        let dy = _.fMath.sin(pobj.angle);

        pobj.alpha = (dy + 1) * 0.5;

        if (dy > 0.2 && dy < 0.35) {
            p.gotoAndStop(2);
        } else
        if (dy > 0 && dy < 0.5) {
            p.gotoAndStop(1);
        } else
            p.gotoAndStop(0);

        if (p.lifeTime < 0.1) {
            pobj.alpha = pobj.lifeTime / 0.1;
        }
        p.alpha = pobj.alpha;

        p.scale.x = pobj.baseScaleX * (1 + dx*0.3) * this.partScale[0];
        p.scale.y = pobj.baseScaleY * (1 + dy*0.3) * this.partScale[1];
        pobj.v[0] = pobj.v[0]*0.8 + v[0]*0.2;
        pobj.v[1] = pobj.v[1]*0.8 + v[1]*0.2;
        if (this.includeWind) {
            pobj.v[0] += this.wind[0] * 0.12;
            pobj.v[1] += this.wind[1] * 0.12;
        }
        pobj.x += (pobj.v[0] / pobj.mass) * delta;
        pobj.y += (pobj.v[1] / pobj.mass) * delta;
        p.x = pobj.x;// - (_.sm.camera.offset[0]);
        p.y = pobj.y;// - (_.sm.camera.offset[1]);
        pobj.y += (_.SCR_HEIGHT - p.y) / 10000;
        this.alwaysVisible = true;
    }

    process() {
        this.wind[0] = _.fMath.cos(_.time / 4000) *60.8;
        this.wind[1] = _.fMath.sin(_.time / 4000) *15.8;

        super.process();
    }
}