/**
 * Sort of just a fancy array.
 */
export interface ISlider {
    slidables: ISlidable[];
    activeIndex: number | null;
    isLast: boolean;
    isFirst: boolean;
    add(slidable: ISlidable): void;
    remove(slidable: ISlidable): void;
    goTo(x: number | null): void;
    nextSlide(): void;
    prevSlide(): void;
    goToFirstSlide(): void;
    goToLastSlide(): void;
    on(event: SliderEventType, func: (event: SliderEvent) => void): void;
    get(x: number): ISlidable | undefined;
}

export interface ISlidable {
    isActive: boolean;
    /**
     * Allows decoration, for example to stack transforms.
     */
    slidable?: ISlidable;
    /**
     * Called by slider - allows each slide to determine how it should be displayed.
     * @param x - Index of the active slide.
     * @param index - Index of this slide.
     */
    goTo(x: number | null, index: number): void;
    remove?: (() => void);
}

export type SliderEvent = {
    slider: ISlider,
    newIndex?: number | null,
    prevIndex?: number | null
}

export type SliderEventType = "next" | "prev" | "slide" | "none"