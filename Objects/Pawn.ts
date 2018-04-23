import {Monster} from "./Monster";
import {_} from "../main";
import {MapCell} from "../Stages/Game";
import {m, Vec2} from "../Neu/Math";
import {TweenMax} from "../Neu/Application";

const HIT_CELLS: Vec2[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

export class Pawn extends Monster {

    getPawnMove(): MapCell {
        let delta = [0, 0];
        let dx = _.game.player.cell.x - this.cell.x;
        let dy = _.game.player.cell.y - this.cell.y;
        let possible: Vec2[] = [];
        possible.push([this.cell.x - 1, this.cell.y]);
        possible.push([this.cell.x, this.cell.y + 1]);
        possible.push([this.cell.x + 1, this.cell.y]);
        possible.push([this.cell.x, this.cell.y - 1]);

        possible = this.removeBlocked(possible);
        possible = this.removeWrongDirection(possible);
        if (possible.length > 0) {
            return _.game.getCell(m.getRand(possible))
        } else {
            return null;
        }
    }

    onPlayerMove(): boolean {
        if (this.dead) {
            return true;
        }

        if (this.tryHitPlayer()) {
            return true;
        } else {

            let pm = this.getPawnMove();
            if (pm) {
                let cp = _.game.getCellPoint(pm.x, pm.y);
                _.game.occupy(pm, this);
                TweenMax.to(this, 0.2, {x: cp[0], y: cp[1]});
                console.log("pawn have a move");
                _.game.anim.block(0.15);
                return true;
            }
            return false;
        }
    }

    init(props: any): any {
        this.setMyCell_noOCCUPY();
        _.game.occupy(this.cell, this);

        _.rm.requestSpine("Slime", (data)=> {
            this.gfx = new PIXI.heaven.spine.Spine(data);

            this.gfx.scale.set(0.01);

            TweenMax.to(this.gfx.scale, 0.5, {x: 0.13, y: 0.13});
            this.gfx.state.setAnimation(0, "Idle", true);
            this.gfx.pivot.y = 1;
            this.layer.addChild(this.gfx);
            this.alignToCell();
            super.init(props);
            this.process();
        });

    }


    private removeBlocked(possible: Vec2[]): Vec2[] {
        let res: Vec2[] = [];

        for (let x of possible) {
            if (_.game.canMoveHere(x[0], x[1])) {
                res.push(x)
            }
        }

        return res;
    }

    private removeWrongDirection(possible: Vec2[]): Vec2[] {
        let res: Vec2[] = [];

        for (let x of possible) {
            if ((Math.abs(_.game.player.cell.x - this.cell.x) >
                Math.abs(_.game.player.cell.x - x[0])) ||
                (Math.abs(_.game.player.cell.y - this.cell.y) >
                    Math.abs(_.game.player.cell.y - x[1]))) {
                res.push(x)
            }
        }
        return res;
    }

    private tryHitPlayer(): boolean {
        for (let x of HIT_CELLS) {
            let xx: Vec2 = [x[0] + this.cell.x, x[1] + this.cell.y];
            if (_.game.inField(xx[0], xx[1])) {
                let cell = _.game.getCell(xx);
                if (cell.OccupiedBy == _.game.player) {
                    this.hitAnimation(cell);
                    this.gfx.state.setAnimation(0, "Blow", false);

                    _.game.player.wait(0.1).call(() => {
                        _.game.player.hitAnim();

                    }).apply();
                    _.game.player.takeDamage(1);
                    return true;
                }
            }
        }
        return false;
    }

    private hitAnimation(cell: MapCell) {
        console.log("HIT PLAYER!!!");
        let dest = _.game.getCellPoint(cell.x, cell.y);
        TweenMax.to(this, 0.3, {x: dest[0], y: dest[1], repeat: 1, yoyo: true})
    }
}