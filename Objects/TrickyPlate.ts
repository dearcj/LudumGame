import {_} from "../main";
import {CellObject} from "./CellObject";

export class TrickyPlate extends CellObject {
    private preRemove: boolean = false;
    init(props) {
        super.init(props);

        this.setMyCell_noOCCUPY();
    }


    onPlayerMovePriority() {
        if (this.preRemove) {
            this.die();
        }

        if (_.game.player.cell == this.cell) {
            this.preRemove = true;
        }

        return true;
    }

    private die() {
        this.preRemove = false;
        _.pa.AffixDestroy(this.gfx);
        _.game.anim.block(0.45);
        this.cell.isWall = true;
        this.wait(1.5).kill().apply();
    }
}