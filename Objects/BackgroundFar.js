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
    /**
     * Created by KURWINDALLAS on 17.11.2014.
     */
    var BackgroundFar = /** @class */ (function (_super) {
        __extends(BackgroundFar, _super);
        function BackgroundFar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BackgroundFar.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            this.gfx.x = this.x + main_1._.screenCenterOffset[0];
            this.baseY = this.y;
        };
        BackgroundFar.prototype.process = function () {
            this.gfx.x = this.x + main_1._.screenCenterOffset[0] - main_1._.sm.camera.pos[0] / 10;
            this.gfx.y = this.baseY - main_1._.SCR_HEIGHT;
        };
        return BackgroundFar;
    }(O_1.O));
    exports.BackgroundFar = BackgroundFar;
});
