import {m, Vec2} from "../Neu/Math";
import {_} from "../main";
import {BaseParticleSystem} from "../Neu/BaseObjects/BaseParticleSystem";


export class DarkParticleSystem extends BaseParticleSystem{
    private wind: Vec2;

    addParticle(x: number, y: number, rnd: number) {
        let s = "particle1.png";
        let p = _.cs(s);
        p.x = x - this.pos[0];
        p.y = y - this.pos[1];

        let baseScaleX = 1 + Math.random()*0.4;
        let baseScaleY = 1 + Math.random()*0.4;
        p.scale.x = baseScaleX;
        p.scale.y = baseScaleY;
        this.gfx.addChild(p);

        let lt = 10000000;
        let phase = 2*Math.PI*Math.random();
        let particleObj = {
            baseScaleX: baseScaleX,
            baseScaleY: baseScaleY,
            v: [0,0],
            lifeTime: lt,
            x: p.x,
            y: p.y,
            alpha: 1,
            angle: 0,
            av: (-1 + Math.random()) / 500.,
            windx: 0,
            windy: 0,
            baseAlpha: 0.14 - rnd * 0.08,
            phase: phase,
        };

        this.add(particleObj, p);

        baseScaleX = 1 + Math.random()*0.4;
        baseScaleY = 1 + Math.random()*0.4;
        p = _.cs(s);
        p.x = x- this.pos[0] + 45*(Math.random() - 0.5);
        p.y = y - this.pos[1]  + 45*(Math.random() - 0.5);
        p.blendMode = PIXI.BLEND_MODES.NORMAL;
        p.scale.x = baseScaleY;
        p.scale.y = baseScaleX;
        particleObj = {
            baseScaleX: baseScaleY,
                baseScaleY: baseScaleX,
            v: [0,0],
            lifeTime: lt,
            x: p.x,
            y: p.y,
            alpha : 1,
            baseAlpha: 0.14 - rnd * 0.08,
            angle: Math.PI,
            av: (-1 + Math.random()) / 500.,
            windx: 0,
            windy: 0,
            phase: Math.PI - phase,
        };

        this.add(particleObj, p);

    }

    init(props: any): void{
        this.pos[0] -= _.screenCenterOffset[0];
        this.pos[1] -= _.screenCenterOffset[1];
        super.init( props);
        this.wind = [0, 0];
         let addPart = () => {
            const rnd = Math.random();

            this.addParticle(Math.random()*_.SCR_WIDTH + this.pos[0],
                this.pos[1]+ rnd*550, rnd);
        };

        for (let x = 0; x < 35; x++) {
            addPart();
        }

        this.process();
    }

    onDestroy(): void{
        super.onDestroy();
    }

    explode(p: Vec2): void{
    }

    processParticle(i: number) {
        let p = this.gfx.children[i];
        let pobj: any = this.particles[i];

        let v = m.rv2(this.wind, pobj.angle);

        pobj.angle += pobj.av;
        //TODO: slow place
        let deltaX = _.fMath.cos(1.5*pobj.angle + pobj.phase);
        let deltaY = _.fMath.sin(1.5*pobj.angle + pobj.phase);
        p.scale.x = pobj.baseScaleX * (1 + deltaX*0.25);
        p.scale.y = pobj.baseScaleY * (1 + deltaY*0.25);
        pobj.v[0] = pobj.v[0]*0.8 + v[0]*0.2;
        pobj.v[1] = pobj.v[1]*0.8 + v[1]*0.2;
        p.rotation = pobj.angle;
        p.alpha =  0.1 + deltaY*0.05;

        pobj.windx *= 0.8;
        pobj.windy *= 0.8;
        let addwx = pobj.windx;
        let addwy = pobj.windy;

        p.x = pobj.x + addwx;
        p.y = pobj.y + addwy;
    }

    process() {
        this.wind[0] = Math.cos(_.time / 4000) *0.8;
        this.wind[1] = 0;
        super.process();
    }
}