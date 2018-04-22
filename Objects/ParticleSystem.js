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
    var ParticleSystem = /** @class */ (function (_super) {
        __extends(ParticleSystem, _super);
        function ParticleSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wind = [0, 0];
            _this.includeWind = false;
            _this.partScale = [1, 1];
            return _this;
        }
        ParticleSystem.prototype.addParticle = function (x, y) {
            var s = "part1";
            if (Math.random() > 0.5) {
                s = "part2";
            }
            var p = main_1._.cm(s);
            p.x = x - this.pos[0];
            p.y = y - this.pos[1];
            //TODO: SLOW PART
            var baseScaleX = 0.3 + Math.random() * 0.8;
            var baseScaleY = 0.3 + Math.random() * 0.8;
            p.scale.x = baseScaleX;
            p.scale.y = baseScaleY;
            var po = {
                alpha: 1,
                av: 0,
                baseScaleX: 2 * baseScaleX,
                baseScaleY: 2 * baseScaleY,
                v: [0, 0],
                lifeTime: 20 + 22 * Math.random(),
                x: p.x,
                y: p.y,
                angle: Math.random() * Math.PI * 2,
                mass: Math.random() * 2 + 5
            };
            _super.prototype.add.call(this, po, p);
            return po;
        };
        ParticleSystem.prototype.init = function (props) {
            var _this = this;
            this.pos[0] -= main_1._.screenCenterOffset[0];
            this.pos[1] -= main_1._.screenCenterOffset[1];
            _super.prototype.init.call(this, props);
            this.gfx.width = main_1._.SCR_WIDTH;
            this.gfx.height = main_1._.SCR_HEIGHT;
            this.wind = [0, 0];
            var addPart = function (fixy) {
                if (fixy === void 0) { fixy = 0; }
                _this.addParticle(_this.pos[0] + Math.random() * main_1._.SCR_WIDTH, _this.pos[1] + main_1._.screenCenterOffset[1] + 50 + fixy);
            };
            this.setInterval(function () {
                addPart(Math.random() * 1200);
            }, 0.8);
            for (var x = 0; x < 50; x++) {
                addPart(Math.random() * 1200);
            }
            this.includeWind = true;
            for (var x = 0; x < 30; x++) {
                this.processParticles(0.5);
            }
            this.process();
        };
        ParticleSystem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        ParticleSystem.prototype.explode = function (p) {
            var sqdist = 450 * 450;
            for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
                var x = _a[_i];
                var part = x;
                var worldx = this.pos[0] + x.x - main_1._.SCR_WIDTH / 2;
                var worldy = this.pos[1] + x.y - main_1._.SCR_HEIGHT / 2;
                var sqd = ((p[0] - worldx) * (p[0] - worldx) +
                    (p[1] - worldy) * (p[1] - worldy));
                if (sqd < sqdist) {
                    var d = Math.sqrt(sqd);
                    var dx = (p[0] - worldx) / d;
                    var dy = (p[1] - worldy) / d;
                    var power = 0 + 2000 / (d + 100);
                    part.v[0] -= power * dx;
                    part.v[1] -= power * dy;
                }
            }
        };
        ParticleSystem.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            pobj.y += 0.15;
            var v = Math_1.m.rv2(this.wind, pobj.angle);
            pobj.av = pobj.av * 0.8 + 0.2 * ((Math.random() + 1) / 100);
            pobj.angle += pobj.av;
            //TODO: slow place
            var dx = main_1._.fMath.cos(pobj.angle);
            var dy = main_1._.fMath.sin(pobj.angle);
            pobj.alpha = (dy + 1) * 0.5;
            if (dy > 0.2 && dy < 0.35) {
                p.gotoAndStop(2);
            }
            else if (dy > 0 && dy < 0.5) {
                p.gotoAndStop(1);
            }
            else
                p.gotoAndStop(0);
            if (p.lifeTime < 0.1) {
                pobj.alpha = pobj.lifeTime / 0.1;
            }
            p.alpha = pobj.alpha;
            p.scale.x = pobj.baseScaleX * (1 + dx * 0.3) * this.partScale[0];
            p.scale.y = pobj.baseScaleY * (1 + dy * 0.3) * this.partScale[1];
            pobj.v[0] = pobj.v[0] * 0.8 + v[0] * 0.2;
            pobj.v[1] = pobj.v[1] * 0.8 + v[1] * 0.2;
            if (this.includeWind) {
                pobj.v[0] += this.wind[0] * 0.12;
                pobj.v[1] += this.wind[1] * 0.12;
            }
            pobj.x += (pobj.v[0] / pobj.mass) * delta;
            pobj.y += (pobj.v[1] / pobj.mass) * delta;
            p.x = pobj.x; // - (_.sm.camera.offset[0]);
            p.y = pobj.y; // - (_.sm.camera.offset[1]);
            pobj.y += (main_1._.SCR_HEIGHT - p.y) / 10000;
            this.alwaysVisible = true;
        };
        ParticleSystem.prototype.process = function () {
            this.wind[0] = main_1._.fMath.cos(main_1._.time / 4000) * 60.8;
            this.wind[1] = main_1._.fMath.sin(main_1._.time / 4000) * 15.8;
            _super.prototype.process.call(this);
        };
        return ParticleSystem;
    }(BaseParticleSystem_1.BaseParticleSystem));
    exports.ParticleSystem = ParticleSystem;
});
