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
define(["require", "exports", "../Neu/Math", "../main", "../Neu/BaseObjects/BaseParticleSystem"], function (require, exports, Math_1, main_1, BaseParticleSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PolyLine = /** @class */ (function () {
        function PolyLine() {
            this.__vec2 = [0, 0];
        }
        PolyLine.prototype.getPoint = function (prop) {
            var total = 0;
            for (var _i = 0, _a = this.Lines; _i < _a.length; _i++) {
                var x = _a[_i];
                total += x.len;
            }
            var point = prop * total;
            var curr = 0;
            for (var _b = 0, _c = this.Lines; _b < _c.length; _b++) {
                var x = _c[_b];
                if (point <= curr + x.len) {
                    var insidedist = (point - curr);
                    return [insidedist * x.delta[0] + x.start[0], insidedist * x.delta[1] + x.start[1]];
                }
                curr += x.len;
            }
        };
        PolyLine.CreateFromString = function (s, offs) {
            var p = new PolyLine();
            var l = [];
            var pointsArr = s.split(' ');
            for (var x = 1; x < pointsArr.length; x++) {
                var p0 = pointsArr[x - 1].split(',');
                var p1 = pointsArr[x].split(',');
                var start = [parseFloat(p0[0]) + offs[0], parseFloat(p0[1]) + offs[1]];
                var end = [parseFloat(p1[0]) + offs[0], parseFloat(p1[1]) + offs[1]];
                var sub = Math_1.m.subv2(end, start);
                l.push({
                    start: start,
                    end: end,
                    delta: Math_1.m.normalizeV2(Math_1.m.v2cp(sub)),
                    len: Math_1.m.v2len(sub),
                });
            }
            p.Lines = l;
            return p;
        };
        return PolyLine;
    }());
    var ChestParticles = /** @class */ (function (_super) {
        __extends(ChestParticles, _super);
        function ChestParticles() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.partScale = [1, 1];
            _this.count = 0;
            _this.polyLines = [];
            _this.counter = 0;
            return _this;
        }
        ChestParticles.prototype.addParticle = function (x, y) {
            var p = main_1._.cs('particlechest.png');
            p.x = x - this.pos[0];
            p.y = y - this.pos[1];
            //TODO: SLOW PART
            var baseScaleX = 0.1 - y / 240;
            var baseScaleY = 0.1 - y / 240;
            p.scale.x = baseScaleX;
            p.scale.y = baseScaleY;
            this.count++;
            var po = {
                alpha: 1,
                angle: (Math.PI / 2) * (this.count % 2),
                av: 0,
                baseScaleX: baseScaleX,
                baseScaleY: baseScaleY,
                v: [0, -Math.random() * 0.1 - 0.1],
                lifeTime: 0.2 + Math.random() * 0.3,
                x: p.x,
                y: p.y,
                mass: Math.random() * 2 + 5
            };
            _super.prototype.add.call(this, po, p);
            return po;
        };
        ChestParticles.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            this.gfx.blendMode = PIXI.BLEND_MODES.ADD;
            this.alwaysVisible = true;
        };
        ChestParticles.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        ChestParticles.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            //      pobj.y += 0.15;
            pobj.av = pobj.av * 0.8 + 0.2 * ((Math.random() + 1) / 100);
            pobj.angle += pobj.av;
            //TODO: slow place
            if (pobj.lifeTime < 0.2) {
                pobj.alpha = pobj.lifeTime / 0.2;
            }
            var a = 1 - Math.abs(this.polyLineProp - 0.5);
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
        };
        ChestParticles.prototype.process = function () {
            var prop = ((main_1._.time / 5) % 1450) / 1450;
            if (prop > 0.7) {
                for (var x = 0; x < this.polyLines.length; x++) {
                    var pp = (prop - 0.7) / 0.3;
                    if (x == 1) {
                        pp = Math.pow(pp, 1.5);
                    }
                    this.counter++;
                    if (this.counter % 2 == 0) {
                        this.polyLineProp = pp;
                        var pos = this.polyLines[x].getPoint(pp);
                        var p = this.addParticle(pos[0], pos[1]);
                        p.alpha = pp * 0.4;
                        this.counter++;
                    }
                    else {
                    }
                }
            }
            _super.prototype.process.call(this);
        };
        ChestParticles.prototype.addPath = function (pathObject) {
            this.polyLines.push(PolyLine.CreateFromString(pathObject.properties["polyline"], pathObject.pos));
        };
        return ChestParticles;
    }(BaseParticleSystem_1.BaseParticleSystem));
    exports.ChestParticles = ChestParticles;
    var DesirePS = /** @class */ (function (_super) {
        __extends(DesirePS, _super);
        function DesirePS() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.count = 0;
            _this.time = 0;
            _this.radius = 50;
            return _this;
        }
        DesirePS.prototype.addParticle = function (x, y) {
            var p = main_1._.cs('particlechest.png');
            p.x = x - this.pos[0];
            p.y = y - this.pos[1];
            //TODO: SLOW PART
            var baseScaleX = 0.15 - y / 240;
            var baseScaleY = 0.15 - y / 240;
            p.scale.x = baseScaleX;
            p.scale.y = baseScaleY;
            this.count++;
            var po = {
                alpha: 1,
                angle: (Math.PI / 2) * (this.count % 2),
                av: 0,
                baseScaleX: baseScaleX,
                baseScaleY: baseScaleY,
                v: [0, -Math.random() * 0.1 - 0.1],
                lifeTime: 0.2 + Math.random() * 0.3,
                x: p.x,
                y: p.y,
                mass: Math.random() * 2 + 5
            };
            _super.prototype.add.call(this, po, p);
            return po;
        };
        DesirePS.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            this.gfx.blendMode = PIXI.BLEND_MODES.ADD;
            this.alwaysVisible = true;
        };
        DesirePS.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        DesirePS.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            //      pobj.y += 0.15;
            pobj.av = pobj.av * 0.8 + 0.2 * ((Math.random() + 1) / 100);
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
        };
        DesirePS.prototype.process = function () {
            var px = main_1._.fMath.cos(this.time) * this.radius;
            var py = main_1._.fMath.sin(this.time) * this.radius;
            this.addParticle(px + this.time * (Math.random() - 0.5), py + this.time * (Math.random() - 0.5));
            this.addParticle(px + this.time * (Math.random() - 0.5), py + this.time * (Math.random() - 0.5));
            _super.prototype.process.call(this);
        };
        return DesirePS;
    }(BaseParticleSystem_1.BaseParticleSystem));
    exports.DesirePS = DesirePS;
});
