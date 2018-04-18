import {m, Vec2} from "../Neu/Math";
import {config} from "../config";
import {_} from "../main";
import {BaseParticleSystem} from "../Neu/BaseObjects/BaseParticleSystem";
import {Particle} from "./ParticleSystem";
import {O} from "../Neu/BaseObjects/O";

export type PolyLineSegment = {
    start: Vec2;
    end: Vec2;
    len: number;
    delta: Vec2;
}

class PolyLine {
    Lines: PolyLineSegment[];
    __vec2: Vec2 = [0, 0];
    getPoint(prop: number): Vec2 {
        let total = 0;
        for (let x of this.Lines) {
            total += x.len;
        }

        let point = prop * total;
        let curr = 0;
        for (let x of this.Lines ) {
            if (point <= curr + x.len) {
                let insidedist = (point - curr);
                return [insidedist * x.delta[0] + x.start[0], insidedist*x.delta[1] + x.start[1]]
            }
            curr += x.len;
        }
    }

    static CreateFromString(s: string, offs: Vec2):PolyLine{
        let p = new PolyLine();
        let l: PolyLineSegment[] = [];

        let pointsArr = s.split(' ');
        for (let x = 1; x < pointsArr.length; x++) {
            let p0 = pointsArr[x - 1].split(',');
            let p1 = pointsArr[x].split(',');
            let start: Vec2 = [parseFloat(p0[0]) + offs[0], parseFloat(p0[1]) + offs[1]];
            let end: Vec2 = [parseFloat(p1[0]) + offs[0], parseFloat(p1[1]) + offs[1]];
            let sub: Vec2 = m.subv2(end, start);
            l.push({
               start: start,
               end: end,
                delta: m.normalizeV2(m.v2cp(sub)),
                len: m.v2len(sub),
            });
        }
        
        p.Lines = l;
        return p;
    }
}


export class ChestParticles extends BaseParticleSystem{
    public partScale: Vec2 = [1, 1];
    private count: number = 0;
    private polyLines: PolyLine[] = [];
    private counter: number = 0;
    private polyLineProp: number;

    addParticle(x: number, y: number): Particle {
        let p = _.cs('particlechest.png');
        p.x = x - this.pos[0];
        p.y = y - this.pos[1];
        //TODO: SLOW PART
        let baseScaleX = 0.1 - y / 240;
        let baseScaleY = 0.1 - y / 240;
        p.scale.x = baseScaleX;
        p.scale.y = baseScaleY;
        this.count ++;
        const po: Particle = {
            alpha: 1,
            angle: (Math.PI / 2) * (this.count % 2),
            av: 0,
            baseScaleX: baseScaleX,
            baseScaleY: baseScaleY,
            v: [0, - Math.random()*0.1 - 0.1],
            lifeTime: 0.2 + Math.random()*0.3,
            x: p.x,
            y: p.y,
            mass: Math.random()*2 + 5};

        super.add(po, p);

        return po;
    }


    init(props: any): void{
        super.init(props);
        this.gfx.blendMode = PIXI.BLEND_MODES.ADD;
        this.alwaysVisible = true;
    }

    onDestroy(): void{
        super.onDestroy();
    }
    processParticle(i: number, delta: number) {
        let p = this.gfx.children[i];
        let pobj: any = this.particles[i];
  //      pobj.y += 0.15;
        pobj.av = pobj.av * 0.8 + 0.2*((Math.random() + 1) / 100);
        pobj.angle += pobj.av;
        //TODO: slow place

        if (pobj.lifeTime < 0.2) {
            pobj.alpha = pobj.lifeTime / 0.2;
        }
        let a = 1 - Math.abs(this.polyLineProp - 0.5);
        pobj.baseScaleX *= 0.98;
        pobj.baseScaleY *= 0.98;
        p.scale.x = pobj.baseScaleX * a;
        p.scale.y = pobj.baseScaleY * a;
        p.alpha = pobj.alpha;
        pobj.angle += 0.05;

        p.rotation = pobj.angle;
        pobj.x += pobj.v[0];
        pobj.y += pobj.v[1];
        p.x = pobj.x;
        p.y = pobj.y;
    }

    process() {
        let prop = ((_.time / 5) % 1450) / 1450;
        if (prop > 0.7) {
            for (let x = 0; x < this.polyLines.length; x++) {
                let pp = (prop - 0.7) / 0.3;
                if (x == 1) {
                    pp = Math.pow(pp, 1.5);
                }
                this.counter++;
                if (this.counter % 2 == 0) {
                    this.polyLineProp = pp;
                    let pos = this.polyLines[x].getPoint(pp);
                    let p = this.addParticle(pos[0], pos[1]);
                    p.alpha = pp*0.4;
                    this.counter++;
                } else {
                }
            }
        }
        super.process();
    }

    addPath(pathObject: O) {
        this.polyLines.push(PolyLine.CreateFromString(pathObject.properties["polyline"], pathObject.pos));
    }
}




export class DesirePS extends BaseParticleSystem{
    private count: number = 0;
    time: number = 0;
    private radius: number = 50;

    addParticle(x: number, y: number): Particle {
        let p = _.cs('particlechest.png');
        p.x = x - this.pos[0];
        p.y = y - this.pos[1];
        //TODO: SLOW PART
        let baseScaleX = 0.15 - y / 240;
        let baseScaleY = 0.15 - y / 240;
        p.scale.x = baseScaleX;
        p.scale.y = baseScaleY;
        this.count ++;
        const po: Particle = {
            alpha: 1,
            angle: (Math.PI / 2) * (this.count % 2),
            av: 0,
            baseScaleX: baseScaleX,
            baseScaleY: baseScaleY,
            v: [0, - Math.random()*0.1 - 0.1],
            lifeTime: 0.2 + Math.random()*0.3,
            x: p.x,
            y: p.y,
            mass: Math.random()*2 + 5};

        super.add(po, p);

        return po;
    }


    init(props: any): void{
        super.init(props);
        this.gfx.blendMode = PIXI.BLEND_MODES.ADD;
        this.alwaysVisible = true;
    }

    onDestroy(): void{
        super.onDestroy();
    }
    processParticle(i: number, delta: number) {
        let p = this.gfx.children[i];
        let pobj: any = this.particles[i];
        //      pobj.y += 0.15;
        pobj.av = pobj.av * 0.8 + 0.2*((Math.random() + 1) / 100);
        pobj.angle += pobj.av;
        //TODO: slow place

        if (pobj.lifeTime < 0.2) {
            pobj.alpha = pobj.lifeTime / 0.2;
        }
        pobj.baseScaleX *= 0.98;
        pobj.baseScaleY *= 0.98;
        p.scale.x = pobj.baseScaleX;
        p.scale.y = pobj.baseScaleY;
        p.alpha = pobj.alpha;
        pobj.angle += 0.05;

        p.rotation = pobj.angle;
        pobj.x += pobj.v[0];
        pobj.y += pobj.v[1];
        p.x = pobj.x;
        p.y = pobj.y;
    }

    process() {
        let px = _.fMath.cos(this.time)*this.radius;
        let py = _.fMath.sin(this.time)*this.radius;
        this.addParticle(px + this.time*(Math.random() - 0.5), py + this.time*(Math.random() - 0.5));
        this.addParticle(px + this.time*(Math.random() - 0.5), py + this.time*(Math.random() - 0.5));
        super.process();
    }

}