import {Monster} from "./Monster";
import {_} from "../main";
import {CustomEase, Elastic, Power2, Power3, TweenMax} from "../Neu/Application";
import {m, Vec2} from "../Neu/Math";
import {MapCell} from "../Stages/Game";
import {ActiveCellObject} from "./ActiveCellObject";
import {DEF_EVENTS} from "../Neu/BaseObjects/O";
export const TOWER_EASE = (<any>window).CustomEase.create("custom",
    "M0,0,C0.126,0.382,0.351,0.72,0.5,0.878,0.682,1.07,0.818,1,1,1"
);

export class Tower extends Monster {
    lastAngle: number = 0;

    moveTo(d: MapCell, coef: number = 1): any {
        _.game.occupy(d, this);
        let p = _.game.getCellPoint(d.x, d.y);
        TweenMax.to(this, 0.84*coef, {x: p[0], y: p[1], ease: TOWER_EASE});
        let defscale = this.gfx.scale.x;
       // TweenMax.to(this.gfx.scale, 0.25, {x: defscale*1.1, y: defscale*1.1, yoyo:true, repeat: 1});
    }

    init(props: any): any {
        _.rm.requestSpine(props.red ? "Spider_Red":"Spider_final", (data)=> {
            this.gfx = new PIXI.heaven.spine.Spine(data);
            let l = Math.random();
            if (l < 0.3) {
                this.gfx.state.setAnimation(0, "Idle", true);
            } else
            if (l < 0.6) {
                this.gfx.state.setAnimation(0, "Idle2", true);
            } else
                this.gfx.state.setAnimation(0, "Idle3", true);

            this.gfx.scale.set(0.12);
            this.gfx.pivot.y = 1;
            this.layer.addChild(this.gfx);
            this.setMyCell_noOCCUPY();
            this.alignToCell();
            super.init(props);
            this.emmit("loaded");
        });

        this.setMyCell_noOCCUPY();
        _.game.occupy(this.cell, this);
    }

    getTowerMoves(): MapCell {
        let x, y: number;
        let move: Vec2;
        let end;
        for (let a = 0; a < 4; a++) {
            end = false;
            this.lastAngle += Math.PI / 2;
            let dx = Math.round(Math.cos(this.lastAngle));
            let dy = Math.round(Math.sin(this.lastAngle));
            for (x = this.cell.x + dx; true; x += dx) {
            for (y = this.cell.y + dy; true; y += dy) {
                if (!_.game.inField(x, y)) {
                    end = true;
                    break;
                }
                if (_.game.getCell([x, y]).isWall) {
                    end = true;
                    break;
                }

                if (_.game.getCell([x, y]).OccupiedBy != null) {
                    end = true;
                    break;
                }
                if (dy == 0) break;
            }


            if (end) {
                break;
            }
            if (dx == 0) break;
        }

        if (x - dx == this.cell.x && y- dy == this.cell.y) {
        } else {
            move = [x - dx, y - dy];
            break;
        }
        }
        if (move) {
            return _.game.getCell(move)
        } else {
            return null;
        }
    }

    onPlayerMove(): boolean {
        if (this.dead) {
            return true;
        }
        let dest = this.tryHitPlayer();
        if (dest) {
                this.moveTo(dest, 2);
                this.gfx.state.setAnimation(0, "Blow", false);
                this.wait(0.3).call(()=>{
                    _.game.player.hitAnim();
                }).apply();

            _.game.anim.block(0.4);
            return true;
        } else {

            let pm = this.getTowerMoves();
            if (pm) {
                let cp = _.game.getCellPoint(pm.x, pm.y);
                _.game.occupy(pm, this);
                this.moveTo(this.cell);

                //TweenMax.to(this, 0.2, {x: cp[0], y: cp[1]});
                console.log("pawn have a move");
                _.game.anim.block(0.3);
                return true;
            }
            return false;
        }
    }

    private tryHitPlayer(): MapCell {
        let dest: MapCell;
        if (this.cell.x == _.game.player.cell.x) {
            let dest = this.checkPlayerOnLine(this.cell.y, this.cell.x, _.game.player.cell.y, _.game.player.cell.x, _.game.player)
            if (dest) {
                return dest;
            }
        }

        if (this.cell.y == _.game.player.cell.y) {
            dest = this.checkPlayerOnLine(this.cell.y, this.cell.x, _.game.player.cell.y, _.game.player.cell.x, _.game.player)

            if (dest) {
                return dest;
            }
        }

        
        return null
    }

    private checkPlayerOnLine(y: number, x: number, y2: number, x2: number, player: ActiveCellObject): MapCell {
        let killed = false;
        let dest: Vec2 = null;

        let i;
        let delta;
        if (y == y2) {
            delta = m.sign(x2 - x);
            for (i = x + delta; true; i += delta) {
                if (_.game.inField(i, y)) {
                    if (_.game.map[i][y].isWall) {
                        break;
                    }

                    if (_.game.map[i][y].OccupiedBy == player) {
                        killed = true;
                    }

                    if (_.game.map[i][y].OccupiedBy && _.game.map[i][y].OccupiedBy != player) {
                        break;
                    }

                } else {
                    break;
                }
            }
        }
        if (killed) return _.game.map[i - delta][y];

        if (x == x2) {
            delta = m.sign(y2 - y);
            for (i = y + delta; true; i += delta) {
                if (_.game.inField(x, i)) {
                    if (_.game.map[x][i].isWall) {
                        break;
                    }

                    if (_.game.map[x][i].OccupiedBy == player) {
                        killed = true;
                    }

                    if (_.game.map[x][i].OccupiedBy && _.game.map[x][i].OccupiedBy != player) {
                        break;
                    }

                } else {
                    break;
                }
            }
        }

        if (killed) return _.game.map[x][i - delta];
        return null;
    }
}