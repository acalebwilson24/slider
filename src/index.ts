import ExampleSlidable, { ExampleDecoratorSlidable } from "./classes/ExampleSlidable";
import Slider from "./classes/Slider";

const slider = new Slider();

slider.on("slide", ({ newIndex, prevIndex }) => {
    console.log(`from: ${prevIndex} to ${newIndex}`)
})

slider.on("none", () => {
    console.log("none")
})

// create array of 5 numbers
const slidables = Array.from(Array(5).keys()).map(i => {
    const example = new ExampleSlidable();
    const decorator = new ExampleDecoratorSlidable(example);
    return example;
});

// add each number to the slider
slidables.forEach(slidable => slider.add(slidable));

// go to the 3rd slide
slider.goTo(2);

console.log(slider.slidables.map(slidable => slidable.isActive))

// go to the 5th slide
slider.goTo(4);

console.log(slider.slidables.map(slidable => slidable.isActive))

slider.nextSlide();

console.log(slider.slidables.map(slidable => slidable.isActive))

slider.prevSlide();
slider.prevSlide();
slider.prevSlide();

console.log(slider.slidables.map(slidable => slidable.isActive))

slider.goTo(200)

console.log("Should be set to last slide")
console.log(slider.slidables.map(slidable => slidable.isActive))

slider.goTo(-12)

console.log("Should be set to first slide")
console.log(slider.slidables.map(slidable => slidable.isActive))

slider.goTo(null)

console.log("Should be set to null")
console.log(slider.slidables.map(slidable => slidable.isActive))

slider.goTo(0)
slider.remove(slidables[0])

console.log("Should be set to second (now first) slide")
console.log(slider.slidables.map(slidable => slidable.isActive))

slider.goTo(2)
console.log(slider.slidables.map(slidable => slidable.isActive))
console.log("remove 2nd slide")
slider.remove(slider.slidables[1])
console.log(slider.slidables.map(slidable => slidable.isActive))
