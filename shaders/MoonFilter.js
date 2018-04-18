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
    var MoonFilter = /** @class */ (function (_super) {
        __extends(MoonFilter, _super);
        function MoonFilter() {
            var _this = _super.call(this, main_1._.rm.shaders['default.vert'], main_1._.rm.shaders['moon.frag'], {
                resxy: { type: 'v2', value: { x: 800, y: 600 } },
                time: { type: '1f', value: main_1._.time }
            }) || this;
            _this.uniforms.time = 0;
            return _this;
        }
        Object.defineProperty(MoonFilter.prototype, "time", {
            get: function () {
                return this.uniforms.time;
            },
            set: function (value) {
                this.uniforms.time = value;
            },
            enumerable: true,
            configurable: true
        });
        return MoonFilter;
    }(PIXI.Filter));
    exports.MoonFilter = MoonFilter;
});
