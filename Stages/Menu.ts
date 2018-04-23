import {Stage} from "../Neu/Stage";
import {_} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import BitmapText = PIXI.extras.BitmapText;
import {TweenMax} from "../Neu/Application";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {O} from "../Neu/BaseObjects/O";

export class Menu extends Stage {

    AnimText(bt: BitmapText): void{
        let count = 0;
        let enters = 0;
        for (let g of (<any>bt)._glyphs) {
            g.visible = false;
            if (bt.text.charAt(count) == '\n') {
                enters ++;
            }
            count ++;


            ((g) => {
                _.sm.camera.setTimeout(()=>{
                    new TweenMax(g, 0.09, {y: g.y + 3, yoyo: true, repeat: 1});
                    g.visible = true;
                }, count*0.03 + enters)
            })(g);
        }
    }

    onShow() {
        super.onShow();
        _.lm.load(this, "menu");

        _.sm.findOne("tut1").gfx.alpha = 0;
        _.sm.findOne("tut2").gfx.alpha = 0;


        let btn = _.sm.findOne("playbtn");

        (<Button>_.sm.findOne("startbtn")).click = () => {
            _.sm.openStage(_.game)
        };

        let start = _.sm.findOne("startbtn");

        btn.gfx.click = () => {
            TweenMax.to(_.sm.findOne("tut1").gfx, 0.5, {alpha: 1.});
            TweenMax.to(_.sm.findOne("tut2").gfx, 0.5, {alpha: 1});
            TweenMax.to(this.layers["part1"], 0.2, {alpha: 0});

            start.x = btn.x;
           // start.y = btn.y-154;
            _.sm.camera.updateTransform(start, start.gfx);
            start.process();
            btn.x = 10000;
        }
    }

}