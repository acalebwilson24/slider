import { ISlidable, ISlider } from "@/types";
import Slider from ".";
import ExampleSlidable from "../ExampleSlidable";

describe('Slider', () => {
    let slider: ISlider;
    let slideables: ISlidable[];

    beforeEach(() => {
        slider = new Slider();
        slideables = [];
        for (let i = 0; i < 5; i++) {
            const slidable: ISlidable = new ExampleSlidable();
            slideables.push(slidable);
        }
    })

    it('should add a slidable', () => {
        slider.add(slideables[0]);
        expect(slider.slidables).toHaveLength(1);
    });

    it('should begin at null', () => {
        expect(slider.activeIndex).toBe(null);
    })

    it('should go to a slide', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goTo(1);
        expect(slider.slidables[0].isActive).toBe(false);
        expect(slider.slidables[1].isActive).toBe(true);
        slider.goTo(0);
        expect(slider.slidables[0].isActive).toBe(true);
        expect(slider.slidables[1].isActive).toBe(false);
    });

    it('should go to the first slide', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToFirstSlide();
        expect(slider.slidables[0].isActive).toBe(true);
        expect(slider.slidables[1].isActive).toBe(false);
    });

    it('should go to the last slide', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToLastSlide();
        expect(slider.slidables[0].isActive).toBe(false);
        expect(slider.slidables[1].isActive).toBe(true);
    })

    it('should go to the next slide', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToFirstSlide();
        slider.nextSlide();
        expect(slider.slidables[0].isActive).toBe(false);
        expect(slider.slidables[1].isActive).toBe(true);
    });

    it('should go to the previous slide', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToLastSlide();
        slider.prevSlide();
        expect(slider.slidables[0].isActive).toBe(true);
        expect(slider.slidables[1].isActive).toBe(false);
    });

    it('should get active index', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        expect(slider.activeIndex).toBe(null);

        slider.goTo(1);
        expect(slider.activeIndex).toBe(1);

        slider.goTo(null)
        expect(slider.activeIndex).toBe(null);
    })

    it('should return isFirst', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToFirstSlide();
        expect(slider.isFirst).toBe(true);

        slider.goToLastSlide();
        expect(slider.isFirst).toBe(false);

        slider.goTo(null)
        expect(slider.isFirst).toBe(false);
    })

    it('should return isLast', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.goToFirstSlide();
        expect(slider.isLast).toBe(false);

        slider.goToLastSlide();
        expect(slider.isLast).toBe(true);

        slider.goTo(null)
        expect(slider.isLast).toBe(false);
    })

    it('should remove a slidable', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.add(slideables[2]);
        
        slider.goTo(0);
        slider.remove(slideables[0]);
        expect(slider.slidables).toHaveLength(2);
        expect(slider.slidables[0]).toBe(slideables[1]);
        expect(slideables[1].isActive).toBe(true);

        slider.goToLastSlide();
        slider.remove(slider.slidables[slider.slidables.length - 1]);
        expect(slider.slidables).toHaveLength(1);
        expect(slider.slidables[0]).toBe(slideables[1]);
        expect(slideables[1].isActive).toBe(true);
    });

    it('should allow assigning slidables at construction', () => {
        const slider = new Slider(slideables);
        expect(slider.slidables).toHaveLength(5);
    })

    it('should prevent removing a slidable that is not in the slider', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.add(slideables[2]);
        slider.remove(slideables[3]);
        expect(slider.slidables).toHaveLength(3);
    })

    it('should goto null when there are no slides left after removal', () => {
        slider.add(slideables[0]);
        slider.goTo(0);
        slider.remove(slideables[0]);
        expect(slider.activeIndex).toBe(null);
    })

    it('should persist the active slidable if the removed slidable is not active', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.add(slideables[2]);
        slider.add(slideables[3]);
        slider.add(slideables[4]);
        slider.goTo(3);
        slider.remove(slideables[0]);
        expect(slider.activeIndex).toBe(2);
        slider.remove(slideables[2]);
        expect(slider.activeIndex).toBe(1);
    })

    it('should prevent going out of bounds', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.add(slideables[2]);
        slider.goTo(0);
        slider.prevSlide();
        expect(slider.activeIndex).toBe(0);
        slider.goToLastSlide();
        slider.nextSlide();
        expect(slider.activeIndex).toBe(2);
    })

    it('should prevent adding a slidable that is already in the slider', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.add(slideables[2]);
        slider.add(slideables[2]);
        expect(slider.slidables).toHaveLength(3);
    })

    it('should handle transitioning from null to a slide on next and prev', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.nextSlide();
        expect(slider.activeIndex).toBe(0);
        slider.goTo(null);
        slider.prevSlide();
        expect(slider.activeIndex).toBe(1);
    })

    it('should call observers', () => {
        const slideObserver = jest.fn();
        const nextObserver = jest.fn();
        const prevObserver = jest.fn();
        const noneObserver = jest.fn();
        slider.on('slide', slideObserver);
        slider.on('next', nextObserver);
        slider.on('prev', prevObserver);
        slider.on('none', noneObserver);
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        slider.nextSlide();
        expect(slideObserver).toHaveBeenCalledTimes(1);
        expect(nextObserver).toHaveBeenCalledTimes(1);
        expect(prevObserver).toHaveBeenCalledTimes(0);
        expect(noneObserver).toHaveBeenCalledTimes(0);

        slider.prevSlide();
        expect(slideObserver).toHaveBeenCalledTimes(2);
        expect(nextObserver).toHaveBeenCalledTimes(1);
        expect(prevObserver).toHaveBeenCalledTimes(1);
        expect(noneObserver).toHaveBeenCalledTimes(0);

        slider.goTo(null);
        expect(slideObserver).toHaveBeenCalledTimes(3);
        expect(nextObserver).toHaveBeenCalledTimes(1);
        expect(prevObserver).toHaveBeenCalledTimes(1);
        expect(noneObserver).toHaveBeenCalledTimes(1);
    })


    it('should return a slidable or undefined', () => {
        slider.add(slideables[0]);
        slider.add(slideables[1]);
        expect(slider.get(0)).toBe(slideables[0]);
        expect(slider.get(1)).toBe(slideables[1]);
        expect(slider.get(2)).toBe(undefined);
    })
})