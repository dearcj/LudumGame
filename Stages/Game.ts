import {Stage} from "../Neu/Stage";
import {_} from "../main";
import {ColorGradingShader} from "../shaders/ColorGradingShader";

export class Game extends Stage {
    onShow() {
        super.onShow();

        _.lm.load(this, "game");
        _.sm.main.filters = [new ColorGradingShader('atlas/allluts.png', 0)];
    }
}
