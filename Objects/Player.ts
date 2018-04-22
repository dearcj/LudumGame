import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {MapCell} from "../Stages/Game";
import {m, Vec2} from "../Neu/Math";
import {Power1, Power2, TimelineMax, TweenMax} from "../Neu/Application";
import {ActiveCellObject} from "./ActiveCellObject";
import {TOWER_EASE} from "./Tower";
import {Light} from "../Neu/BaseObjects/Light";

export class Player extends ActiveCellObject {
    private light: Light;

    hitAnim() {
        _.pa.DamageTint(this, 0.2)
        _.game.player.wait(0.6).call(()=>{
            _.game.restart();
        }).apply()
    }

    process(){
        super.process();

        this.light.x = this.x;
        this.light.y = this.y + 34;
    }

    init(props: any) {
        this.gfx = _.cs("hero_horse", this.layer);
        this.light = <Light>_.sm.findOne("light1");
        //create gfx here
        this.setMyCell_noOCCUPY();
        let prevScaleX = this.light.gfx.scale.x;
        let prevScaleY = this.light.gfx.scale.y;
        this.light.gfx.scale.x = 0.1;
        this.light.gfx.scale.y = 0.1;
        TweenMax.to(this.light.gfx.scale, 1.2, {delay: .5, x: prevScaleX, y: prevScaleY, ease:TOWER_EASE, onComplete:()=>{
            this.light.isCandle = true;
                this.light.initSize = [this.light.gfx.width, this.light.gfx.height];
            }});
        _.game.occupy(this.cell, this);
        let prevY = this.y;
        this.gfx.alpha = 0;
        this.y -= 500;
        TweenMax.to(this, 1, {y: prevY, ease: Power1.easeIn});
        TweenMax.to(this.gfx, 1, {alpha: 1, ease: Power1.easeIn});
        _.game.anim.do(()=>{}, 0.5);
        super.init(props);
        this.process();
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
            let dx = -m.sign(oldX - dest.x);
            let dy = -m.sign(oldY - dest.y);

            let tiles1 = _.sm.collectObjectsOnLayer(_.game.layers['tilefg']);
            let tiles2 = _.sm.collectObjectsOnLayer(_.game.layers['tilebg']);
            let res = tiles1.concat(tiles2);

            let animateTilesUnder = (cx, cy, delay: number) => {
                for (let x of res) {
                    if (x.tileColRow[0] == cx && x.tileColRow[1] == cy) {
                        TweenMax.to(x, 0.15, {delay: delay, y: x.y+12, yoyo: true, repeat: 1});
                        TweenMax.to(x.gfx.scale, 0.15, {delay: delay, x: 0.96, y: 0.96, yoyo: true, repeat: 1});
                        let heaven = <PIXI.heaven.Sprite>x.gfx;
                        TweenMax.to(x.gfx.color, 0.2, {delay: delay, lightB: 1, lightG: 1,  darkR: 0.2, darkG: 0.2, darkB: 0.2 });
                        TweenMax.to(x.gfx.color, 0.5, {delay: delay + 0.2, lightB: 1, lightG: 1,  darkR: 0., darkG: 0., darkB: 0.});
                    }
                }
            };

            let cx = oldX;
            let cy = oldY;
            let path = [];

            for (let j = 0; j < 5; j++) {
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
            let t1 = new TimelineMax();
            let counter = 0;
            let del = 0.;
            animateTilesUnder(oldX,oldY, 0);
            for (let p of path) {
                counter ++;
                let pp = _.game.getCellPoint(p[0], p[1]);
                let time = 0.15 + counter *0.05;
                t1.to(this, time, {x: pp[0], y: pp[1]});
                del += time;
                animateTilesUnder(p[0], p[1], del*0.75);
            }
        return 0.7;

    }
}