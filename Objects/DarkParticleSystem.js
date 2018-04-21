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
    var DarkParticleSystem = /** @class */ (function (_super) {
        __extends(DarkParticleSystem, _super);
        function DarkParticleSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DarkParticleSystem.prototype.addParticle = function (x, y, rnd) {
            var s = "particle1.png";
            var p = main_1._.cs(s);
            p.x = x - this.pos[0];
            p.y = y - this.pos[1];
            var baseScaleX = 1 + Math.random() * 0.4;
            var baseScaleY = 1 + Math.random() * 0.4;
            p.scale.x = baseScaleX;
            p.scale.y = baseScaleY;
            this.gfx.addChild(p);
            var lt = 10000000;
            var phase = 2 * Math.PI * Math.random();
            var particleObj = {
                baseScaleX: baseScaleX,
                baseScaleY: baseScaleY,
                v: [0, 0],
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
            baseScaleX = 1 + Math.random() * 0.4;
            baseScaleY = 1 + Math.random() * 0.4;
            p = main_1._.cs(s);
            p.x = x - this.pos[0] + 45 * (Math.random() - 0.5);
            p.y = y - this.pos[1] + 45 * (Math.random() - 0.5);
            p.blendMode = PIXI.BLEND_MODES.NORMAL;
            p.scale.x = baseScaleY;
            p.scale.y = baseScaleX;
            particleObj = {
                baseScaleX: baseScaleY,
                baseScaleY: baseScaleX,
                v: [0, 0],
                lifeTime: lt,
                x: p.x,
                y: p.y,
                alpha: 1,
                baseAlpha: 0.14 - rnd * 0.08,
                angle: Math.PI,
                av: (-1 + Math.random()) / 500.,
                windx: 0,
                windy: 0,
                phase: Math.PI - phase,
            };
            this.add(particleObj, p);
        };
        DarkParticleSystem.prototype.init = function (props) {
            var _this = this;
            this.pos[0] -= main_1._.screenCenterOffset[0];
            this.pos[1] -= main_1._.screenCenterOffset[1];
            _super.prototype.init.call(this, props);
            this.wind = [0, 0];
            var addPart = function () {
                var rnd = Math.random();
                _this.addParticle(Math.random() * main_1._.SCR_WIDTH + _this.pos[0], _this.pos[1] + rnd * 550, rnd);
            };
            for (var x = 0; x < 35; x++) {
                addPart();
            }
            this.process();
        };
        DarkParticleSystem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        DarkParticleSystem.prototype.explode = function (p) {
        };
        DarkParticleSystem.prototype.processParticle = function (i) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            var v = Math_1.m.rv2(this.wind, pobj.angle);
            pobj.angle += pobj.av;
            //TODO: slow place
            var deltaX = main_1._.fMath.cos(1.5 * pobj.angle + pobj.phase);
            var deltaY = main_1._.fMath.sin(1.5 * pobj.angle + pobj.phase);
            p.scale.x = pobj.baseScaleX * (1 + deltaX * 0.25);
            p.scale.y = pobj.baseScaleY * (1 + deltaY * 0.25);
            pobj.v[0] = pobj.v[0] * 0.8 + v[0] * 0.2;
            pobj.v[1] = pobj.v[1] * 0.8 + v[1] * 0.2;
            p.rotation = pobj.angle;
            p.alpha = 0.1 + deltaY * 0.05;
            pobj.windx *= 0.8;
            pobj.windy *= 0.8;
            var addwx = pobj.windx;
            var addwy = pobj.windy;
            p.x = pobj.x + addwx;
            p.y = pobj.y + addwy;
        };
        DarkParticleSystem.prototype.process = function () {
            this.wind[0] = Math.cos(main_1._.time / 4000) * 0.8;
            this.wind[1] = 0;
            _super.prototype.process.call(this);
        };
        return DarkParticleSystem;
    }(BaseParticleSystem_1.BaseParticleSystem));
    exports.DarkParticleSystem = DarkParticleSystem;
});
