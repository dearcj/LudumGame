import {O} from "../Neu/BaseObjects/O";
import {Camera} from "../Neu/BaseObjects/Camera";
import {Vec2} from "../Neu/Math";
import {_} from "../main";
import {Bodies, Body, Composite, Composites, Constraint, World, Vector} from "../lib/matter";
/**
 * Created by KURWINDALLAS on 17.11.2014.
 */
export class ChainCreator extends O{

    public bodiesList: Array<Body> = [];

    onDestroy() {
        super.onDestroy();
        this.bodiesList = [];
    }

    init(props: any) {
        super.init(props);

        let group = Body.nextGroup(true);

        var ropeB = Composites.stack(this.pos[0], this.pos[1], 1, 15, 5, 5, function(x, y) {
            let cb =  Bodies.circle(x, y, 7, {  collisionFilter: { group: group, category: null, mask: null } });
            return cb;
        });

        Composites.chain(ropeB, 0, 0.5, 0, -0.5, { stiffness: 0.8, length: 3 });
        Composite.add(ropeB, Constraint.create({
            bodyB: ropeB.bodies[0],
            pointB: { x: 0, y: 0 },
            pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
            stiffness:0.8
        }));


        World.add(_.engine.world, [
            ropeB,
        ]);

        let lastObj: O;
        let inx = 0;

        this.bodiesList = ropeB.bodies;

        for (let b of ropeB.bodies) {
            let str: string;
            if (inx % 2 == 0) {
                str = "Chainp1.png"
            } else {
                str = "Chainp2.png"
            }
            lastObj = new O([0,0], _.cs(str, this.layer));
            lastObj.body = b;
            inx ++;
        }
        lastObj.body.mass *= 3;
        let link = props.link;
        if (link) {
            let objs = link.split('\n');
            for (let x of objs) {
                let obj = _.sm.findOne(x, _.lm.objectsList);
                obj.pos[0] = lastObj.pos[0] - (this.pos[0] - obj.pos[0]);
                obj.pos[1] = lastObj.pos[1] - (this.pos[1] - obj.pos[1]);
                lastObj.linkObj(obj);
            }
        }
    }

    process() {
        for (let x of this.bodiesList) {
            Body.applyForce(x, Vector.create(x.position.x, x.position.y), Vector.create(0, 0))
        }
    }
}