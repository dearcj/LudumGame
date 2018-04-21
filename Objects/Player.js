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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../Neu/Math", "../Neu/Application"], function (require, exports, O_1, main_1, Math_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellObject = /** @class */ (function (_super) {
        __extends(CellObject, _super);
        function CellObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.reactOnMove = false;
            return _this;
        }
        CellObject.prototype.onTurnEnd = function () {
        };
        CellObject.prototype.setMyCell_noOCCUPY = function () {
            var cellcoord = main_1._.game.getObjectCell(this);
            this.cell = main_1._.game.map[cellcoord[0]][cellcoord[1]];
        };
        CellObject.prototype.onPlayerMove = function () {
            return true;
        };
        CellObject.prototype.setCell = function (cell) {
            this.cell = cell;
            this.alignToCell();
        };
        CellObject.prototype.alignToCell = function () {
            if (this.cell) {
                var cp = main_1._.game.getCellPoint(this.cell.x, this.cell.y);
                this.pos[0] = cp[0];
                this.pos[1] = cp[1];
            }
            main_1._.sm.camera.updateTransform(this, this.gfx);
        };
        return CellObject;
    }(O_1.O));
    exports.CellObject = CellObject;
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Player.prototype.hitAnim = function () {
            main_1._.pa.DamageTint(this, 0.2);
        };
        Player.prototype.init = function (props) {
            this.gfx = main_1._.cs("hero_horse", this.layer);
            //create gfx here
            this.setMyCell_noOCCUPY();
            main_1._.game.occupy(this.cell, this);
            _super.prototype.init.call(this, props);
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
            var _this = this;
            var oldX = this.cell.x;
            var oldY = this.cell.y;
            main_1._.game.anim.do(function () {
                var dx = -Math_1.m.sign(oldX - dest.x);
                var dy = -Math_1.m.sign(oldY - dest.y);
                var animateTilesUnder = function (cx, cy) {
                };
                var cx = oldX;
                var cy = oldY;
                var path = [];
                for (var j = 0; j < 5; j++) {
                    if (cx != dest.x) {
                        cx += dx;
                        path.push(main_1._.game.getCellPoint(cx, cy));
                        animateTilesUnder(cx, cy);
                        continue;
                    }
                    if (cy != dest.y) {
                        cy += dy;
                        path.push(main_1._.game.getCellPoint(cx, cy));
                        animateTilesUnder(cx, cy);
                        continue;
                    }
                }
                var t1 = new Application_1.TimelineMax();
                var counter = 0;
                for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                    var p = path_1[_i];
                    counter++;
                    t1.to(_this, 0.15 + counter * 0.05, { x: p[0], y: p[1] });
                }
            }, 1.2);
        };
        return Player;
    }(CellObject));
    exports.Player = Player;
});
