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
define(["require", "exports", "../Neu/BaseObjects/Lighting", "../main", "../Neu/Application", "../Neu/BaseObjects/O"], function (require, exports, Lighting_1, main_1, Application_1, O_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Lighting2 = /** @class */ (function (_super) {
        __extends(Lighting2, _super);
        function Lighting2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.particles = [];
            return _this;
        }
        Lighting2.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.tween = main_1._.killTween(this.tween);
        };
        Lighting2.prototype.init = function (props) {
            var _this = this;
            _super.prototype.init.call(this, props);
            this.setInterval(function () {
                _this.addParticle();
            }, 0.5);
            for (var x = 0; x < 30; x++) {
                this.addParticle();
            }
            this.ambient.y += 250;
            this.ambient.scale.x *= 2;
            this.ambient.scale.y *= 2;
            //   this.tween = TweenMax.to(this.ambient.scale, 2, {x: 1.02, y: 1.02, yoyo: true, repeat: -1});
        };
        Lighting2.prototype.addParticle = function () {
            var _this = this;
            var p = main_1._.cs("fog1");
            p.alpha = 0.;
            p.scale.set(1 + Math.random() * (0.4 * Lighting2.POWER));
            p.color.setDark(0.1, 0., 0.);
            var delta = 90;
            var dir;
            if (Math.random() > 0.5) {
                p.x = 300 + this.ambient.width - Lighting2.POWER * (Math.random() * delta);
                dir = -1;
            }
            else {
                p.x = -300 + Lighting2.POWER * Math.random() * delta;
                dir = 1;
            }
            p.x -= 100;
            if (Math.random() > 0.5) {
                p.scale.x -= p.scale.x;
            }
            var tw = Application_1.TweenMax.to(p, 4, { alpha: 0.3, x: p.x + dir * Math.random() * 45, yoyo: true, repeat: 1, onComplete: function () {
                    _this.removeParticle(p);
                } });
            tw.progress(Math.random());
            p.y = 25 + 1.4 * Math.random() * this.ambient.height;
            this.ambientContainer.addChild(p);
        };
        Lighting2.prototype.removeParticle = function (p) {
            var inx = this.particles.indexOf(p);
            this.particles.splice(inx, 1);
            O_1.O.rp(p);
            Application_1.TweenMax.killTweensOf(p);
        };
        Lighting2.POWER = 1;
        return Lighting2;
    }(Lighting_1.Lighting));
    exports.Lighting2 = Lighting2;
});
