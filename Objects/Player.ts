import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {MapCell} from "../Stages/Game";
import {m, Vec2} from "../Neu/Math";
import {TimelineMax} from "../Neu/Application";

export class CellObject extends O {
    cell: MapCell;
    public reactOnMove: boolean = false;
    onTurnEnd() {

    }

    protected setMyCell_noOCCUPY() {
        let cellcoord = _.game.getObjectCell(this);
        this.cell = _.game.map[cellcoord[0]][cellcoord[1]];

    }

    onPlayerMove(): boolean {
        return true;
    }

    setCell(cell: MapCell) {
        this.cell = cell;
        this.alignToCell();
    }

    public alignToCell() {
        if (this.cell) {
            let cp = _.game.getCellPoint(this.cell.x, this.cell.y);
            this.pos[0] = cp[0];
            this.pos[1] = cp[1];
        }
        _.sm.camera.updateTransform(this, this.gfx);
    }
}

export class Player extends CellObject {

    hitAnim() {
        _.pa.DamageTint(this, 0.2)
    }


    init(props: any) {
        this.gfx = _.cs("hero_horse", this.layer);

        //create gfx here
        this.setMyCell_noOCCUPY();

        _.game.occupy(this.cell, this);
        super.init(props);
    }

    getMoves(): Vec2[] {
        let submoves: Vec2[] = [
            [this.cell.x + 1, this.cell.y + 2],
            [this.cell.x + 2, this.cell.y + 1],
            [this.cell.x - 1, this.cell.y + 2],
            [this.cell.x - 2, this.cell.y + 1],
            [this.cell.x + 1, this.cell.y - 2],
            [this.cell.x + 2, this.cell.y - 1],
            [this.cell.x - 1, this.cell.y - 2],
            [this.cell.x - 2, this.cell.y - 1],
        ];

        let res: Vec2[] = [];

        for (let x of submoves) {
            if (_.game.inField(x[0], x[1])) {
                if (!_.game.getCell(x).isWall)
                res.push(x)
            }
        }

        return res;
    }

    takeDamage(dmg: number) {
        _.game.fail = true;
        _.game.over();
    }

    moveTo(dest: MapCell) {
        let oldX = this.cell.x;
        let oldY = this.cell.y;
        _.game.anim.do(()=>{
            let dx = -m.sign(oldX - dest.x);
            let dy = -m.sign(oldY - dest.y);

            let animateTilesUnder = (cx, cy) => {

            };

            let cx = oldX;
            let cy = oldY;
            let path = [];
            for (let j = 0; j < 5; j++) {
                if (cx != dest.x) {
                    cx += dx;
                    path.push(_.game.getCellPoint(cx, cy));
                    animateTilesUnder(cx, cy);
                    continue;
                }

                if (cy != dest.y) {
                    cy += dy;
                    path.push(_.game.getCellPoint(cx, cy));
                    animateTilesUnder(cx, cy);
                    continue;
                }
            }
            let t1 = new TimelineMax();
            let counter = 0;
            for (let p of path) {
                counter ++;
                t1.to(this, 0.15 + counter *0.05, {x: p[0], y: p[1]});
            }
        }, 1.2);


    }
}