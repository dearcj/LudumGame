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
define(["require", "exports", "../Neu/BaseObjects/O", "../lib/matter", "../main"], function (require, exports, O_1, matter_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Groups = {
        GR_MAIN: matter_1.Body.nextGroup(false),
    };
    var Phys = /** @class */ (function (_super) {
        __extends(Phys, _super);
        function Phys() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.physAngleOffset = 0;
            return _this;
        }
        Phys.prototype.setBody = function (b) {
            this.body = b;
            matter_1.Body.rotate(this.body, this.a);
            matter_1.World.add(main_1._.engine.world, [
                this.body,
            ]);
        };
        Phys.prototype.process = function () {
            if (this.body) {
                this.x = this.body.position.x;
                this.y = this.body.position.y;
                this.a = this.body.angle + this.physAngleOffset;
            }
            _super.prototype.process.call(this);
        };
        Phys.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            var isStatic = props["static"] == "true";
            //this.body =  Bodies.circle(this.pos[0], this.pos[1], 97, {isStatic: isStatic, collisionFilter: { group: Groups.GR_MAIN, category: null, mask:null}  });
            if (props["shape"]) {
                var shapeTypeOrId = props["shape"];
                var obj = main_1._.sm.findOne(shapeTypeOrId, main_1._.lm.objectsList);
                if (obj) {
                    var verts = obj.polygon;
                    var pointsArr = verts.split(' ');
                    var arr = [];
                    var minx = Infinity;
                    var miny = Infinity;
                    for (var _i = 0, pointsArr_1 = pointsArr; _i < pointsArr_1.length; _i++) {
                        var x = pointsArr_1[_i];
                        var p = x.split(',');
                        var xx = parseFloat(p[0]);
                        var yy = parseFloat(p[1]);
                        minx = minx > xx ? xx : minx;
                        miny = miny > yy ? yy : miny;
                        var v = matter_1.Vector.create(xx, yy);
                        arr.push(v);
                    }
                    //this.physAngleOffset = -this.gfx.rotation;
                    this.setBody(matter_1.Bodies.fromVertices(this.pos[0], this.pos[1], [arr], {
                        isStatic: isStatic,
                    }));
                }
                else {
                    if (shapeTypeOrId == "box") {
                        this.setBody(matter_1.Bodies.rectangle(this.pos[0], this.pos[1], this.width, this.height, {
                            isStatic: isStatic,
                        }));
                    }
                    if (shapeTypeOrId == "circle") {
                        this.setBody(matter_1.Bodies.circle(this.pos[0], this.pos[1], this.width / 2, {
                            isStatic: isStatic,
                        }));
                    }
                }
            }
        };
        return Phys;
    }(O_1.O));
    exports.Phys = Phys;
});
