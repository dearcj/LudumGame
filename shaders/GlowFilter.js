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
    var GlowFilter = /** @class */ (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(distance, outerStrength, innerStrength, color, quality) {
            if (distance === void 0) { distance = 10; }
            if (outerStrength === void 0) { outerStrength = 4; }
            if (innerStrength === void 0) { innerStrength = 0; }
            if (color === void 0) { color = 0xffffff; }
            if (quality === void 0) { quality = 0.1; }
            var _this = this;
            var shader = main_1._.rm.shaders['glow.frag'].replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7)).replace(/%DIST%/gi, '' + distance.toFixed(7));
            //console.log(shader);
            _this = _super.call(this, main_1._.rm.shaders['default.vert'], shader, {
                distance: { type: '1f', value: 1 },
                glowColor: { type: 'v4', value: { x: 0, y: 0, z: 0, w: 1 } },
                outerStrength: { type: '1f', value: 1 },
                innerStrength: { type: '1f', value: 1 },
            }) || this;
            _this.distance = distance;
            _this.color = color;
            _this.outerStrength = outerStrength;
            _this.innerStrength = innerStrength;
            return _this;
        }
        Object.defineProperty(GlowFilter.prototype, "color", {
            /**
             * The color of the glow.
             * @member {number}
             * @default 0xFFFFFF
             */
            get: function () {
                return PIXI.utils.rgb2hex(this.uniforms.glowColor);
            },
            set: function (value) {
                PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "distance", {
            /**
             * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
             * @member {number}
             * @default 10
             */
            get: function () {
                return this.uniforms.distance;
            },
            set: function (value) {
                this.uniforms.distance = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "outerStrength", {
            /**
             * The strength of the glow outward from the edge of the sprite.
             * @member {number}
             * @default 4
             */
            get: function () {
                return this.uniforms.outerStrength;
            },
            set: function (value) {
                this.uniforms.outerStrength = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "innerStrength", {
            /**
             * The strength of the glow inward from the edge of the sprite.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this.uniforms.innerStrength;
            },
            set: function (value) {
                this.uniforms.innerStrength = value;
            },
            enumerable: true,
            configurable: true
        });
        return GlowFilter;
    }(PIXI.Filter));
    exports.GlowFilter = GlowFilter;
});
