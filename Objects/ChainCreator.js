var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../lib/matter"], function (require, exports, O_1, main_1, matter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by KURWINDALLAS on 17.11.2014.
     */
    var ChainCreator = /** @class */ (function (_super) {
        __extends(ChainCreator, _super);
        function ChainCreator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.bodiesList = [];
            return _this;
        }
        ChainCreator.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.bodiesList = [];
        };
        ChainCreator.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            var group = matter_1.Body.nextGroup(true);
            var ropeB = matter_1.Composites.stack(this.pos[0], this.pos[1], 1, 15, 5, 5, function (x, y) {
                var cb = matter_1.Bodies.circle(x, y, 7, { collisionFilter: { group: group, category: null, mask: null } });
                return cb;
            });
            matter_1.Composites.chain(ropeB, 0, 0.5, 0, -0.5, { stiffness: 0.8, length: 3 });
            matter_1.Composite.add(ropeB, matter_1.Constraint.create({
                bodyB: ropeB.bodies[0],
                pointB: { x: 0, y: 0 },
                pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
                stiffness: 0.8
            }));
            matter_1.World.add(main_1._.engine.world, [
                ropeB,
            ]);
            var lastObj;
            var inx = 0;
            this.bodiesList = ropeB.bodies;
            for (var _i = 0, _a = ropeB.bodies; _i < _a.length; _i++) {
                var b = _a[_i];
                var str = void 0;
                if (inx % 2 == 0) {
                    str = "Chainp1.png";
                }
                else {
                    str = "Chainp2.png";
                }
                lastObj = new O_1.O([0, 0], main_1._.cs(str, this.layer));
                lastObj.body = b;
                inx++;
            }
            lastObj.body.mass *= 3;
            var link = props.link;
            if (link) {
                var objs = link.split('\n');
                for (var _b = 0, objs_1 = objs; _b < objs_1.length; _b++) {
                    var x = objs_1[_b];
                    var obj = main_1._.sm.findOne(x, main_1._.lm.objectsList);
                    obj.pos[0] = lastObj.pos[0] - (this.pos[0] - obj.pos[0]);
                    obj.pos[1] = lastObj.pos[1] - (this.pos[1] - obj.pos[1]);
                    lastObj.linkObj(obj);
                }
            }
        };
        ChainCreator.prototype.process = function () {
            for (var _i = 0, _a = this.bodiesList; _i < _a.length; _i++) {
                var x = _a[_i];
                matter_1.Body.applyForce(x, matter_1.Vector.create(x.position.x, x.position.y), matter_1.Vector.create(0, 0));
            }
        };
        return ChainCreator;
    }(O_1.O));
    exports.ChainCreator = ChainCreator;
});
