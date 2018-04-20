import {O} from "../Neu/BaseObjects/O";
import {Bodies, Body, Vector, World} from "../lib/matter";
import {_} from "../main";

export let Groups = {
    GR_MAIN: Body.nextGroup(false),
};

export class Phys extends O {
    private physAngleOffset: number = 0;
    setBody(b: Body) {
        this.body = b;
        World.add(_.engine.world, [
            this.body,
        ]);
    }

    process() {
        if (this.body) {
            this.x = this.body.position.x;
            this.y = this.body.position.y;
            this.a = Math.PI * (this.body.angle / 180) + this.physAngleOffset;
        }


        super.process()
    }


    init(props: any) {
        super.init(props);

        let isStatic = props["static"] == "true";
        //this.body =  Bodies.circle(this.pos[0], this.pos[1], 97, {isStatic: isStatic, collisionFilter: { group: Groups.GR_MAIN, category: null, mask:null}  });

        if (props["shape"]) {
            let id = props["shape"];
            let obj = _.sm.findOne(id, _.lm.objectsList);
            if (obj) {
                let verts = obj.polygon;

                let pointsArr = verts.split(' ');
                let arr: Vector[] = [];
                let minx: number = Infinity;
                let miny: number = Infinity;
                for (let x of pointsArr) {
                    let p = x.split(',');
                    let xx = parseFloat(p[0]);
                    let yy = parseFloat(p[1]);
                    minx = minx > xx ? xx : minx;
                    miny = miny > yy ? yy : miny;
                    let v = Vector.create(xx, yy);
                    arr.push(v);
                }

                this.physAngleOffset = this.a;

                this.setBody(Bodies.fromVertices(this.pos[0], this.pos[1], [arr],  {
                    isStatic: isStatic,
                }))
            }
        }

    }
}