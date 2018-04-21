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
define(["require", "exports", "../main", "../Neu/BaseObjects/BaseParticleSystem"], function (require, exports, main_1, BaseParticleSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PARTICLE_COUNT = 45;
    var FogParticleSystem = /** @class */ (function (_super) {
        __extends(FogParticleSystem, _super);
        function FogParticleSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.running = false;
            _this.spd = 1;
            return _this;
        }
        FogParticleSystem.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            var w = 100;
            var h = 200;
            this.doOProcess = false;
            for (var x = 0; x < PARTICLE_COUNT; x++) {
                var dx = (Math.random() - 0.5);
                var dy = (Math.random() - 0.5);
                var x_1 = dx * w;
                var y = dy * h;
                var mlt = 9999999999;
                var p = main_1._.cs(this.particle);
                p.rotation = Math.random() * Math.PI * 2;
                this.add({
                    br: Math.random() * Math.PI,
                    vx: dx * 2,
                    vy: dy * 2,
                    alpha: 0.8,
                    angle: Math.random() * Math.PI * 2,
                    speed: (Math.random() + 0.4) * this.spd,
                    x: x_1,
                    y: y,
                    a: (Math.random() - 0.5) * 0.04,
                    lifeTime: mlt,
                }, p);
            }
        };
        FogParticleSystem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        FogParticleSystem.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            if (this.running) {
                pobj.vx = Math.abs(pobj.vx) * 1.1; // - (_.sm.camera.offset[0]);
                p.scale.x *= 0.98;
                p.scale.y *= 0.98;
                if (pobj.lifeTime < 0.5) {
                    pobj.alpha = pobj.lifeTime / 0.5;
                }
                p.rotation += pobj.a * p.alpha;
            }
            else {
                p.rotation += pobj.a / 10.;
                pobj.angle += pobj.speed / 2;
                pobj.vx = main_1._.fMath.cos(pobj.angle) * pobj.speed;
                pobj.vy = main_1._.fMath.sin(pobj.angle) * pobj.speed;
                p.scale.x += pobj.vx / 20;
                p.scale.y += pobj.vy / 20;
                p.scale.x = 1 * 0.8 + p.scale.x * 0.2;
                p.scale.y = 1 * 0.8 + p.scale.y * 0.2;
            }
            pobj.x += pobj.vx;
            pobj.y += pobj.vy;
            p.alpha = pobj.alpha;
            p.x = pobj.x; // - (_.sm.camera.offset[0]);
            p.y = pobj.y; // - (_.sm.camera.offset[1]);
        };
        FogParticleSystem.prototype.process = function () {
            _super.prototype.process.call(this);
        };
        FogParticleSystem.prototype.runAndKill = function () {
            this.running = true;
            var max = 0;
            for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
                var x = _a[_i];
                var mlt = Math.random() * 0.3 + 0.6;
                x.lifeTime = mlt;
                max = Math.max(mlt, max);
            }
            this.wait(max).kill().apply();
        };
        return FogParticleSystem;
    }(BaseParticleSystem_1.BaseParticleSystem));
    exports.FogParticleSystem = FogParticleSystem;
});
