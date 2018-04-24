import {TweenMax} from "../Neu/Application";

type AnimType = {
    after?: Function,
    f: Function,
    dur: number,
}

type QueueBranch = {
    animations: Array<AnimType>,
    runningFunc: Function,
}

export class AnimationManager {
    private branches: { [key: string]: QueueBranch; } = {};
    //private lastSkill: Function;
    private useSkillFinish: Function;
    inSkillAnimation: boolean = false;
    private doRemove: boolean = false;

    constructor() {
        let arr: Array<AnimType> = [];
        this.addBranch("default");
    }

    addBranch(branchName: string) {
        let arr: Array<AnimType> = [];
        this.branches[branchName] = {
            animations: arr,
            runningFunc: null,
        }
    }


    destroy() {
        this.branches = null;
    }

    updateAnimations() {
        for (let branchName in this.branches) {
            let branch = this.branches[branchName];
            let animations = branch.animations;
            if (animations.length == 0) {
                continue;
            }

            if (!branch.runningFunc) {
                let x = 0;
                while (animations.length > 0) {
                    let a = animations[0];
                    if (a) {
                        if (a.after) {
                            if (this.isQueueFunc(a.after))
                                return;
                        }

                        if (a.dur == 0) {
                            branch.runningFunc = a.f;
                            animations.splice(x, 1);
                            a.f();
                            branch.runningFunc = null;
                        } else {
                            branch.runningFunc = a.f;
                            animations.splice(x, 1);
                            a.f();
                            TweenMax.delayedCall(a.dur, () => {
                                branch.runningFunc = null;

                                if (animations.length == 0) {
                                    return
                                }

                                this.updateAnimations();
                            });
                            break;
                        }
                    }
                }
            }
        }
    }


    doAfter(after: Function, f: Function, durationSecs: number, branch: string = "default"): Function {
        if (!this.branches[branch]) this.addBranch(branch);
        this.branches[branch].animations.push({after: after, f: f, dur: durationSecs});
        if (!this.branches[branch].runningFunc)
            this.updateAnimations();
        return f
    }

    do(f: Function, durationSecs: number = 0, branch: string = "default"): Function {
        if (this.doRemove) return;
        if (!this.branches[branch]) this.addBranch(branch);
        this.branches[branch].animations.push({f: f, dur: durationSecs});
        if (!this.branches[branch].runningFunc)
            this.updateAnimations();
        return f
    }



    private isQueueFunc(after: ((asyncId: number) => void) | Function): boolean {
        for (let b in this.branches) {
            if (this.branches[b].runningFunc == after) {
                return true
            }

            let anims = this.branches[b].animations;
            for (let a in anims) {
                if (anims[a].f == after) return true
            }
        }
        return false;
    }

    block(delaySecs: number, branch: string = 'default') {
        if (!this.branches[branch]) this.addBranch(branch);
        console.log("Blocking for ", delaySecs, " seconds");
        this.branches[branch].animations.unshift({
            f: () => {
            }, dur: delaySecs
        });
        if (!this.branches[branch].runningFunc)
            this.updateAnimations();
    }

    remove() {
        this.doRemove = true;
    }
}