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
define(["require", "exports", "./Monster", "../main", "../Neu/Application", "../Neu/Math"], function (require, exports, Monster_1, main_1, Application_1, Math_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TOWER_EASE = window.CustomEase.create("custom", "M0,0,C0.126,0.382,0.351,0.72,0.5,0.878,0.682,1.07,0.818,1,1,1");
    var Tower = /** @class */ (function (_super) {
        __extends(Tower, _super);
        function Tower() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lastAngle = 0;
            return _this;
        }
        Tower.prototype.moveTo = function (d, coef) {
            if (coef === void 0) { coef = 1; }
            main_1._.game.occupy(d, this);
            var p = main_1._.game.getCellPoint(d.x, d.y);
            Application_1.TweenMax.to(this, 0.84 * coef, { x: p[0], y: p[1], ease: exports.TOWER_EASE });
            var defscale = this.gfx.scale.x;
            // TweenMax.to(this.gfx.scale, 0.25, {x: defscale*1.1, y: defscale*1.1, yoyo:true, repeat: 1});
        };
        Tower.prototype.init = function (props) {
            var _this = this;
            main_1._.rm.requestSpine(props.red ? "Spider_Red" : "Spider_final", function (data) {
                _this.gfx = new PIXI.heaven.spine.Spine(data);
                var l = Math.random();
                if (l < 0.3) {
                    _this.gfx.state.setAnimation(0, "Idle", true);
                }
                else if (l < 0.6) {
                    _this.gfx.state.setAnimation(0, "Idle2", true);
                }
                else
                    _this.gfx.state.setAnimation(0, "Idle3", true);
                _this.gfx.scale.set(0.12);
                _this.gfx.pivot.y = 1;
                _this.layer.addChild(_this.gfx);
                _this.setMyCell_noOCCUPY();
                _this.alignToCell();
                _super.prototype.init.call(_this, props);
                _this.emmit("loaded");
            });
            this.setMyCell_noOCCUPY();
            main_1._.game.occupy(this.cell, this);
        };
        Tower.prototype.getTowerMoves = function () {
            var x, y;
            var move;
            var end;
            for (var a = 0; a < 4; a++) {
                end = false;
                this.lastAngle += Math.PI / 2;
                var dx = Math.round(Math.cos(this.lastAngle));
                var dy = Math.round(Math.sin(this.lastAngle));
                for (x = this.cell.x + dx; true; x += dx) {
                    for (y = this.cell.y + dy; true; y += dy) {
                        if (!main_1._.game.inField(x, y)) {
                            end = true;
                            break;
                        }
                        if (main_1._.game.getCell([x, y]).isWall) {
                            end = true;
                            break;
                        }
                        if (main_1._.game.getCell([x, y]).OccupiedBy != null) {
                            end = true;
                            break;
                        }
                        if (dy == 0)
                            break;
                    }
                    if (end) {
                        break;
                    }
                    if (dx == 0)
                        break;
                }
                if (x - dx == this.cell.x && y - dy == this.cell.y) {
                }
                else {
                    move = [x - dx, y - dy];
                    break;
                }
            }
            if (move) {
                return main_1._.game.getCell(move);
            }
            else {
                return null;
            }
        };
        Tower.prototype.onPlayerMove = function () {
            if (this.dead) {
                return true;
            }
            var dest = this.tryHitPlayer();
            if (dest) {
                this.moveTo(dest, 2);
                this.gfx.state.setAnimation(0, "Blow", false);
                this.wait(0.3).call(function () {
                    main_1._.game.player.hitAnim();
                }).apply();
                main_1._.game.anim.block(0.4);
                return true;
            }
            else {
                var pm = this.getTowerMoves();
                if (pm) {
                    var cp = main_1._.game.getCellPoint(pm.x, pm.y);
                    main_1._.game.occupy(pm, this);
                    this.moveTo(this.cell);
                    //TweenMax.to(this, 0.2, {x: cp[0], y: cp[1]});
                    console.log("pawn have a move");
                    main_1._.game.anim.block(0.3);
                    return true;
                }
                return false;
            }
        };
        Tower.prototype.tryHitPlayer = function () {
            var dest;
            if (this.cell.x == main_1._.game.player.cell.x) {
                var dest_1 = this.checkPlayerOnLine(this.cell.y, this.cell.x, main_1._.game.player.cell.y, main_1._.game.player.cell.x, main_1._.game.player);
                if (dest_1) {
                    return dest_1;
                }
            }
            if (this.cell.y == main_1._.game.player.cell.y) {
                dest = this.checkPlayerOnLine(this.cell.y, this.cell.x, main_1._.game.player.cell.y, main_1._.game.player.cell.x, main_1._.game.player);
                if (dest) {
                    return dest;
                }
            }
            return null;
        };
        Tower.prototype.checkPlayerOnLine = function (y, x, y2, x2, player) {
            var killed = false;
            var dest = null;
            var i;
            var delta;
            if (y == y2) {
                delta = Math_1.m.sign(x2 - x);
                for (i = x + delta; true; i += delta) {
                    if (main_1._.game.inField(i, y)) {
                        if (main_1._.game.map[i][y].isWall) {
                            break;
                        }
                        if (main_1._.game.map[i][y].OccupiedBy == player) {
                            killed = true;
                        }
                        if (main_1._.game.map[i][y].OccupiedBy && main_1._.game.map[i][y].OccupiedBy != player) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            if (killed)
                return main_1._.game.map[i - delta][y];
            if (x == x2) {
                delta = Math_1.m.sign(y2 - y);
                for (i = y + delta; true; i += delta) {
                    if (main_1._.game.inField(x, i)) {
                        if (main_1._.game.map[x][i].isWall) {
                            break;
                        }
                        if (main_1._.game.map[x][i].OccupiedBy == player) {
                            killed = true;
                        }
                        if (main_1._.game.map[x][i].OccupiedBy && main_1._.game.map[x][i].OccupiedBy != player) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            if (killed)
                return main_1._.game.map[x][i - delta];
            return null;
        };
        return Tower;
    }(Monster_1.Monster));
    exports.Tower = Tower;
});
