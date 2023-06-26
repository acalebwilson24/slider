import { SliderEvent, ISlidable, ISlider, SliderEventType } from "@/types";

export default class Slider implements ISlider {
    slidables: ISlidable[] = [];
    isNull: boolean = false;
    get activeIndex(): number | null {
        if (this.isNull) {
            return null;
        }
        const index = this.slidables.findIndex((slidable) => slidable.isActive);
        if (index == -1) {
            return null;
        } else {
            return index;
        } 
    }
    get isLast(): boolean {
        if (this.activeIndex === null) return false;
        return this.activeIndex == this.slidables.length - 1;
    }
    get isFirst(): boolean {
        if (this.activeIndex === null) return false;
        return this.activeIndex == 0;
    }


    private nextFuncs: ((event: SliderEvent) => void)[] = [];
    private prevFuncs: ((event: SliderEvent) => void)[] = [];
    private slideFuncs: ((event: SliderEvent) => void)[] = [];
    private noneFuncs: ((event: SliderEvent) => void)[] = [];

    constructor(slidables?: ISlidable[]) {
        if (slidables) {
            this.slidables = slidables;
        }
        // set the first slide to active
        this.goToFirstSlide();
    }

    add(slidable: ISlidable): void {
        if (this.slidables.includes(slidable)) {
            return;
        }
        this.slidables.push(slidable);
    }

    remove(slidable: ISlidable): void {
        if (!this.slidables.includes(slidable)) {
            return;
        }

        const index = this.slidables.indexOf(slidable);
        const isActive = slidable.isActive;
        if (index !== -1) {
            this.slidables.splice(index, 1);
            slidable.remove && slidable.remove();
        }

        if (this.slidables.length === 0) {
            this.goTo(null);
        } else if (isActive) {
            if (index > this.slidables.length - 1) {
                this.goTo(this.slidables.length - 1);
            } else {
                this.goTo(index);
            }
        } else {
            this.goTo(this.activeIndex);
        }
    }

    goTo(x: number | null): void {
        let newIndex = x;
        let prevIndex = this.activeIndex;
        if (x === null) {
            this.slidables.forEach((slidable, index) => {
                slidable.goTo(null, index);
            });
            this.isNull = true;
        } else {
            // if x is below 0, set it to 0
            // if x is above the length of the slidables, set it to the length of the slidables
            newIndex = Math.max(0, Math.min(x, this.slidables.length - 1));
    
            this.slidables.forEach((slidable, index) => {
                slidable.goTo(newIndex, index);
            });
            this.isNull = false;
        } 

        this.slideFuncs.forEach((callback) => callback({ slider: this, newIndex, prevIndex }));
        if (x === null) {
            this.noneFuncs.forEach((callback) => callback({ slider: this }));
        }
    }

    nextSlide(): void {
        if (this.activeIndex !== null) {
            this.goTo(this.activeIndex + 1);
        } else {
            this.goToFirstSlide();
        }
        this.nextFuncs.forEach((callback) => callback({ slider: this }));
    }

    prevSlide(): void {
        if (this.activeIndex !== null) {
            this.goTo(this.activeIndex - 1);
        } else {
            this.goToLastSlide();
        }

        this.prevFuncs.forEach((callback) => callback({ slider: this }));
    }

    goToFirstSlide(): void {
        this.goTo(0);
    }

    goToLastSlide(): void {
        this.goTo(this.slidables.length - 1);
    }

    on(event: SliderEventType, func: (slider: SliderEvent) => void): void {
        if (event == "next") {
            this.nextFuncs.push(func);
        } else if (event == "prev") {
            this.prevFuncs.push(func);
        } else if (event == "slide") {
            this.slideFuncs.push(func);
        } else if (event == "none") {
            this.noneFuncs.push(func);
        }
    }

    get(index: number) {
        if (index >= 0 && index <= this.slidables.length - 1) {
            return this.slidables[index];
        }
    }
}



