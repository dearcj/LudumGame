import {Stage} from "../Neu/Stage";
import {_} from "../main";
import {ColorGradingShader} from "../shaders/ColorGradingShader";
import {DEF_EVENTS, O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {Player} from "../Objects/Player";
import {AttackFilter} from "../shaders/AttackFilter";
import {OutlineFilter} from "../shaders/OutlineFilter";
import {Power1, TweenMax} from "../Neu/Application";
import {AnimationManager} from "../Utils/AnimationManager";
import {Lighting2} from "../Objects/Lighting2";
import {Monster} from "../Objects/Monster";
import {Tower, TOWER_EASE} from "../Objects/Tower";
import {ActiveCellObject} from "../Objects/ActiveCellObject";
import {CellObject} from "../Objects/CellObject";
import {BlackTransition} from "../Neu/Transitions/BlackTransition";
import {Light} from "../Neu/BaseObjects/Light";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {DeathPoint} from "../Objects/DeathPoint";
import {TowerDeath} from "../Objects/TowerDeath";


const START_LEVEL: number = 1;

export type MapCell = {
    x: number,
    y: number,
    OccupiedBy?: O,
    isWall: boolean
}

const cellsize = 128;

const LevOrder = ["level2", "level3", "level4", "level4"];

export class Game extends Stage {
    moves: number = 0;
    lighting: Lighting2;
    map: MapCell[][];
    pointsToMove: O[];
    public player: Player;
    public win: boolean;
    public fail: boolean;
    public anim: AnimationManager = new AnimationManager();
    private aoiLR: Vec2;
    private aoiWH: Vec2;
    private level: number = START_LEVEL;
    private maxMoves: number = 0;
    private movetimer: TextBox;

    next() {
        this.level++;
        _.sm.openStage(_.game);
    }


    restart() {
        _.sm.openStage(_.game);
    }

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
        let list = _.sm.findByType(ActiveCellObject);
        for (let l of list) {
            if (l.gfx) {
                l.layer = l.gfx.parent;
                O.rp(l.gfx);
            }
        }

        list.sort((a, b: ActiveCellObject) => {
            return a.y - b.y
        });

        for (let l of list) {
            if (l.gfx)
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
        //let black = new BlackTransition()
        if (this.pointsToMove) {
            this.pointsToMove = _.sm.removeList(this.pointsToMove);
        }


        this.win = false;
        this.fail = false;
        this.moves = 0;
        Light.POWER = 1;
        super.onShow();
        let lev = LevOrder[this.level - 1];

        let url = new URL(window.location.href);
        let levstr = url.searchParams.get("lev");
        if (levstr) lev = levstr;
        this.loadLevel(lev);
        let aoi = _.sm.findOne("areaofinterest");
        this.aoiLR = [aoi.pos[0] - aoi.width / 2, aoi.pos[1] - aoi.height / 2];
        this.aoiWH = [aoi.width, aoi.height];
        Lighting2.POWER= 1;
        if (lev == "level3") {
            _.sm.main.filters = [new ColorGradingShader('atlas/allluts.png', 1)];
        } else {
            _.sm.main.filters = [];//[new ColorGradingShader('atlas/allluts.png', 0)];
        }
        TweenMax.to(_.sm.camera, 1.5, {delay: .2, zoom: 0.65, ease: Power1.easeOut});
        //_.sm.camera.zoom = 0.65;
        this.player = _.sm.findByType(Player)[0];
        this.process();

        if (this.layers["decor"]) {

            //this.layers["decor"]
        }
            this.lighting = _.sm.findByType(Lighting2)[0];
            this.lighting.envColor = [255, 250, 240, 230];
            this.lighting.envColorDark = [15, 0, 0, 0];
            this.lighting.redraw();

    }

    process() {
        _.sm.camera.x = this.player.x;
        _.sm.camera.y = this.player.y;
        if (_.sm.camera.y - (_.SCR_HEIGHT /2) / _.sm.camera.zoom < this.aoiLR[1]) {
            _.sm.camera.y = this.aoiLR[1] + (_.SCR_HEIGHT / 2) / _.sm.camera.zoom;
        }

        if (_.sm.camera.x - (_.SCR_WIDTH /2) / _.sm.camera.zoom < this.aoiLR[0]) {
            _.sm.camera.x = this.aoiLR[0] + (_.SCR_WIDTH / 2) / _.sm.camera.zoom;
        }


        if (_.sm.camera.y + (_.SCR_HEIGHT /2) / _.sm.camera.zoom > this.aoiLR[1] + this.aoiWH[1]) {
            _.sm.camera.y = this.aoiLR[1] + this.aoiWH[1] - (_.SCR_HEIGHT / 2) / _.sm.camera.zoom;
        }

        if (_.sm.camera.x + (_.SCR_WIDTH /2) / _.sm.camera.zoom > this.aoiLR[0] + this.aoiWH[0]) {
            _.sm.camera.x = this.aoiLR[0] + this.aoiWH[0] - (_.SCR_WIDTH / 2) / _.sm.camera.zoom;
        }

        super.process();

        this.makeZOrder();
    }

    private loadLevel(level1: string) {
        let objs = _.lm.load(this, level1, (objs, props) => {
            _.lm.load(this, "game");
            this.maxMoves = props.maxMoves;
            this.movetimer = <TextBox>_.sm.findOne("movetimer");
            this.updateMoves();
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
        //let shader = new AttackFilter();
        //shader.time = 0.;
        //let noise = new PIXI.filters.NoiseFilter();
        //let outline = new OutlineFilter(2, 0xff5500);

        //_.addFilter(g, shader);
        //_.addFilter(g, noise);
        obj.y --;
        obj.gfx.interactive = true;
        obj.gfx.click = () => {
            _.game.execPlayerTurn(x, y);
        };
        obj.gfx.alpha = 0.8;
        let tween = TweenMax.to(g.scale, 0.5, {x: 1.05, y: 1.05, yoyo: true, repeat: -1});
        let tween2 = TweenMax.to(g, 0.5, {alpha: 1, yoyo: true, repeat: -1});
        obj.on(DEF_EVENTS.killed).call(() => {
            _.killTween(tween);
            _.killTween(tween2);
        }).apply();

        obj.init({})

       /* obj.setInterval(() => {
            if (obj.gfx && obj.gfx.filters && obj.gfx.filters.length > 0) {
                if (shader.time > 1) shader.time = 0;
                shader.time += 0.04;

                let t = _.fMath.cos(_.time / 500) * 0.5 + 0.5;
                (<any>noise).seed = 2 + t / 6000;
                noise.noise = 0.08 + 0.1 * t;

            }
        }, 0.033);*/

        return obj;
    }

    execPlayerTurn(x: number, y: number) {
        if (this.pointsToMove) {
            this.pointsToMove = _.sm.removeList(this.pointsToMove);
        }

        _.game.anim.do(()=>{
            let time = this.player.moveTo(this.map[x][y]);
            this.moves ++;

            this.updateMoves();

            _.game.anim.block(time);
            this.player.wait(time - 0.4).call(()=>{
                let ocp = this.map[x][y].OccupiedBy;
                if (ocp && ocp instanceof Monster) {
                    ocp.die();
                }
                this.occupy(this.map[x][y], this.player);
            }).apply();

        });

        //this.player.alignToCell();

            let co = _.sm.findByType(CellObject);
            for (let z of co) {
                z.reactOnMove = false;
            }

            for (let z of co) {
            _.game.anim.do(() => {
                z.onPlayerMovePriority()
            });
            }

        _.game.anim.do(() => {
            if (this.moves == this.maxMoves) {
                this.addDeathPenalty();
            }});


            let towers = _.sm.findByType(Tower);
            for (let z of towers) {
                _.game.anim.do(() => {
                    if (_.game.win || _.game.fail) return;

                    if (z.reactOnMove) return;
                    z.reactOnMove = z.onPlayerMove()
                });
            }

            for (let i = 0; i < 12; i++) {
                for (let z of co) {
                    _.game.anim.do(() => {
                        if (_.game.win || _.game.fail) return;
                        if (z.reactOnMove) return;
                        z.reactOnMove = z.onPlayerMove()
                    });
                }
            }
            console.log("exec pl turn");



        _.game.anim.do(() => {
            if (_.game.win || _.game.fail) return;
            this.setPlayerTurn();
        });
    }


    over() {

    }

    private updateMoves() {
        //Light.POWER = 0.5 + 0.5* prop;
        let beforeDeath = this.maxMoves - this.moves;
        if (beforeDeath<= 0) {
            this.movetimer.text = "";
        } else
        this.movetimer.text = beforeDeath.toString();
    }

    private addDeathPenalty() {
        let deathPoints = _.sm.findByType(DeathPoint);
        this.setDarkness();
        _.game.anim.block(0.3);
        for (let x of deathPoints) {
            if (x.cell.OccupiedBy == null) {
                let deathTower = new TowerDeath([x.x, x.y]);
                deathTower.init({});
                deathTower.reactOnMove = true;
                this.occupy(x.cell, deathTower);
                deathTower.alignToCell();
            }
        }
    }

    private setDarkness() {
        Light.POWER = 0.75;
        Lighting2.POWER = 2;
        this.lighting.tweenColorTo([255, 220, 180, 180], [65, 0, 0, 0]);
        this.lighting.redraw();
    }
}
