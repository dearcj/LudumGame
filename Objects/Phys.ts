import {O} from "../Neu/BaseObjects/O";
import {Bodies} from "../lib/matter";

export class Phys extends O {

    init(props: any) {
        super.init(props);

        this.body =  Bodies.circle(this.pos[0], this.pos[1], 7, {  });
    }
}