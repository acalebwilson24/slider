import { ISlidable } from "../types";

export abstract class BaseSlidable implements ISlidable {
    slidable?: ISlidable | undefined;
    abstract isActive: boolean;

    constructor(slidable?: ISlidable) {
        if (slidable) {
            this.slidable = slidable;
        }
    }

    goTo(x: number | null, index: number): void {
        if (this.slidable) {
            this.slidable.goTo(x, index);
        }
    }
}


export class ExampleDecoratorSlidable extends BaseSlidable {
    get isActive(): boolean {
        if (this.slidable) {
            return this.slidable.isActive;
        } else {
            return false;
        }
    }

    goTo(x: number | null, index: number): void {
        super.goTo(x, index);
        console.log(`decorator: ${index}`)
    }
}

export default class ExampleSlidable extends BaseSlidable {
    isActive: boolean = false;

    goTo(x: number | null, index: number): void {
        super.goTo(x, index);
        this.isActive = index === x;
    }

    remove(): void {
        console.log('removed')
    }
}