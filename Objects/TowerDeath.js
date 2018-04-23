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
define(["require", "exports", "./Tower", "../main", "../Neu/Application"], function (require, exports, Tower_1, main_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TowerDeath = /** @class */ (function (_super) {
        __extends(TowerDeath, _super);
        function TowerDeath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TowerDeath.prototype.init = function (p) {
            var _this = this;
            this.layer = main_1._.sm.stage.layers['main'];
            _super.prototype.init.call(this, p);
            this.on("loaded").call(function () {
                _this.alignToCell();
                var prev = _this.gfx.scale.x;
                _this.gfx.scale.x = 0;
                _this.gfx.scale.y = 0;
                Application_1.TweenMax.to(_this.gfx.scale, 0.5, { x: prev, y: prev, ease: Application_1.Power1.easeOuts });
            }).apply();
        };
        return TowerDeath;
    }(Tower_1.Tower));
    exports.TowerDeath = TowerDeath;
});
