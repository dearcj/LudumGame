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
define(["require", "exports", "../main", "./CellObject"], function (require, exports, main_1, CellObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrickyPlate = /** @class */ (function (_super) {
        __extends(TrickyPlate, _super);
        function TrickyPlate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.preRemove = false;
            return _this;
        }
        TrickyPlate.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            this.setMyCell_noOCCUPY();
        };
        TrickyPlate.prototype.onPlayerMovePriority = function () {
            if (this.preRemove) {
                this.die();
            }
            if (main_1._.game.player.cell == this.cell) {
                this.preRemove = true;
            }
            return true;
        };
        TrickyPlate.prototype.die = function () {
            this.preRemove = false;
            main_1._.pa.AffixDestroy(this.gfx);
            main_1._.game.anim.block(0.45);
            this.cell.isWall = true;
            this.wait(1.5).kill().apply();
        };
        return TrickyPlate;
    }(CellObject_1.CellObject));
    exports.TrickyPlate = TrickyPlate;
});
