import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";
import {MapCell} from "../Stages/Game";



export class CellObject extends O {
    cell: MapCell;
    public reactOnMove: boolean = false;
    onTurnEnd() {

    }

    protected setMyCell_noOCCUPY() {
        let cellcoord = _.game.getObjectCell(this);
        this.cell = _.game.map[cellcoord[0]][cellcoord[1]];

    }

    onPlayerMovePriority() {
    }

    onPlayerMove(): boolean {
        return true;
    }

    setCell(cell: MapCell) {
        this.cell = cell;
        this.alignToCell();
    }

    public alignToCell() {
        if (this.cell) {
            let cp = _.game.getCellPoint(this.cell.x, this.cell.y);
            this.pos[0] = cp[0];
            this.pos[1] = cp[1];
        }
        _.sm.camera.updateTransform(this, this.gfx);
    }
}
