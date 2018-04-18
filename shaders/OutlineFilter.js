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
    var OutlineFilter = /** @class */ (function (_super) {
        __extends(OutlineFilter, _super);
        function OutlineFilter(thickness, color) {
            if (thickness === void 0) { thickness = 3; }
            if (color === void 0) { color = 0xff00ff; }
            var _this = this;
            var shader = main_1._.rm.shaders['outline.frag'].replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7));
            _this = _super.call(this, main_1._.rm.shaders['outline.vert'], shader, {
                thickness: { type: '1f', value: 1 },
                outlineColor: { type: 'v4', value: { x: 0, y: 0, z: 0, w: 1 } },
            }) || this;
            _this.uniforms.thickness = thickness;
            _this.color = color;
            return _this;
        }
        Object.defineProperty(OutlineFilter.prototype, "color", {
            get: function () {
                return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
            },
            set: function (value) {
                PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
            },
            enumerable: true,
            configurable: true
        });
        return OutlineFilter;
    }(PIXI.Filter));
    exports.OutlineFilter = OutlineFilter;
});
