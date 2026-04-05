// src/hooks/useScrollAnimation.js
import { useState, useEffect, useRef } from 'react';

const useScrollAnimation = (options = {}) => {
    const {
        // When should the animation start relative to the "slice"?
        // 'onEnterSliceTop': When element top hits the slice
        // 'onEnterSliceBottom': When element bottom hits the slice (good for fade out as it moves up)
        // 'onFullyEnterSliceZone': When element is fully within a defined zone around the slice
        triggerPoint = 'onEnterSliceBottom',

        // Where is the "slice" vertically in the viewport? (0 = top, 0.5 = middle, 1 = bottom)
        sliceViewportPosition = 0.7, // e.g., 70% from the top of the viewport

        // How far (in viewport height units) should the element scroll for the animation to complete?
        animationDistanceVh = 0.3, // e.g., 30% of viewport height

        // Initial and final states
        initialOpacity = 1,
        finalOpacity = 0,
        initialTranslateY = 0, // in pixels
        finalTranslateY = -50,  // in pixels (e.g., move up)

        transitionDuration = '0.2s', // CSS transition duration
        transitionTimingFunction = 'linear',

        disabled = false, // Option to disable the hook
    } = options;

    const [style, setStyle] = useState({
        opacity: initialOpacity,
        transform: `translateY(${initialTranslateY}px)`,
        transition: `opacity ${transitionDuration} ${transitionTimingFunction}, transform ${transitionDuration} ${transitionTimingFunction}`,
        willChange: 'opacity, transform',
    });
    const elementRef = useRef(null); // Ref to attach to the target DOM element

    useEffect(() => {
        if (disabled || !elementRef.current) {
            // Reset to initial if disabled or no element
            setStyle({
                opacity: initialOpacity,
                transform: `translateY(${initialTranslateY}px)`,
                transition: `opacity ${transitionDuration} ${transitionTimingFunction}, transform ${transitionDuration} ${transitionTimingFunction}`,
                willChange: 'opacity, transform',
            });
            return;
        }

        const currentElement = elementRef.current;
        let animationFrameId = null;

        const handleScroll = () => {
            if (!currentElement) return;

            const viewportHeight = window.innerHeight;
            const rect = currentElement.getBoundingClientRect();
            const elementHeight = rect.height;

            // Y position of the "slice" in pixels from the top of the viewport
            const sliceY = viewportHeight * sliceViewportPosition;

            // Y position of the element's trigger point (e.g., its bottom edge)
            let elementTriggerY;
            if (triggerPoint === 'onEnterSliceTop') {
                elementTriggerY = rect.top;
            } else { // 'onEnterSliceBottom' or default
                elementTriggerY = rect.bottom;
            }

            // How far the element's trigger point is from the slice.
            // Positive means below the slice, negative means above.
            const distanceToSlice = elementTriggerY - sliceY;

            // Pixel distance over which animation occurs
            const animationDistancePx = viewportHeight * animationDistanceVh;

            let progress = 0;

            // Logic for fading out as element moves UP past the slice
            // (assuming finalTranslateY makes it move "up", and finalOpacity is lower)
            if (finalOpacity < initialOpacity || finalTranslateY < initialTranslateY) {
                // Element is moving "up" towards or past the slice
                // We want progress to go from 0 to 1 as it moves from slice downwards to slice - animationDistancePx upwards
                // So, if distanceToSlice is 0 (element bottom at slice), progress is 0.
                // If distanceToSlice is -animationDistancePx (element bottom is animationDistancePx above slice), progress is 1.
                progress = Math.min(1, Math.max(0, (-distanceToSlice) / animationDistancePx));
            }
            // Add logic for other directions if needed (e.g. fading IN as it moves DOWN)

            const currentOpacity = initialOpacity - (initialOpacity - finalOpacity) * progress;
            const currentTranslateY = initialTranslateY - (initialTranslateY - finalTranslateY) * progress;

            setStyle({
                opacity: currentOpacity,
                transform: `translateY(${currentTranslateY}px)`,
                transition: `opacity ${transitionDuration} ${transitionTimingFunction}, transform ${transitionDuration} ${transitionTimingFunction}`,
                willChange: 'opacity, transform',
            });
        };

        // Use IntersectionObserver to only run scroll handler when element is somewhat visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
                    handleScroll(); // Initial check
                } else {
                    window.removeEventListener('scroll', handleScrollThrottled);
                    // Optionally, set to a resting state (e.g. fully faded if it's off-screen above)
                    // This depends on desired behavior when scrolling back into view.
                    // For now, let's keep its last calculated style.
                }
            },
            {
                rootMargin: '100px 0px 100px 0px', // Trigger a bit before/after it's in view
            }
        );

        const handleScrollThrottled = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(handleScroll);
        };


        observer.observe(currentElement);

        return () => {
            window.removeEventListener('scroll', handleScrollThrottled);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            observer.unobserve(currentElement);
        };

    }, [
        triggerPoint, sliceViewportPosition, animationDistanceVh,
        initialOpacity, finalOpacity, initialTranslateY, finalTranslateY,
        transitionDuration, transitionTimingFunction, disabled
    ]); // Add elementRef.current to deps? No, ref object itself doesn't change.

    return [elementRef, style]; // Return the ref to be attached and the style object
};

export default useScrollAnimation;