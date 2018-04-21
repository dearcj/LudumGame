import {Stage} from "../Neu/Stage";
import {_} from "../main";
import {ColorGradingShader} from "../shaders/ColorGradingShader";
import {DEF_EVENTS, O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {CellObject, Player} from "../Objects/Player";
import {AttackFilter} from "../shaders/AttackFilter";
import {OutlineFilter} from "../shaders/OutlineFilter";
import {TweenMax} from "../Neu/Application";
import {AnimationManager} from "../Utils/AnimationManager";
import {Lighting2} from "../Objects/Lighting2";
import {Monster} from "../Objects/Monster";
import {Tower} from "../Objects/Tower";

export type MapCell = {
    x: number,
    y: number,
    OccupiedBy?: O,
    isWall: boolean
}

const cellsize = 128;

export class Game extends Stage {
    lighting: Lighting2;
    map: MapCell[][];
    pointsToMove: O[];
    public player: Player;
    public win: boolean;
    public fail: boolean;
    public anim: AnimationManager = new AnimationManager();

    getCellPoint(cx, cy: number): Vec2 {
        return [(cx + 0.5) * cellsize, (cy + 0.5) * cellsize];
    }

    setPlayerTurn() {
        if (this.win) {
            return;
        }


        let moves = this.player.getMoves();
        this.pointsToMove = [];
        for (let x of moves) {
            this.pointsToMove.push(this.createMovePoint(x[0], x[1]))
        }
    }

    makeZOrder() {
        let list = _.sm.findByType(CellObject);
        for (let l of list) {
            l.layer = l.gfx.parent;
            O.rp(list);
        }

        list.sort((a, b: CellObject) => {
            return a.y - b.y
        });

        for (let l of list) {
            l.layer.addChild(l.gfx);
        }
    }

    inField(x, y: number): boolean {
        if (this.map[x] != null) {
            if (this.map[x][y] != null)
                return true;
        }

        return false;
    }

    canMoveHere(x, y: number): boolean {
        if (!this.inField(x, y)) return false;

        if (this.map[x][y].isWall) return false;

        if (this.map[x][y].OccupiedBy) return false;

        return true;
    }

    onShow() {
        this.win = false;
        this.fail = false;
        _.sm.camera.y = 600;
        super.onShow();
        this.loadLevel("level1");
        _.lm.load(this, "game");
        _.sm.main.filters = [new ColorGradingShader('atlas/allluts.png', 0)];
        _.sm.camera.zoom -= 0.5;
        this.player = _.sm.findByType(Player)[0];

        _.sm.camera.wait(0.1).call(() => {
            this.lighting = _.sm.findByType(Lighting2)[0];
            this.lighting.envColor = [205, 200, 180, 190];
            this.lighting.envColorDark = [20, 40, 0, 0];
            this.lighting.redraw();
            this.setPlayerTurn();
        }).apply();
    }

    process() {
        super.process();

        this.makeZOrder();
    }

    private loadLevel(level1: string) {
        let objs = _.lm.load(this, level1, (objs, props) => {
            let walls = _.sm.collectObjectsOnLayer(_.sm.stage.layers['tilewalls'], objs);
            let maxMapX = 0;
            let maxMapY = 0;
            for (let x of walls) {
                let c = this.getObjectCell(x);
                if (c[0] > maxMapX) {
                    maxMapX = c[0];
                }
                if (c[1] > maxMapY) {
                    maxMapY = c[1];
                }
                O.rp(x.gfx);
            }
            _.sm.removeList(walls);
            this.map = new Array(maxMapX + 1);
            for (let i = 0; i < maxMapX + 1; i++) {
                this.map[i] = new Array(maxMapY + 1);
                for (let j = 0; j < maxMapY + 1; j++) {
                    this.map[i][j] = {
                        x: i,
                        y: j,
                        isWall: false
                    }
                }
            }

            for (let x of walls) {
                let c = this.getObjectCell(x);
                this.map[c[0]][c[1]].isWall = true;
            }
        });


    }

    public getObjectCell(x: O): Vec2 {
        let v: Vec2 = [Math.floor(x.x / cellsize), Math.floor(x.y / cellsize)];
        return v;
    }

    occupy(cp: MapCell, obj: CellObject) {
        if (obj.cell) {
            obj.cell.OccupiedBy = null;
        }

        obj.cell = cp;
        cp.OccupiedBy = obj;
    }

    getCell(c: Vec2): MapCell {
        return this.map[c[0]][c[1]]
    }

    private createMovePoint(x: number, y: number): O {
        let g = _.cs("selection", _.sm.olgui);
        let obj = new O([(x + 0.5) * (cellsize), (y + 0.5) * (cellsize + 0.5)], g);
        //g.alpha = 0.5;
        let shader = new AttackFilter();
        shader.time = 0.;
        let noise = new PIXI.filters.NoiseFilter();
        let outline = new OutlineFilter(2, 0xff5500);

        _.addFilter(g, shader);
        _.addFilter(g, noise);
        obj.gfx.interactive = true;
        obj.gfx.click = () => {
            _.game.execPlayerTurn(x, y);
        }
        let tween = TweenMax.to(g.scale, 0.5, {x: 1.2, y: 1.2, yoyo: true, repeat: -1});
        obj.on(DEF_EVENTS.killed).call(() => {
            _.killTween(tween);
        }).apply();

        _.sm.camera.updateTransform(obj, obj.gfx);

        obj.setInterval(() => {
            if (obj.gfx && obj.gfx.filters && obj.gfx.filters.length > 0) {
                if (shader.time > 1) shader.time = 0;
                shader.time += 0.04;

                let t = _.fMath.cos(_.time / 500) * 0.5 + 0.5;
                (<any>noise).seed = 2 + t / 6000;
                noise.noise = 0.08 + 0.1 * t;

            }
        }, 0.033);

        return obj;
    }

    execPlayerTurn(x: number, y: number) {
        if (this.pointsToMove) {
            this.pointsToMove = _.sm.removeList(this.pointsToMove);
        }

        this.player.moveTo(this.map[x][y]);
        _.game.anim.do(()=>{
            let ocp = this.map[x][y].OccupiedBy;
            if (ocp && ocp instanceof Monster) {
                ocp.die();
            }

            this.occupy(this.map[x][y], this.player);
        });

        //this.player.alignToCell();

        _.game.anim.do(() => {
            let co = _.sm.findByType(CellObject);
            for (let z of co) {
                z.reactOnMove = false;
            }
            let towers = _.sm.findByType(Tower);
            for (let z of towers) {
                if (z.reactOnMove) continue;
                z.reactOnMove = z.onPlayerMove()
            }

            for (let i = 0; i < 12; i++) {
                for (let z of co) {
                    if (z.reactOnMove) continue;
                    z.reactOnMove = z.onPlayerMove()
                }
            }
            console.log("exec pl turn");

            for (let z of co) {
                z.onTurnEnd()
            }
        });
        _.game.anim.do(() => {
            this.setPlayerTurn();
        });
    }


    over() {

    }
}
