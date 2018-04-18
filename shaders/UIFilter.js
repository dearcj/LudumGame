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
define(["require", "exports", "../main"], function (require, exports, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIFilter = /** @class */ (function (_super) {
        __extends(UIFilter, _super);
        function UIFilter() {
            var _this = _super.call(this, main_1._.rm.shaders['default.vert'], main_1._.rm.shaders['uifilter.frag'], {
                center: { type: 'v2', value: { x: 0.5, y: 0.5 } },
                params: { type: 'v3', value: { x: 10, y: 0.8, z: 0.1 } },
                time: { type: '1f', value: 1 }
            }) || this;
            _this.center = [0.35, 0.35];
            _this.params = [8, .35, 0.15];
            return _this;
            //this.time = 1;
        }
        Object.defineProperty(UIFilter.prototype, "center", {
            get: function () {
                return this.uniforms.center;
            },
            set: function (value) {
                this.uniforms.center = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIFilter.prototype, "params", {
            get: function () {
                return this.uniforms.params;
            },
            set: function (value) {
                this.uniforms.params = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIFilter.prototype, "time", {
            get: function () {
                return this.uniforms.time;
            },
            set: function (value) {
                this.uniforms.time = value;
            },
            enumerable: true,
            configurable: true
        });
        return UIFilter;
    }(PIXI.Filter));
    exports.UIFilter = UIFilter;
});
