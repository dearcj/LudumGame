import {Monster} from "./Monster";
import {_} from "../main";
import {CustomEase, Elastic, Power2, Power3, TweenMax} from "../Neu/Application";
import {CellObject, Player} from "./Player";
import {m, Vec2} from "../Neu/Math";
import {MapCell} from "../Stages/Game";
export const TOWER_EASE = (<any>window).CustomEase.create("custom", "M0,0,C0,0,0.072,0.504,0.158,0.8,0.204,0.958,0.266,1.012,0.3,1.012,0.346,1.012,0.341,0.988,0.372,0.928,0.372,0.928,0.372,0.928,0.372,0.928,0.372,0.927,0.391,0.91,0.392,0.91,0.399,0.902,0.43,0.89,0.432,0.89,0.494,0.89,0.492,0.94,0.516,0.956,0.556,1,0.556,1.014,0.624,0.984,0.674,0.951,0.788,1,0.872,1,0.976,1,1,1,1,1");

export class Tower extends Monster {
    lastAngle: number = 0;

    moveTo(d: MapCell): any {
        _.game.occupy(d, this);
        let p = _.game.getCellPoint(d.x, d.y);
        TweenMax.to(this, 1.1, {x: p[0], y: p[1], ease: TOWER_EASE});
        TweenMax.to(this.gfx.scale, 0.25, {x: 1.1, y: 1.1, yoyo:true, repeat: 1});
    }

    init(props: any): any {
        this.gfx = _.cs("hero_tower", this.layer);
        this.setMyCell_noOCCUPY();
        _.game.occupy(this.cell, this);
        this.alignToCell();
        super.init(props);
    }

    getTowerMoves(): MapCell {
        let x, y: number;
        let move: Vec2;
        let end = false;
        for (let a = 0; a < 4; a++) {
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
            _.game.anim.do(() => {
                this.moveTo(dest);
                _.game.player.wait(0.2).call(()=>{
                    _.pa.DamageTint(_.game.player, 0.3);
                }).apply();
            }, 0.4);
            return true;
        } else {

            let pm = this.getTowerMoves();
            if (pm) {
                let cp = _.game.getCellPoint(pm.x, pm.y);
                _.game.occupy(pm, this);
                TweenMax.to(this, 0.2, {x: cp[0], y: cp[1]});
                console.log("pawn have a move");
                _.game.anim.do(() => {

                }, 0.1);
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

    private checkPlayerOnLine(y: number, x: number, y2: number, x2: number, player: Player): MapCell {
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

                }
            }
        }

        if (killed) return _.game.map[x][i - delta];
        return null;
    }
}