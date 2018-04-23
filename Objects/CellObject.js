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
define(["require", "exports", "../Neu/BaseObjects/O", "../main"], function (require, exports, O_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellObject = /** @class */ (function (_super) {
        __extends(CellObject, _super);
        function CellObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.reactOnMove = false;
            return _this;
        }
        CellObject.prototype.onTurnEnd = function () {
        };
        CellObject.prototype.setMyCell_noOCCUPY = function () {
            var cellcoord = main_1._.game.getObjectCell(this);
            this.cell = main_1._.game.map[cellcoord[0]][cellcoord[1]];
        };
        CellObject.prototype.onPlayerMovePriority = function () {
        };
        CellObject.prototype.onPlayerMove = function () {
            return true;
        };
        CellObject.prototype.setCell = function (cell) {
            this.cell = cell;
            this.alignToCell();
        };
        CellObject.prototype.alignToCell = function () {
            if (this.cell) {
                var cp = main_1._.game.getCellPoint(this.cell.x, this.cell.y);
                this.pos[0] = cp[0];
                this.pos[1] = cp[1];
            }
            this.process();
        };
        return CellObject;
    }(O_1.O));
    exports.CellObject = CellObject;
});
