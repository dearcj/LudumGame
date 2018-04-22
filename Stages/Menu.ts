import {Stage} from "../Neu/Stage";
import {_} from "../main";
import {Button} from "../Neu/BaseObjects/Button";

export class Menu extends Stage {

    onShow() {
        super.onShow();

        _.lm.load(this, "menu");
        let btn = <Button>_.sm.findOne("startbtn");
        btn.click = () => {
            _.sm.openStage(_.game)
        }
    }

}