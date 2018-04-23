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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "./CellObject", "../Neu/BaseObjects/Light"], function (require, exports, O_1, main_1, CellObject_1, Light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Exit = /** @class */ (function (_super) {
        __extends(Exit, _super);
        function Exit() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Exit.prototype.init = function (p) {
            var _this = this;
            this.setMyCell_noOCCUPY();
            this.light = new Light_1.Light([this.x, this.y]);
            this.light.gfx = main_1._.cs("lightness", main_1._.game.layers['lighting']);
            this.light.init({ candle: true });
            this.layer = main_1._.game.layers['tilebg'];
            main_1._.rm.requestSpine("Teleport", function (data) {
                _this.gfx = new PIXI.heaven.spine.Spine(data);
                _this.gfx.scale.set(0.45);
                _this.gfx.state.setAnimation(0, "animation", true);
                _this.process();
                _this.layer.addChild(_this.gfx);
            });
            /* this.wait(0.05).call(()=>{
                 let part: ParticleSystem = <ParticleSystem >_.sm.findOne("ps1");
                 this.setInterval(()=>{
                     let p = part.addParticle(this.x + (Math.random() - 0.5)*50, this.y + (Math.random() - 0.5)*50);
                     p.v[1] = -261  - Math.random()*266;
                     p.lifeTime *= 0.3;
                 }, 0.4);
     
             }).apply();*/
            _super.prototype.init.call(this);
        };
        Exit.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.light = O_1.O.rp(this.light);
        };
        Exit.prototype.onPlayerMovePriority = function () {
            if (main_1._.game.player.cell == this.cell) {
                main_1._.game.win = true;
                this.wait(0.2).call(function () {
                    main_1._.game.next();
                }).apply();
            }
            return true;
        };
        return Exit;
    }(CellObject_1.CellObject));
    exports.Exit = Exit;
});
