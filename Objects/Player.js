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
define(["require", "exports", "../main", "../Neu/Math", "../Neu/Application", "./ActiveCellObject", "./Tower"], function (require, exports, main_1, Math_1, Application_1, ActiveCellObject_1, Tower_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Player.prototype.hitAnim = function () {
            main_1._.pa.DamageTint(this, 0.2);
            main_1._.game.player.wait(0.6).call(function () {
                main_1._.game.restart();
            }).apply();
        };
        Player.prototype.process = function () {
            _super.prototype.process.call(this);
            this.light.x = this.x;
            this.light.y = this.y + 34;
        };
        Player.prototype.init = function (props) {
            var _this = this;
            this.gfx = main_1._.cs("hero_horse", this.layer);
            this.light = main_1._.sm.findOne("light1");
            //create gfx here
            this.setMyCell_noOCCUPY();
            var prevScaleX = this.light.gfx.scale.x;
            var prevScaleY = this.light.gfx.scale.y;
            this.light.gfx.scale.x = 0.1;
            this.light.gfx.scale.y = 0.1;
            Application_1.TweenMax.to(this.light.gfx.scale, 1.2, { delay: .5, x: prevScaleX, y: prevScaleY, ease: Tower_1.TOWER_EASE, onComplete: function () {
                    _this.light.isCandle = true;
                    _this.light.initSize = [_this.light.gfx.width, _this.light.gfx.height];
                } });
            main_1._.game.occupy(this.cell, this);
            var prevY = this.y;
            this.gfx.alpha = 0;
            this.y -= 500;
            Application_1.TweenMax.to(this, 1, { y: prevY, ease: Application_1.Power1.easeIn });
            Application_1.TweenMax.to(this.gfx, 1, { alpha: 1, ease: Application_1.Power1.easeIn });
            main_1._.game.anim.do(function () { }, 0.5);
            _super.prototype.init.call(this, props);
            this.process();
        };
        Player.prototype.getMoves = function () {
            var submoves = [
                [this.cell.x + 1, this.cell.y + 2],
                [this.cell.x + 2, this.cell.y + 1],
                [this.cell.x - 1, this.cell.y + 2],
                [this.cell.x - 2, this.cell.y + 1],
                [this.cell.x + 1, this.cell.y - 2],
                [this.cell.x + 2, this.cell.y - 1],
                [this.cell.x - 1, this.cell.y - 2],
                [this.cell.x - 2, this.cell.y - 1],
            ];
            var res = [];
            for (var _i = 0, submoves_1 = submoves; _i < submoves_1.length; _i++) {
                var x = submoves_1[_i];
                if (main_1._.game.inField(x[0], x[1])) {
                    if (!main_1._.game.getCell(x).isWall)
                        res.push(x);
                }
            }
            return res;
        };
        Player.prototype.takeDamage = function (dmg) {
            main_1._.game.fail = true;
            main_1._.game.over();
        };
        Player.prototype.moveTo = function (dest) {
            var oldX = this.cell.x;
            var oldY = this.cell.y;
            var dx = -Math_1.m.sign(oldX - dest.x);
            var dy = -Math_1.m.sign(oldY - dest.y);
            var tiles1 = main_1._.sm.collectObjectsOnLayer(main_1._.game.layers['tilefg']);
            var tiles2 = main_1._.sm.collectObjectsOnLayer(main_1._.game.layers['tilebg']);
            var res = tiles1.concat(tiles2);
            var animateTilesUnder = function (cx, cy, delay) {
                for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                    var x = res_1[_i];
                    if (x.tileColRow[0] == cx && x.tileColRow[1] == cy) {
                        Application_1.TweenMax.to(x, 0.15, { delay: delay, y: x.y + 12, yoyo: true, repeat: 1 });
                        Application_1.TweenMax.to(x.gfx.scale, 0.15, { delay: delay, x: 0.96, y: 0.96, yoyo: true, repeat: 1 });
                        var heaven = x.gfx;
                        Application_1.TweenMax.to(x.gfx.color, 0.2, { delay: delay, lightB: 1, lightG: 1, darkR: 0.2, darkG: 0.2, darkB: 0.2 });
                        Application_1.TweenMax.to(x.gfx.color, 0.5, { delay: delay + 0.2, lightB: 1, lightG: 1, darkR: 0., darkG: 0., darkB: 0. });
                    }
                }
            };
            var cx = oldX;
            var cy = oldY;
            var path = [];
            for (var j = 0; j < 5; j++) {
                if (cx != dest.x) {
                    cx += dx;
                    path.push([cx, cy]);
                    continue;
                }
                if (cy != dest.y) {
                    cy += dy;
                    path.push([cx, cy]);
                    continue;
                }
            }
            var t1 = new Application_1.TimelineMax();
            var counter = 0;
            var del = 0.;
            animateTilesUnder(oldX, oldY, 0);
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var p = path_1[_i];
                counter++;
                var pp = main_1._.game.getCellPoint(p[0], p[1]);
                var time = 0.15 + counter * 0.05;
                t1.to(this, time, { x: pp[0], y: pp[1] });
                del += time;
                animateTilesUnder(p[0], p[1], del * 0.75);
            }
            return 0.7;
        };
        return Player;
    }(ActiveCellObject_1.ActiveCellObject));
    exports.Player = Player;
});
