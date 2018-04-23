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
define(["require", "exports", "../main", "../Neu/Math", "../Neu/Application", "./ActiveCellObject", "./Tower", "./JumpRock"], function (require, exports, main_1, Math_1, Application_1, ActiveCellObject_1, Tower_1, JumpRock_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Player.prototype.hitAnim = function () {
            main_1._.game.fail = true;
            main_1._.pa.DamageTint(this, 0.2);
            this.gfx.state.setAnimation(0, "Dead", false);
            main_1._.game.player.wait(0.6).call(function () {
                main_1._.game.restart();
            }).apply();
        };
        Player.prototype.process = function () {
            _super.prototype.process.call(this);
            if (this.light) {
                this.light.x = this.x;
                this.light.y = this.y + 34;
            }
        };
        Player.prototype.init = function (props) {
            var _this = this;
            main_1._.rm.requestSpine("Horse", function (data) {
                _this.gfx = new PIXI.heaven.spine.Spine(data);
                _this.gfx.scale.set(0.12);
                _this.wait(0.73).call(function () {
                    _this.gfx.state.setAnimation(0, "Appear", false);
                });
                _this.wait(1).call(function () {
                    _this.gfx.state.setAnimation(0, "Idle", true);
                }).apply();
                _this.gfx.pivot.y = 1;
                _this.process();
                _this.layer.addChild(_this.gfx);
                _this.setMyCell_noOCCUPY();
                main_1._.game.occupy(_this.cell, _this);
                var prevY = _this.y;
                _this.gfx.alpha = 0;
                _this.y -= 500;
                Application_1.TweenMax.to(_this, 0.8, { y: prevY, ease: Application_1.Power1.easeIn });
                Application_1.TweenMax.to(_this.gfx, 1, { alpha: 1, ease: Application_1.Power1.easeIn });
                _this.light = main_1._.sm.findOne("light1");
                //create gfx here
                var prevScaleX = _this.light.gfx.scale.x;
                var prevScaleY = _this.light.gfx.scale.y;
                _this.light.gfx.scale.x = 0.1;
                _this.light.gfx.scale.y = 0.1;
                Application_1.TweenMax.to(_this.light.gfx.scale, 1.2, {
                    delay: 0., x: prevScaleX, y: prevScaleY, ease: Tower_1.TOWER_EASE, onComplete: function () {
                        _this.light.isCandle = true;
                        _this.light.initSize = [_this.light.gfx.width, _this.light.gfx.height];
                    }
                });
                _super.prototype.init.call(_this, props);
                main_1._.sm.camera.wait(1).call(function () {
                    main_1._.game.setPlayerTurn();
                }).apply();
                main_1._.game.anim.do(function () {
                }, 0.5);
            });
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
        Player.prototype.rockJumps = function (cx, cy) {
            var rocks = main_1._.sm.findByType(JumpRock_1.JumpRock);
            var pos = main_1._.game.getCellPoint(cx, cy);
            for (var _i = 0, rocks_1 = rocks; _i < rocks_1.length; _i++) {
                var x = rocks_1[_i];
                var dd = Math_1.m.sqdist(pos, x.pos);
                var d = Math.sqrt(dd);
                x.SmallJump(d / 300);
            }
        };
        Player.prototype.moveTo = function (dest) {
            var _this = this;
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
                        //x.gfx.scale.x = 0.5;
                        //x.gfx.scale.y = 0.5;
                        Application_1.TweenMax.to(x, 0.15, { delay: delay, y: x.y + 12, yoyo: true, repeat: 1 });
                        Application_1.TweenMax.to(x.gfx.scale, 0.15, { delay: delay, x: 0.96, y: 0.96, yoyo: true, repeat: 1 });
                        var heaven = x.gfx;
                        Application_1.TweenMax.to(x.gfx.color, 0.2, {
                            delay: delay,
                            lightB: 1,
                            lightG: 1,
                            darkR: 0.4,
                            darkG: 0.4,
                            darkB: 0.3
                        });
                        Application_1.TweenMax.to(x.gfx.color, 0.5, {
                            delay: delay + 0.2,
                            lightB: 1,
                            lightG: 1,
                            darkR: 0.,
                            darkG: 0.,
                            darkB: 0.
                        });
                    }
                }
                _this.wait(delay).call(function () {
                    //this.shakeNearbyTiles(res, cx, cy);
                    _this.rockJumps(cx, cy);
                }).apply();
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
            if (dx < 0) {
                this.gfx.scale.x = Math.abs(this.gfx.scale.x);
            }
            if (dx > 0) {
                this.gfx.scale.x = -Math.abs(this.gfx.scale.x);
            }
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
        Player.prototype.shakeNearbyTiles = function (res, cx, cy) {
            for (var dx = -2; dx <= 2; dx++) {
                for (var dy = -2; dy <= 2; dy++) {
                    for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
                        var j = res_2[_i];
                        if (j.tileColRow[0] == cx + dx &&
                            j.tileColRow[1] == cy + dy) {
                            if (main_1._.game.inField(cx + dx, cy + dy)) {
                                if (main_1._.game.getCell([cx + dx, cy + dy]).isWall)
                                    continue;
                                main_1._.killTweensOf(j);
                                Application_1.TweenMax.to(j, 0.15, {
                                    y: j.y + 2, yoyo: true, repeat: 1
                                });
                            }
                        }
                    }
                }
            }
        };
        return Player;
    }(ActiveCellObject_1.ActiveCellObject));
    exports.Player = Player;
});
