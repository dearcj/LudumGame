import {Application, TweenLite, TweenMax} from "./Neu/Application";


import {SM} from "./Neu/SM";
import {Sound} from "./Neu/Sound";
import {PauseTimer} from "./Neu/PauseTimer";
import {Controls} from "./Neu/Controls";
import {m, Vec2} from "./Neu/Math";
import {AnimClip} from "./Neu/PIXIPlugins/AnimClip";
import {Engine, Render, Runner} from "./lib/matter";
import {ResourceManager} from "./Neu/ResourceManager";
import {LevelNames} from "./ObjectsList";
import './lib/pixi-heaven.js';
import {
    CAMERA_DEBUG,
    DEBUG_EFFECTS,
    FRAME_DELAY, MAX_SCR_HEIGHT,
    MAX_SCR_WIDTH,
    MIN_SCR_HEIGHT,
    MIN_SCR_WIDTH,
    SKIP_MENU
} from "./ClientSettings";
import {Loader} from "./Neu/Loader";
import {ColorGradingShader} from "./shaders/ColorGradingShader";
import {Menu} from "./Stages/Menu";
import {Game, MapCell} from "./Stages/Game";
import {ProgramAnimations} from "./Utils/ProgramAnimations";
export let FMath = (<any>window).FMath;
declare let Stats: any;
export type PIXIContainer = any;
export type PIXIRectangle = any;
declare let Playtomic: any;
declare var $: any;
//asdasd
const GLOBAL_MUSIC_ASSETS = [];

const GLOBAL_SOUND_ASSETS = [
    //////////////////////////////////////////
    //  Music
    //////////////////////////////////////////
];//

const GLOBAL_ASSETS = [
    ///////////////////////////////////////////
    // Spine
    ///////////////////////////////////////////


    ///////////////////////////////////////////
    // Atlases
    ///////////////////////////////////////////
    'res/color.png',
    'atlas/atlas.json',

    ///////////////////////////////////////////
    // Fonts
    ///////////////////////////////////////////
    'fonts/Berkshire-export.xml',
    'fonts/NanumGothicCanvas-export.xml',


    ///////////////////////////////////////////
    //  Shaders
    ///////////////////////////////////////////
    'shaders/colorgrade.frag',
    'shaders/default.vert',
    'shaders/shockwave.frag',
    'shaders/attack.frag',
    'shaders/heal.frag',
    'shaders/moon.frag',
    'shaders/desire.frag',
    'shaders/uifilter.frag',
    'shaders/outline.frag',
    'shaders/outline.vert',
    'shaders/glow.frag',
];




export let PIXIUI = (<any>PIXI).UI;



export class Main extends Application {
    public menu: Menu = new Menu();
    public game: Game = new Game();


    private loadTime: number;

    private preloadBar: PIXI.Graphics;

    public __DIR: string;

    public cursor: PIXI.Sprite;
    public pa: ProgramAnimations = new ProgramAnimations();
    assets: Array<string>;
    assetsLoaded: number = 0;
    private loadingCounter: number = 0;
    private PHYS_DEBUG: boolean = false;

    constructor(msw: number, msh: number) {
        super(msw, msh);
        this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    }

    static GET(url: string, cb: Function) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                cb(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }


    start() {
        let baseW, baseH: number;
        if (window.location.search == '?webres') {
            baseW = MIN_SCR_WIDTH;//this.SCR_WIDTH;
            baseH = MIN_SCR_HEIGHT;//this.SCR_HEIGHT;
        } else {
            baseW = MAX_SCR_WIDTH;//this.SCR_WIDTH;
            baseH = MAX_SCR_HEIGHT;//this.SCR_HEIGHT;
        }

        TweenMax.lagSmoothing(0);
        TweenLite.ticker.useRAF(false);
        this.setScreenRes(baseW, baseH);

        if (CAMERA_DEBUG) {
            document.addEventListener("keydown", (e) => {
                let keyCode = e.keyCode;
                switch (keyCode) {
                    case 68: //d
                        _.sm.camera.x += 22.5;
                        break;
                    case 83: //s
                        _.sm.camera.y += 22.5;
                        break;
                    case 65: //a
                        _.sm.camera.x -= 22.5;
                        break;
                    case 87: //w
                        _.sm.camera.y -= 22.5;
                        break;
                    case 88: //x
                        _.sm.camera.zoom -= 0.02;
                        break;
                    case 90: //z
                        _.sm.camera.zoom += 0.02;
                        break;
                }
            });
        }

        super.start();

        _.lm.SkipSpriteExt = true;

        this.lm.customGlobalParamsCallback = (globalProperties: any) => {
            if (globalProperties["colorgrade"] ) {
                this.sm.main.filters = [new ColorGradingShader('atlas/allluts.png', parseFloat(globalProperties["colorgrade"]))];
            }

            if (globalProperties["battlelight"]) {
                let col = globalProperties["battlelight"].replace('#', '0x');
                //this.game.colBattle = m.numhexToRgb(parseInt(col))
            }

            if (globalProperties["regularlight"]) {
                let col = globalProperties["regularlight"].replace('#', '0x');
                //this.game.colRegular = m.numhexToRgb(parseInt(col))
            }
        };
    };

    loadComplete(): void {
        this.isInitialLoading = false;
        this.loadTime = (new Date()).getTime() - (<any>window).startTime.getTime();
        this.clearPreloader();

        const interaction = this.app.renderer.plugins.interaction;
        document.addEventListener('mousedown', (e) => {
            if (this.globalMouseDown) this.globalMouseDown(e)
        });
        
/*        interaction.cursorStyles["init"] = "url(./cursors/cursor.png), default";
        interaction.cursorStyles["default"] = "url(./cursors/cursor.png), default";
        interaction.cursorStyles["pointer"] = "url(./cursors/hand.png), pointer";
        interaction.cursorStyles["skill"] = "url(./cursors/cursor_skill.png), pointer";
        interaction.currentCursorMode = "init";
  */
        this.app.stage.interactive = true;
        this.app.stage.cursor = "init";
        _.sm.openStage(_.menu)
    }

    initPreloader() {
        this.preloadBar = new PIXI.Graphics();
        this.app.stage.addChild(this.preloadBar);

        const borderWidth = 3;
        this.preloadBar.beginFill(0x000000);
        
        this.preloadBar.moveTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1 - borderWidth, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.495 - borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.9 + borderWidth, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.495 - borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.9 + borderWidth, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.505 + borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1 - borderWidth, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.505 + borderWidth);
        this.preloadBar.endFill();
    }

    drawPreloaderProgress(progressPercent: number): void {
        this.preloadBar.beginFill(0xffffff);
        const progress = progressPercent / 100;
        this.preloadBar.moveTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.495);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1 + this.SCR_WIDTH * 0.8 * progress, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.495);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1 + this.SCR_WIDTH * 0.8 * progress, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.505);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + this.SCR_WIDTH * 0.1, _.screenCenterOffset[1] + this.SCR_HEIGHT * 0.505);
        this.preloadBar.endFill();
    }

    clearPreloader() {
        this.app.stage.removeChild(this.preloadBar);
    }

    load(): void {
        this.loadingCounter = 0;
        this.initPreloader();

        let runner = Runner.create({});
        Runner.run(runner, this.engine);


        let onAssetsLoaded = () => {
            this.drawPreloaderProgress(100);
            this.loadingCounter++;
            if (this.loadingCounter == 2) this.loadComplete()
        };

        this.rm = new ResourceManager();


        this.rm.loadAssets(GLOBAL_ASSETS.concat(LevelNames), (loader: any, evt: any) => {
            this.drawPreloaderProgress(loader.progress);
            this.assetsLoaded++;
        }, onAssetsLoaded);


        this.rm.requestSpine("Teleport", (data)=>{});
        this.rm.requestSpine("Slime", (data)=>{});
        this.rm.requestSpine("Spider_final", (data)=>{});
        this.rm.requestSpine("Teleport", (data)=>{});
        this.rm.requestSpine("Blood", (data)=>{});
        this.rm.requestSpine("Dirt", (data)=>{});

        this.sound = new Sound();
        this.sound.load(GLOBAL_MUSIC_ASSETS, GLOBAL_SOUND_ASSETS, onAssetsLoaded);

        if (this.PHYS_DEBUG) {
        var render = Render.create({
            element: document.body,
            engine: this.engine,
            options: {}

        });
        Render.run(render);
        }
    }
    process(): void{
        super.process();
    }


    downGfx(gfx: any) {
        if (gfx.parent) {
            gfx.parent.setChildIndex(gfx, 0);
        }
    }

}

export var _: Main = new Main(MIN_SCR_WIDTH, MIN_SCR_HEIGHT);

_.start();
_.load();