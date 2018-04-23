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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../Neu/Application", "./ActiveCellObject"], function (require, exports, O_1, main_1, Application_1, ActiveCellObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Monster = /** @class */ (function (_super) {
        __extends(Monster, _super);
        function Monster() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.dead = false;
            return _this;
        }
        Monster.prototype.die = function () {
            //this.gfx.parent.setChildIndex(this.gfx, 0);
            //    O.rp(this.gfx);
            //   _.game.layers['tilebg'].addChild(this.gfx);
            if (this.gfx) {
                //  TweenMax.to(this, 0.3, {y: this.y + 3});
                var def = this.gfx.scale.x;
                this.gfx.state.clearTrack(0);
                this.gfx.skeleton.setToSetupPose();
                Application_1.TweenMax.to(this.gfx.scale, 0.3, { x: 0.3 * def, y: 0.4 * def });
                //  TweenMax.to(this.gfx.skew, 0.1, {x: 0.05, yoyo: true, repeat: 1});
                // _.pa.DamageTint(this, 0.3);
                this.wait(0.4).kill().apply();
                this.dead = true;
            }
            var x = this.x;
            var y = this.y;
            main_1._.rm.requestSpine("Blood", function (d) {
                var o = new O_1.O([x, y + 70], new PIXI.heaven.spine.Spine(d));
                main_1._.game.layers['tilebg'].addChild(o.gfx);
                o.init({});
                o.gfx.scale.set(0.42);
                o.gfx.state.setAnimation(0, "animation", false);
                o.wait(1).kill().apply();
            });
        };
        return Monster;
    }(ActiveCellObject_1.ActiveCellObject));
    exports.Monster = Monster;
});
