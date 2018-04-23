import {_, } from "../main";
import {DEF_EVENTS, O} from "../Neu/BaseObjects/O";
import {Light} from "../Neu/BaseObjects/Light";
import {AnimClip} from "../Neu/PIXIPlugins/AnimClip";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {ARGBColor, m, Vec2} from "../Neu/Math";
import {Lighting} from "../Neu/BaseObjects/Lighting";
import {FogParticleSystem} from "../Objects/FogParticleSystem";
import {TrainEffect} from "../Neu/BaseObjects/TrainEffect";
import RopePoint = PIXI.heaven.mesh.RopePoint;
import {TextParticle} from "../Neu/BaseObjects/TextParticle";
import {Bounce, Elastic, Linear, Power2, Power3, Power4, TweenMax} from "../Neu/Application";
import DisplayObject = PIXI.DisplayObject;
import {TOWER_EASE} from "../Objects/Tower";

export class ProgramAnimations {

    static particlesPlaces = [];


    public AddTextParticle(o: O, text: string, fontName: string = 'smallfontp', tint: number = 0xffffff, fontScale: number = 0.9, dmgAnim: boolean = false): TextParticle{
        let tp = new TextParticle(m.v2cp(o.pos));
        //if (tp.pos[0] < 80) tp.pos[0] = 80;
        tp.init({fontscale: fontScale, align: "center", valign: "center", text: text, fontTint: tint, fontName: fontName});
        tp.noCameraOffset = false;
        tp.v[1] = -4.5;
        o.addChild(tp);
        //actor.linkObj(tp);
       // tp.updateLink = function (dx,y) {
        //    this.x += dx;
        //};
        tp.fontScale = fontScale;

        if (dmgAnim) {
            tp.fontScale = fontScale*0.3;
            new TweenMax(tp, 0.25, {fontScale: fontScale*1.1, ease: Power2.easeIn});
            new TweenMax(tp, 1.5, {delay: 0.25, fontScale: fontScale*0.76, ease: Power2.easeOut});
            new TweenMax(tp.gfx, 0.15, {delay: 1.35, alpha: 0.});
        }
        tp.wait(1.5).kill().apply();

        return tp
    }

    MakePhysical(o: O, vx, vy, va, floorLevel: number) {
        let prevProc = o.process.bind(o);
        o.v[0] = vx;
        o.v[1] = vy;

        o.process = () => {
            prevProc();
            o.v[1] += va;
            if (o.y >= floorLevel) {
                va = 0;
                o.v = [0, 0]
            }
        }
    }


    HealAnim(x: number, y: number, durSec: number, autoRemove: boolean = true) {
        for (let j = 0; j < 18; j++) {
            ((j) => {
                let o = new O([x, y]);
                o.gfx = _.cm("heal", _.sm.effects, true, null);
                o.gfx.scale.x = 0.5;
                o.gfx.scale.y = 0.5;
                o.a = 0;
                o.gfx.animationSpeed = 0.245 + Math.random() * 0.05;
                o.v[1] = -1 - Math.random();
                o.wait(durSec).kill().apply();
                o.gfx.blendMode = PIXI.BLEND_MODES.ADD;
                o.gfx.alpha = .5;

                let amplitude = Math.random() * 1;
                let freq = Math.random() * 200 + 200;
                o.extendProcess(() => {
                    o.v[0] = _.fMath.cos(_.time / freq) * amplitude;
                });

                new TweenMax(o.gfx, 1, {alpha: 0, delay: durSec - 1});
                new TweenMax(o.gfx.scale, durSec, {x: 1.5, y: 1.5});
                o.av = 0.01;
                o.gfx.loop = true;

            })(j)
        }
    }


    FireAnim(x: number, y: number, durSec: number, scale: number, autoRemove: boolean = true): O {
        let o = new O([x, y]);
        o.gfx = _.cm("Fire1", _.sm.effects, true, null);
        o.gfx.scale.x = 0.5 * scale;
        o.gfx.scale.y = 0.5;
        o.gfx.animationSpeed = 0.245 + Math.random() * 0.05;
        new TweenMax(o.gfx.scale, durSec * 0.7, {x: 1. * scale, y: 1});
        //o.av = 0.05;
        o.gfx.loop = true;

        if (autoRemove) {
            new TweenMax(o.gfx.scale, durSec * 0.3, {delay: durSec * 0.7, x: 0.2 * scale, y: 0.05});
            o.wait(durSec).kill().apply();
        }

        return o;
    }

    SmokeParticle(x: number, y: number): O {
        let o = new O([x, y]);
        o.gfx = _.cm("SmokeVFX", _.sm.effects, false);
        o.gfx.scale.x = 1.2;
        o.gfx.scale.y = 1.2;
        o.gfx.animationSpeed = 0.3 + Math.random() * 0.06;
        o.gfx.loop = false;
        o.gfx.gotoAndPlay(0);
        (<AnimClip>o.gfx).onComplete = () => {
            o.wait(0).kill().apply();
        };

        return o
    }

    BloodParticle(x: number, y: number, scale: number): O {
        let o = new O([x, y]);
        o.gfx = _.cm("BloodParticle", _.sm.effects, true, [1.6, 1.3, 1.2, 1, 1, 1]);
        o.gfx.scale.x = 1.2 * scale;
        o.gfx.scale.y = 1.2 * scale;
        o.gfx.animationSpeed = 0.035;
        o.gfx.loop = false;
        o.wait(0.34).kill().apply();
        return o;
    }

    Hit1(x: number, y: number, scale: number, isCrit: boolean): void {
        let o = new O([x, y]);
        o.gfx = new PIXI.Container();
        o.gfx.scale.x = scale;
        o.gfx.scale.y = 1;
        let f = _.cs("HitStatic.png", o.gfx);
        _.sm.effects.addChild(o.gfx);
        new TweenMax(f.scale, 0.5, {x: 2, y: 2});

        new TweenMax(o.gfx.scale, 0.5, {y: 1.3});
        new TweenMax(o.gfx.scale, 0.5, {x: 1.3 * scale});
        new TweenMax(f, 0.075, {delay: 0.135, alpha: 0.});
        let parentGfx = o.gfx;

        let len = isCrit ? 20 : 10;
        for (let j = 0; j < len; j++) {
            o.wait(Math.random() * 0.15).call(() => {
                let o = this.BloodParticle(x + 10 * scale + 30 * (Math.random() - 0.5), y + 30 * (Math.random() - 0.5), 1.5 + Math.random() * 0.5);
                o.v[0] = scale * (1 + Math.random() + (isCrit ? 2 : 0)) * 5;
                o.v[1] = (Math.random() - 0.5) * 3 + (isCrit ? 1 : 0) - 2;
                o.a = (Math.random() - 0.5) * 0.1;
            }).apply();
        }

        o.wait(0.55).kill().apply();



    }

    LevelUpEffect(x: number, y: number): void {
        let o = new O([x, y], _.cm("LevelUp", _.sm.effects, true));
        o.gfx.animationSpeed = 0.25;
        o.wait(0.7).kill().apply();

        let l = new Light([x, y + 50], _.cm("LevelUp", _.sm.stage.layers['lighting'], true));
        l.gfx.animationSpeed = 0.25;
        l.gfx.scale.x = 3;
        l.gfx.scale.y = 3;
        l.addToScene();
        l.wait(0.7).kill().apply();

        /* let actorBG = new O([0, 0]);
         actorBG.gfx = _.cm("LevelUp", null, true);
         actorBG.gfx.scale.x = 2;
         actorBG.gfx.scale.y = 2;
         actorBG.process = () => {};
         actorBG.gfx.x = 0;
         actorBG.gfx.alpha = 0.5;
         actorBG.gfx.y = -target.gfx.height;
         actorBG.gfx.blendMode = PIXI.BLEND_MODES.ADD;
         target.gfx.addChildAt(actorBG.gfx, 0);
         actorBG.gfx.animationSpeed = 0.25;
         actorBG.wait(700).kill().apply();*/
    }

    HorizontalPanelAnim(gfx: PIXI.DisplayObject, endCB: Function, reverse: boolean = false) {
        if (!reverse) {
            let prevScaleX = gfx.scale.x;
            gfx.scale.x = 0.01;
            new TweenMax(gfx.scale, 0.3, {x: prevScaleX, ease: Linear.easeOut});

            if (endCB)
                TweenMax.delayedCall(0.3, endCB)
        } else {
            new TweenMax(gfx.scale, 0.4, {x: 0.001, ease: Linear.easeOut});
            new TweenMax(gfx.scale, 0.3, {y: 0.001, ease: Linear.easeOut});

            if (endCB)
                TweenMax.delayedCall(0.4, endCB)
        }
    }

    RoundObjectShowup(gfx: PIXI.DisplayObject, endCB: Function, reverse: boolean = false, timeScale: number = 1) {
        if (!reverse) {
            gfx.scale.x = 0.01;
            gfx.scale.y = 0.01;
            new TweenMax(gfx.scale, 0.3*timeScale, {x: 1, ease: Linear.easeOut});
            new TweenMax(gfx.scale, 0.31*timeScale, {y: 1, ease: Linear.easeOut});

            if (endCB)
                TweenMax.delayedCall(0.35*timeScale, endCB)
        } else {
            new TweenMax(gfx.scale, 0.3*timeScale, {x: 0.000001, ease: Linear.easeOut});
            new TweenMax(gfx.scale, 0.31*timeScale, {y: 0.000001, ease: Linear.easeOut});

            if (endCB)
                TweenMax.delayedCall(0.4*timeScale, endCB)
        }
    }

    PopupSkewAnim(gfx: PIXI.heaven.Sprite, endCB: Function, reverse: boolean = false, timeScale: number = 1) {
        if (!reverse) {
            gfx.scale.x = 0.8;
            gfx.scale.y = 0.2;
            new TweenMax(gfx.scale, 0.35*timeScale, {x: 1, ease: Bounce.easeOut});
            new TweenMax(gfx.scale, 0.4*timeScale, {y: 1, ease: Bounce.easeOut});
            gfx.skew.x = -0.05;
            new TweenMax(gfx.skew, 0.2*timeScale, {x: 0.05, ease: Linear.easeIn});
            new TweenMax(gfx.skew, 0.12*timeScale, {delay: 0.2*timeScale, x: 0., ease: Bounce.easeOut});
            if (endCB)
                TweenMax.delayedCall(0.35*timeScale, endCB)
        } else {
            new TweenMax(gfx.scale, 0.4*timeScale, {x: 0.001, ease: Linear.easeOut});
            new TweenMax(gfx.scale, 0.3*timeScale, {y: 0.001, ease: Bounce.easeOut});

            if (endCB)
                TweenMax.delayedCall(0.4*timeScale, endCB)
        }
    }

    GeneralShowAnim(icon: PIXI.DisplayObject, scale: number) {
        icon.scale.x = 0.01;
        icon.scale.y = 0.01;
        new TweenMax(icon.scale, 0.2, {x: scale, y: scale, ease: Power3.easeOut});
    }

    GeneralHideAnim(icon: PIXI.DisplayObject) {
        new TweenMax(icon.scale, 0.2, {
            x: 0.01, y: 0.01, ease: Power3.easeOut, onComplete: () => {
                O.rp(icon)
            }
        });
    }

    ShowTurnAnimation(text: string, enemy: boolean) {
        let o = new O([-500, 400], _.cs("Choice.png", _.sm.gui));
        o.noCameraOffset = true;
        o.gfx.skew.x = -0.3;
        o.gfx.alpha = 0.86;

        let props = {text: text, align: "center"};
        let x = TextBox.createTextField(props, props);
        x.y = -65;
        if (enemy) {
            x.tint = 0xff8899;
            o.gfx.color.setDark(0.07, 0, 0);
        } else {
            x.tint = 0xaaffdd;
            o.gfx.color.setDark(0., 0.03, 0.01);
        }
        o.gfx.addChild(x);
        o.wait(2).kill().apply();
        new TweenMax(o, 0.3, {x: _.SCR_WIDTH / 2});
        new TweenMax(o, 0.3, {delay: 1.5, x: _.SCR_WIDTH + 350});
    }

    HealTint(target: O, timeSecs: number) {
        if (target.gfx.color) {
            target.gfx.color.setLight(0.1, 0.7, 0.8);
            target.gfx.color.setDark(0., 0.05, 0.12);
        } else {
            target.gfx.tint = 0x880000;
        }

        target.setTimeout(() => {
            if (target.gfx.color) {
                target.gfx.color.setLight(1, 1, 1);
                target.gfx.color.setDark(0., 0., 0.);
            } else {
                target.gfx.tint = 0xffffff;
            }
        }, timeSecs);

    }

    DamageTint(target: O, timeSecs: number) {
        if (target.gfx.color) {
            target.gfx.color.setLight(1, 0.5, 0.5);
            target.gfx.color.setDark(0.5, 0, 0);
        } else {
            target.gfx.tint = 0x880000;
        }

        target.setTimeout(() => {
            if (target.gfx.color) {
                target.gfx.color.setLight(1, 1, 1);
                target.gfx.color.setDark(0., 0., 0.);
            } else {
                target.gfx.tint = 0xffffff;
            }
        }, timeSecs);

    }

    Explosion(x: number, y: number): O {
        let mc = _.cm("expl0", _.sm.effects, true, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4, 1.4, 1.4, 1.7, 1.7, 1.7, 1.7, 1.8]);
        mc.animationSpeed = 0.09;
        let o = new O([x, y], mc);
        new TweenMax(mc.scale, 0.7, {x: 1.9, y: 1.9});
        mc.onFrameChange = (frame) => {
            if (frame == 16) {
                TweenMax.killTweensOf(mc.scale);
                o.wait(0).kill().apply()
            }
        };

        return o;
    }


    FireExplosionAnim(x: number, y: number) {
        let totalDur = 1;
        let maxParticles = 30;
        let upperY = y - 400;

        let light = new Light([x, upperY]);
        light.gfx = _.cs("light3.png", _.sm.stage.layers['lighting']);
        light.gfx.color.setDark(1, 0, 0);
        light.addToScene();

        let expl = (x: number, innerY: number, inx: number, cosValue: number) => {
            _.sm.camera.wait(((innerY - upperY) / 1000) * 0.75).call(() => {
               // light.y = innerY;
                let o = this.Explosion(x, innerY);
                o.gfx.skew.x = -cosValue / 10.;
            }).apply();
        };

        _.sm.camera.wait(1).call(()=>{
            console.log("removed light!!!!!!!!!!!!");
            light.killNow();
        });

        for (let l = 0; l < maxParticles; l++) {
            let pos: Vec2;
            let w = Math.pow(l * 6, 1.2);
            let cosValue = _.fMath.cos(w / 15);

            expl(x + cosValue * (20 + w / 6), upperY + w, l, cosValue);
        }
    }


    WarningPlace(screenpos: Vec2, timeoutSecs: number): any {
        return _.sm.camera.setIntervalTimeout(() => {
            let x = _.cs("important.png", _.sm.gui);
            x.x = screenpos[0];
            x.y = screenpos[1];
            x.alpha = 0.6;
            new TweenMax(x, 1, {alpha: 0.});
            new TweenMax(x.scale, 1, {
                x: 0.01, y: 0.01, onComplete: () => {
                    O.rp(x)
                }
            });
        }, 0.5, timeoutSecs);
    }


    ThinkIco(layer: PIXI.Container, x: number, y: number): O{
        let o = new O([x,y], _.cs("Clock.png", layer));
        o.noCameraOffset = true;
        o.gfx.alpha = 0.5;
        o.gfx.scale.set(0.6);
        o.gfx.color.setLight(0.3, 0.8, 1);
        o.gfx.color.setDark(0., 0.2, 0.8);
       // let tw = new TweenMax(o, 6, {a: 2*Math.PI, repeat: -1, yoyo: false});
        let tw2 = new TweenMax(o.gfx.scale, 1, {x: 0.7, y: 0.7, yoyo: true, repeat: -1});
        tw2.progress(Math.random());
        o.on(DEF_EVENTS.killed).call(()=>{
            _.killTween(tw2);
        }).apply();

        return o;
    }

    BounceEase1(c: PIXI.DisplayObject): void {
        new TweenMax(c.scale, 0.1, {
            x: c.scale.x - 0.05,
            y: c.scale.y - 0.05,
            yoyo: true,
            repeat: 1,
            ease: Power2.easeOut
        });
    }

    DeathSpineAnim(charGfx: any) {
        let x = charGfx;
        if (!(x instanceof PIXI.heaven.spine.Spine)) {
            return
        }

        if (charGfx.state)
            charGfx.state.clearTracks();
        let a = {value: 0};
        new TweenMax(a, 0.3, {
            value: 1, onUpdate: () => {
                charGfx.color.setLight(1 - 0.9 * a.value, 1 - 0.95 * a.value, 0.1 - 0.95 * a.value);
                charGfx.color.setDark(0.05 * a.value, 0., 0.0);
            }
        });

        new TweenMax(charGfx, 0.3, {delay: 0.4, alpha: 0});

        let k = 0;
        let center = charGfx.skeleton.findBone('Centre');
        _.sm.camera.setTimeout(() => {
            let fog = new FogParticleSystem();
            fog.layer = charGfx.parent;
            fog.alwaysVisible = true;
            fog.particle = "evilfog2.png";
            fog.init({});
            fog.gfx.y = -100;

            _.sm.camera.setTimeout(() => {
                let gfx = _.cs("corpse1.png");
                charGfx.parent.addChildAt(gfx, 0);
                O.rp(charGfx);
                fog.runAndKill();
            }, 0.1);
        }, 0.2);

        if (center) {
            for (let c of center.children) {
                k++;
                let loc = c.worldToLocal({x: c.x, y: c.y + 50});
                let rot = Math.PI * (c.rotation / 180);
                let dx = -c.x + c.worldX;
                let dy = -c.y + c.worldY;
                new TweenMax(c, 0.2 + Math.random() * 0.05, {
                    x: c.x + dx / 25,
                    y: c.y + dy / 25,
                    delay: 0.01 * k,
                });
            }
        }
    }

    SoulAnim(x: number, y: number, layer: PIXI.Container): number {
        let xx = new TrainEffect([x, y + 50]);
        xx.init({
            gfx: "evilfog2.png",
            layer: layer,
            blendmode: PIXI.BLEND_MODES.ADD,
            totalPoints: 20,
            historyPoints: 60,
            scaleX: 0.5,
            scaleY: 0.5
        });
        xx.noCameraOffset = true;
        xx.delta = 0;
        let path = [{x: x + 3, y: y}, {x: x - 5, y: y}, {x: x + 6, y: y - 110}, {x: x, y: y - 150}, {
            x: x - 7,
            y: y - 200
        }, {x: x + 10, y: y - 250}, {x: x - 10, y: y - 350}, {x: x + 10, y: y - 550}];
        // xx.gfx.alpha = 0.;
        // xx.gfx.scale.x = 0.5;
        // xx.gfx.scale.y = 0.5;
        let total = 1.4;
        //   xx.gfx.tint = 0x0088aa;
        //TweenMax.to(xx.gfx.scale, total-0.5, {x: 0.55, y: 0.55}); //this does all the work of figuring out the positions over time.
        //TweenMax.to(xx.gfx, 0.4, {alpha: 1}); //this does all the work of figuring out the positions over time.
        //let tw = TweenMax.to(xx.gfx, 0.4, {delay: total - 0.4, alpha: 0}); //this does all the work of figuring out the positions over time.
        let o = {alpha: 1};
        new TweenMax(o, 0.2, {alpha: 0, delay: 1.3});
        let tw = TweenMax.to(xx, total, {bezier: path, ease: Linear.easeOut}); //this does all the work of figuring out the positions over time.
        xx.pointFunc = (rp: RopePoint, prop: number) => {
            let v = tw.progress();
            rp.color.setLight(0.2, 0.5, 1 + prop / 2);
            rp.color.setDark((1 - prop) / 5, prop, (1 - prop),);
            // console.log(rp.y)
            rp.color.alpha = (1 - prop) * o.alpha;
        };
        xx.wait(2).kill().apply();
        return 0.4
    }

    OrbEffect(target: O): number {
        let x = new O([target.pos[0], target.pos[1]]);
        let total = 1.2;
        x.gfx = _.cs("bloodorb.png", _.sm.effects);
        let inner = _.cs("bloodorb.png", x.gfx);
        inner.alpha = 0.5;
        inner.scale.x = 0.6;
        inner.scale.y = 0.6;
        x.gfx.scale.x = 0.2;
        x.gfx.scale.y = 0.2;
        //x.av = 0.1;
        new TweenMax(inner, total, {rotation: 15});
        new TweenMax(x.gfx.scale, 0.4, {x: 0.8, y: 0.8});
        new TweenMax(inner.scale, 0.2, {delay: 0.4, x: 1, y: 1, yoyo: true, repeat: 4});

        let powerx = 2.2;
        let powery = 2.2;
        new TweenMax(x, total, {y: x.y - 150});
        for (let i = 0; i < 5; i++) {
            let xx = new TrainEffect(m.angleDist([x.pos[0], x.pos[1]], 24, i * (2 * Math.PI / 5)));
            xx.init({
                gfx: "evilfog2.png",
                layer: _.sm.effects,
                blendmode: PIXI.BLEND_MODES.NORMAL,
                totalPoints: 20,
                historyPoints: 60,
                scaleX: 0.18,
                scaleY: 0.18
            });



            let prevProcess = xx.process.bind(xx);
            let phase = i;
            let start = _.time;
            let len = xx.gfx.points.length;
            xx.pointFunc = (point: RopePoint, p: number) => {
                point.scale = 0.8 - _.fMath.cos((_.time - start) / 700 + p) / 2;
                point.color.setLight(1 * (p / len), 0., (p / len) / 2);
                point.color.setDark(0.65, 0, (p / len) / 2);
                point.color.alpha = (1 - p / len) * xx.gfx.alpha;
            };


            let dest = m.angleDist([x.pos[0], x.pos[1]], 24, (i + 3) * (2 * Math.PI / 5));
            new TweenMax(xx, 0.3, {x: dest[0], y: dest[1]});
            new TweenMax(xx.gfx, 0.65, {delay: total, alpha: 0.,});

            xx.process = function () {
                let dist = Math.sqrt(m.sqdist(this.pos, x.pos));
                this.v[0] = -4 * (this.x - x.x) / (dist + 10);
                this.v[1] = -4 * (this.y - x.y) / (dist + 10);
                this.v = m.rv2(this.v, _.fMath.cos(phase) / 100.);
                this.pos[0] -= _.fMath.cos((_.time - start) / 2000. + phase) * powerx;
                this.pos[1] -= _.fMath.sin((_.time - start) / 2800. + phase) * powery;
                prevProcess();
            };
            xx.wait(total + 0.5 + 0.15).kill().apply();
            x.linkObj(xx);

        }

        x.wait(total).call(() => {
            new TweenMax(x.gfx, 0.3, {alpha: 0.,});
            new TweenMax(x.gfx.scale, 0.3, {x: 1.2, y: 1.2});
            x.wait(0.3).kill().apply();
        }).apply();
        return total + 0.3;
    }

    StunArrow(effectDealer: O, effectTaker: O): number {
        let totalAnim = 0.6;
        let arrow = O.cin(O, [effectDealer.pos[0] - 300, effectDealer.pos[1] - 240], _.cs("STUN_ARROW.png", _.sm.effects));
        arrow.gfx.scale.set(0.35);
        let dest: Vec2 = [effectTaker.x, effectTaker.y - 150];
        let tw = new TweenMax(arrow, totalAnim * 0.5, {x: dest[0]});
        new TweenMax(arrow, totalAnim * 0.5, {y: dest[1], ease: Linear.easeOut});
        new TweenMax(arrow.gfx.scale, totalAnim * 0.5, {x: 0.45, y: 0.45});
        new TweenMax(arrow.gfx, 0.15, {delay: totalAnim * 0.5, alpha: 0});
        _.sound.play("miss 2");
        let train = O.cin(TrainEffect, [arrow.pos[0] - 12, arrow.pos[1] - 2], null, {
            gfx: "bar1.png",
            layer: _.sm.effects,
            blendmode: PIXI.BLEND_MODES.ADD,
            totalPoints: 8,
            historyPoints: 15,
            scaleX: 0.5,
            scaleY: 0.5
        });
        let o = {alpha: 1};
        train.pointFunc = (rp: RopePoint, prop: number) => {
            let v = tw.progress();
            let cc = Math.abs(_.fMath.cos(prop * 2));
            rp.color.setLight(0.5, cc, 0.2 + prop / 2);
            rp.color.setDark((1 - v), 0., (1 - v) / 5,);
            rp.color.alpha = (1 - prop * prop)*o.alpha;
        };

        arrow.wait(totalAnim * 0.43).call(() => {
            _.sound.play("macehit");
            this.Explosion(dest[0], dest[1]);
        }).apply();
        arrow.wait(totalAnim * 0.3).call(() => {
            this.AddSparkles(dest[0], dest[1], 5);
        }).apply();
        arrow.rotateTo(dest, -3 * Math.PI / 4);
        arrow.linkObj(train);
        // arrow.extendProcess(()=>{
        //});
        new TweenMax(o, 0.6, {alpha: 0, delay: 0.8});
        train.wait(1.4).kill().apply();
        arrow.wait(totalAnim * 0.9).kill().apply();
        return totalAnim
    }

    HolyWater(effectDealer: O, effectTaker: O): number {
        let durSec = 0.8;

        for (let j = 0; j < 40; j++) {
            ((j) => {

                let o = new O(m.angleDist([effectDealer.pos[0], effectDealer.pos[1] - 150], Math.random() * 25, 25 * Math.random()));
                o.gfx = _.cm("heal", _.sm.effects, true, null);
                o.gfx.scale.x = 0.9;
                o.gfx.scale.y = 0.9;
                o.av = Math.random() / 20;
                o.gfx.gotoAndPlay(Math.floor(Math.random() * o.gfx.totalFrames));
                o.gfx.animationSpeed = 0.245 + Math.random() * 0.08;

                o.v[0] = 5 + 1.5 * Math.random();
                o.v[1] = -7 - 2 * Math.random();
                o.wait(durSec).kill().apply();
                let globAlpha = {alpha: 1};

                new TweenMax(globAlpha, Math.random() * 0.25, {delay: Math.random() * 0.2, alpha: 1.});
                o.gfx.color.setDark(0.7 + Math.random() * 0.1, 0.6 + Math.random() * 0.2, Math.random() * 0.2);
                o.extendProcess(() => {
                    //o.v[0] = _.fMath.cos(_.time / freq) * amplitude;
                    o.gfx.alpha = Math.abs(_.fMath.cos((o.gfx.currentFrame + j) / 60)) * globAlpha.alpha;
                    o.v[0] += 0.075;
                    o.v[1] += 0.23 + Math.random() / 14;
                });

                let fadetime = Math.random() * 0.25 + 0.1;
                new TweenMax(globAlpha, fadetime, {alpha: 0, delay: durSec - fadetime});
                o.gfx.loop = true;
            })(j)
        }

        return durSec;
    }

    private AddSparkles(x: number, y: number, amount: number, pow: number = 1., baseScale: number = 0.4) {
        let o = {alpha: 1};

        let pf = (rp: RopePoint, prop: number) => {
            let cc = Math.abs(_.fMath.cos(prop * 2));
            rp.color.setLight(0.8, 0.8, 0.8);
            rp.color.setDark((1 - prop) / 2, (1 - prop) / 4, (1) / 10,);
            rp.color.alpha = (1 - prop * prop) * (o.alpha);
        };

        new TweenMax(o, 0.3, {delay: 0.5, alpha: 0});
        for (let i = 0; i < amount; i++) {
            ((i: number) => {
                TweenMax.delayedCall(0.17 * Math.random(), () => {
                    let train = O.cin(TrainEffect, [x, y], null, {
                        gfx: "bar1.png",
                        layer: _.sm.effects,
                        blendmode: PIXI.BLEND_MODES.ADD,
                        totalPoints: 8,
                        historyPoints: 15,
                        scaleX: baseScale + Math.random()*0.1,
                        scaleY: baseScale + Math.random()*0.1
                    });
                    train.v[0] = 15 * (Math.random() - 0.5)*pow;
                    train.v[1] = -4 * (Math.random() + 2);
                    let grav = 1.8 + 0.5 * (Math.random() - 0.5);
                    let bounce = 0.6 + Math.random() * 0.2;
                    train.extendProcess(() => {
                        train.v[1] += grav;
                        if (train.y > 1200) {
                            train.v[1] = -train.v[1] * bounce;
                        }
                    });
                    train.wait(0.8).kill().apply();
                    train.pointFunc = pf;
                })
            })(i)
        }
    }

    OilPuddle(effectDealer: O, effectTaker: O): number {
        let puddle = _.cs("puddle.png");
        effectTaker.gfx.addChildAt(puddle, 0);
        puddle.y = 15;
        puddle.scale.x = 0.1;
        puddle.scale.y = 0.6;
        puddle.skew.x = 0.2;

        for (let s = 0; s < 4; s ++) {
            effectDealer.wait(Math.random()*0.25).call(()=>{
                let pp = _.cs("puddle.png");
                effectTaker.gfx.addChildAt(pp, 0);
                pp.x = 70 * (Math.random() - 0.5);
                pp.y = 22 * (Math.random() - 0.5) + 15;
                pp.scale.x = 0.1;
                pp.scale.y = 0.6;
                pp.skew.x = 0.2;
                new TweenMax(pp.scale, 0.7, {x: 0.6, y: 0.6});
                new TweenMax(pp.skew, 0.7, {x: 0, y: 0});
                new TweenMax(pp.scale, 0.3, {x: 0.01, y: 0.01, delay: 1. + Math.random()*0.4, onComplete:function () {
                        O.rp(pp)
                    }});
            }).apply();
        }

        let max = 9;
        for (let i = 0; i < max; i++) {
            ((i)=>{
                effectTaker.wait(Math.abs((i - max / 2) * 0.05)).call(()=>{
                    let xx = new TrainEffect([effectTaker.pos[0] + (i - max / 2)*20, effectTaker.pos[1] + 25 + 15*(Math.random() - 0.5)]);
                    xx.init({
                        gfx: "puddle.png",
                        layer: _.sm.effects,
                        blendmode: PIXI.BLEND_MODES.NORMAL,
                        totalPoints: 10,
                        historyPoints: 70,
                        scaleX: 0.1 + Math.random()*0.1,
                        scaleY: 0.1 + Math.random()*0.1
                    });
                    let prevProcess = xx.process.bind(xx);
                    let start = _.time;
                    let len = xx.gfx.points.length;
                    let thisScale = {scale: 1};
                    xx.pointFunc = (point: RopePoint, p: number) => {
                        point.color.setLight(0.02, 0.02, 0.03);
                        point.color.alpha = thisScale.scale;
                    };

                    //new TweenMax(xx, 0.3, {x: dest[0], y: dest[1]});
                    new TweenMax(xx.gfx, 0.65, {delay: 1.2, alpha: 0.,});
                    let phase = i;
                    let amplitude = 0.6 + (i % 2) / 4;
                    let baseyspeed = Math.random() + 1;
                    xx.process = function () {
                        this.v[0] = (Math.random() - 0.5)*2.2;
                        this.v[1] = Math.random() / 3. + baseyspeed / 3.3;//+ _.fMath.sin(_.time / 100 + 2*phase)*amplitude*2;
                        prevProcess();
                    };
                    xx.wait(0.6 + Math.random()*0.6).call(()=>{
                        new TweenMax(thisScale, 0.4, {scale: 0.01});
                    }).wait(0.4).kill().apply();
                }).apply();
            })(i);
        }

        new TweenMax(puddle.scale, 0.7, {x: 1, y: 1});
        new TweenMax(puddle.skew, 0.7, {x: 0, y: 0});
        new TweenMax(puddle.scale, 0.2, {x: 0.01, y: 0.01, delay: 1.5, onComplete: function () {
                O.rp(puddle)
            }});
        return 1.7
    }

    Grenade2Targets(o: O): number {
        let grenadeObj = new O([o.pos[0] - 200, o.pos[1] - 250], _.cs("GRENADE.png", _.sm.effects));
        grenadeObj.gfx.color.setLight(0.3, 0.3, 0.3);
        grenadeObj.gfx.scale.set(0.6);
        grenadeObj.av = 0.1;
        grenadeObj.v[0] = 6;
        grenadeObj.v[1] = -2;
        let grav = 0.4;

        let train = O.cin(TrainEffect, m.v2cp(grenadeObj.pos), null, {
            gfx: "bar1.png",
            layer: _.sm.effects,
            blendmode: PIXI.BLEND_MODES.ADD,
            totalPoints: 8,
            historyPoints: 30,
            scaleX: 0.5,
            scaleY: 0.5
        });
        train.delta = -1;
        train.pointFunc = (rp: RopePoint, prop: number) => {
            let cc = Math.abs(_.fMath.cos(prop * 2));
            rp.color.setLight(0.5, cc, 0.2 + prop / 2);
            rp.color.setDark((1 - prop), 0., (1 - prop) / 5,);
            rp.color.alpha = (1 - prop * prop)*train.gfx.alpha;
        };
        new TweenMax(train.gfx, 0.2, {delay: 0.6, alpha: 0, onComplete: ()=>{
            train.killNow();
            }});

        let offset: Vec2 = [23, -23];
        grenadeObj.extendProcess(()=>{
            let offs = m.rv2(offset, grenadeObj.a);
            train.x = grenadeObj.x + offs[0]*grenadeObj.gfx.scale.x;
            train.y = grenadeObj.y + offs[1]*grenadeObj.gfx.scale.y;
            grenadeObj.v[1] += grav;
        });

        o.wait(0.6).call(()=>{
            grenadeObj.killNow();
            let gr = this.Grenade([o.pos[0], o.pos[1] - 70]);
            o.wait(0.2).call(()=>{
                this.Grenade([o.pos[0] + 100, o.pos[1] - 70]);
            }).apply();
        }).apply();

        return 0.9;
    }

    Grenade(p: Vec2): number {
        let light = new Light(p);
        light.gfx = _.cs("light3.png", _.sm.main);
        light.gfx.color.setLight(1, 0.1, 0.1);
        light.gfx.color.setDark(0.3, 0, 0);
        light.addToScene();
        light.gfx.scale.set(0.01);
        for (let x = 0; x < 2; ++x) {
            let pp = m.radiusOver(p, 22);
            light.wait(0.05 + x*0.15).call(()=>{
                this.Explosion(pp[0], pp[1]);
            }).apply();
        }
        this.AddSparkles(p[0], p[1], 5, 1.3, 0.3);

        new TweenMax(light.gfx.scale, 0.2, {x: 1.4, y: 1.4});
        new TweenMax(light.gfx.scale, 0.1, {delay: 0.2, x: 0.0001, y: 0.0001});
        light.wait(1).kill().apply();
        return 1.2;

    }

    AffixDestroy(affixGfx: PIXI.heaven.Sprite) {
        let time = 1;
        let mskSprite = _.cs("maskDestroy", affixGfx);
        mskSprite.color.setDark(1, 1, 1);
        mskSprite.x = 30;
        mskSprite.scale.set(7);
        affixGfx.x += 5 / 2;
        TweenMax.to(affixGfx, 0.08, {x: affixGfx.x + 5, yoyo: true, repeat: 8});
        TweenMax.to(affixGfx.scale, 1.3*time, {y: 1.2, ease: TOWER_EASE.easeOut});
        TweenMax.to(mskSprite.scale, 1.1*time, {ease: TOWER_EASE.easeOut, x: 0.8, y: 0.8});
        TweenMax.to(mskSprite, 1.1*time, {y: 290, ease: TOWER_EASE.easeOut});
        affixGfx.mask = mskSprite;
    }
}