import {CellObject} from "./Player";
import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";

export class Exit extends CellObject {
    init(p: any) {
        this.gfx = _.cs("exit");
        this.layer.addChildAt(this.gfx, 0);
        this.setMyCell_noOCCUPY();
        super.init();
    }

    onPlayerMove(): boolean {
        if (_.game.player.cell == this.cell) {

            console.log("WIN!!!")
        }
        return true;
    }

}