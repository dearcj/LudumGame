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
define(["require", "exports", "./Monster", "../main", "../Neu/Math", "../Neu/Application"], function (require, exports, Monster_1, main_1, Math_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HIT_CELLS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    var Pawn = /** @class */ (function (_super) {
        __extends(Pawn, _super);
        function Pawn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Pawn.prototype.getPawnMove = function () {
            var delta = [0, 0];
            var dx = main_1._.game.player.cell.x - this.cell.x;
            var dy = main_1._.game.player.cell.y - this.cell.y;
            var possible = [];
            possible.push([this.cell.x - 1, this.cell.y]);
            possible.push([this.cell.x, this.cell.y + 1]);
            possible.push([this.cell.x + 1, this.cell.y]);
            possible.push([this.cell.x, this.cell.y - 1]);
            possible = this.removeBlocked(possible);
            possible = this.removeWrongDirection(possible);
            if (possible.length > 0) {
                return main_1._.game.getCell(Math_1.m.getRand(possible));
            }
            else {
                return null;
            }
        };
        Pawn.prototype.onPlayerMove = function () {
            if (this.dead) {
                return true;
            }
            if (this.tryHitPlayer()) {
                return true;
            }
            else {
                var pm = this.getPawnMove();
                if (pm) {
                    var cp = main_1._.game.getCellPoint(pm.x, pm.y);
                    main_1._.game.occupy(pm, this);
                    Application_1.TweenMax.to(this, 0.2, { x: cp[0], y: cp[1] });
                    console.log("pawn have a move");
                    main_1._.game.anim.block(0.15);
                    return true;
                }
                return false;
            }
        };
        Pawn.prototype.init = function (props) {
            var _this = this;
            this.setMyCell_noOCCUPY();
            main_1._.game.occupy(this.cell, this);
            main_1._.rm.requestSpine("Slime", function (data) {
                _this.gfx = new PIXI.heaven.spine.Spine(data);
                _this.gfx.scale.set(0.01);
                Application_1.TweenMax.to(_this.gfx.scale, 0.5, { x: 0.13, y: 0.13 });
                _this.gfx.state.setAnimation(0, "Idle", true);
                _this.gfx.pivot.y = 1;
                _this.layer.addChild(_this.gfx);
                _this.alignToCell();
                _super.prototype.init.call(_this, props);
                _this.process();
            });
        };
        Pawn.prototype.removeBlocked = function (possible) {
            var res = [];
            for (var _i = 0, possible_1 = possible; _i < possible_1.length; _i++) {
                var x = possible_1[_i];
                if (main_1._.game.canMoveHere(x[0], x[1])) {
                    res.push(x);
                }
            }
            return res;
        };
        Pawn.prototype.removeWrongDirection = function (possible) {
            var res = [];
            for (var _i = 0, possible_2 = possible; _i < possible_2.length; _i++) {
                var x = possible_2[_i];
                if ((Math.abs(main_1._.game.player.cell.x - this.cell.x) >
                    Math.abs(main_1._.game.player.cell.x - x[0])) ||
                    (Math.abs(main_1._.game.player.cell.y - this.cell.y) >
                        Math.abs(main_1._.game.player.cell.y - x[1]))) {
                    res.push(x);
                }
            }
            return res;
        };
        Pawn.prototype.tryHitPlayer = function () {
            for (var _i = 0, HIT_CELLS_1 = HIT_CELLS; _i < HIT_CELLS_1.length; _i++) {
                var x = HIT_CELLS_1[_i];
                var xx = [x[0] + this.cell.x, x[1] + this.cell.y];
                if (main_1._.game.inField(xx[0], xx[1])) {
                    var cell = main_1._.game.getCell(xx);
                    if (cell.OccupiedBy == main_1._.game.player) {
                        this.hitAnimation(cell);
                        this.gfx.state.setAnimation(0, "Blow", false);
                        main_1._.game.player.wait(0.1).call(function () {
                            main_1._.game.player.hitAnim();
                        }).apply();
                        main_1._.game.player.takeDamage(1);
                        return true;
                    }
                }
            }
            return false;
        };
        Pawn.prototype.hitAnimation = function (cell) {
            console.log("HIT PLAYER!!!");
            var dest = main_1._.game.getCellPoint(cell.x, cell.y);
            Application_1.TweenMax.to(this, 0.3, { x: dest[0], y: dest[1], repeat: 1, yoyo: true });
        };
        return Pawn;
    }(Monster_1.Monster));
    exports.Pawn = Pawn;
});
