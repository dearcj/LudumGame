import {Stage} from "../Neu/Stage";
import {_} from "../main";

export class Game extends Stage {
    onShow() {
        super.onShow();

        _.lm.load(this, "game")
    }
}
