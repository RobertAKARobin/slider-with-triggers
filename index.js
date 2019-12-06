class Slider {
    // `scope` is just an element within which JS should search for the elements below
    // This way you can have multiple sliders on one page, independent of each other
    constructor(scope, options = {}) {
        this.el = {
            // The child elements of the `container` element become "slides"
            container:  scope.querySelector('[data-slider-container]'),
            // Can have any number of `triggers`, located anywhere within the scope
            // Attribute value should be "left" or "right"
            directionTriggers:   Array.from(scope.querySelectorAll('[data-slider-direction]')),
        };
        this.options = {
            ...options,
            stepMS: 10,
            stepDistance: 20,
        };
        this.state = {
            interval: null,
        };

        const handleClick = event => {
            // Prevent multiple scrolls e.g. if someone clicks the buttons rapidly
            clearInterval(this.state.interval);

            const containerCurrentOffset = this.el.container.scrollLeft;
            const containerWidth = this.el.container.getBoundingClientRect().width;
            const directionIntended = event.target.dataset.sliderDirection;

            // Get the place/position of the slide that is currently most visible
            const currentPlace = Math.round(containerCurrentOffset / containerWidth);
            let targetPlace;
            if (directionIntended === 'left') {
                targetPlace = currentPlace - 1;
            } else if (directionIntended === 'right') {
                targetPlace = currentPlace + 1;
            }

            // Go to the first slide if clicking "right" on the last slide, and vice-versa
            const numberOfSlides = this.el.container.children.length;
            if (targetPlace >= numberOfSlides) {
                targetPlace = 0;
            } else if (targetPlace < 0) {
                targetPlace = numberOfSlides - 1;
            }

            const directionMultiplier = (targetPlace <= currentPlace ? -1 : 1);
            const targetOffset = (targetPlace * containerWidth);
            const step = () => {
                this.el.container.scrollLeft += (directionMultiplier * this.options.stepDistance);

                // If it scrolled past the target offset, then go to the target offset and stop
                const remainingOffset = (targetOffset - this.el.container.scrollLeft);
                if ((directionMultiplier * remainingOffset) <= 0) {
                    this.el.container.scrollLeft = targetOffset;
                    clearInterval(this.state.interval);
                }
            };
            this.state.interval = setInterval(step, this.options.stepMS);
        };

        for (let trigger, i = 0; trigger = this.el.directionTriggers[i]; i++) {
            trigger.addEventListener('click', handleClick);
        }
    }
}

export default Slider;
