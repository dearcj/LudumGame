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
define(["require", "exports", "./CellObject"], function (require, exports, CellObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeathPoint = /** @class */ (function (_super) {
        __extends(DeathPoint, _super);
        function DeathPoint() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DeathPoint.prototype.init = function (p) {
            this.setMyCell_noOCCUPY();
        };
        return DeathPoint;
    }(CellObject_1.CellObject));
    exports.DeathPoint = DeathPoint;
});
