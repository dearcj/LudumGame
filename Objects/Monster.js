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
define(["require", "exports", "../main", "../Neu/Application", "./ActiveCellObject"], function (require, exports, main_1, Application_1, ActiveCellObject_1) {
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
            //O.rp(this.gfx);
            if (this.gfx) {
                Application_1.TweenMax.to(this, 0.3, { y: this.y + 3 });
                var def = this.gfx.scale.x;
                Application_1.TweenMax.to(this.gfx.scale, 0.3, { x: 0.8 * def, y: 0.7 * def });
                main_1._.pa.DamageTint(this, 0.3);
                this.wait(0.3).kill().apply();
                this.dead = true;
            }
        };
        return Monster;
    }(ActiveCellObject_1.ActiveCellObject));
    exports.Monster = Monster;
});
