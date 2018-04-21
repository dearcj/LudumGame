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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../Neu/Math", "../Neu/Application"], function (require, exports, O_1, main_1, Math_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by KURWINDALLAS on 17.11.2014.
     */
    var Candle = /** @class */ (function (_super) {
        __extends(Candle, _super);
        function Candle() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.vx = 0.5;
            return _this;
        }
        Candle.prototype.init = function (props) {
            if (props === void 0) { props = null; }
            _super.prototype.init.call(this, props);
            this.skewx = -0.01;
            var tw3 = new Application_1.TweenMax(this, 0.2, { skewx: 0.01, yoyo: true, repeat: -1 });
            tw3.progress(Math.random());
            var initScale = [this.gfx ? this.gfx.scale.x : 1, this.gfx ? this.gfx.scale.y : 1];
            var inx = this.gfx ? this.gfx.parent.getChildIndex(this.gfx) : 0;
            O_1.O.rp(this.gfx);
            this.gfx = main_1._.cm("CandleAnim", null, false, [1, 1, 1.5, 1, 1.4, 1, 1]);
            this.gfx.animationSpeed = 0.018;
            this.gfx.scale.x = initScale[0];
            this.gfx.scale.y = initScale[1];
            this.layer.addChildAt(this.gfx, inx);
            this.gfx.gotoAndPlay(Math_1.m.rint(0, this.gfx.totalFrames - 1));
        };
        Candle.prototype.process = function () {
            this.gfx.skew.x = this.skewx;
            _super.prototype.process.call(this);
        };
        Candle.prototype.onDestroy = function () {
            Application_1.TweenMax.killTweensOf(this.gfx.scale);
            Application_1.TweenMax.killTweensOf(this);
            _super.prototype.onDestroy.call(this);
        };
        return Candle;
    }(O_1.O));
    exports.Candle = Candle;
});
