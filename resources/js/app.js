import { animate } from 'motion';

/**
 * Reusable animation presets
 */
const animations = {
    // Fade in animation
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
    },

    // Fade in from bottom (slide up)
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    },

    // Fade in from top (slide down)
    slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    },

    // Fade in from left (slide right)
    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 },
    },

    // Fade in from right (slide left)
    slideLeft: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 },
    },

    // Scale in with fade
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
    },
};

const buildKeyframes = (preset) => {
    const properties = new Set([
        ...Object.keys(preset.initial),
        ...Object.keys(preset.animate),
    ]);

    return Array.from(properties).reduce((frames, property) => {
        const initialValue =
            preset.initial[property] ?? preset.animate[property] ?? null;
        const finalValue =
            preset.animate[property] ?? preset.initial[property] ?? null;

        if (initialValue !== null && finalValue !== null) {
            frames[property] = [initialValue, finalValue];
        }

        return frames;
    }, {});
};

/**
 * Initialize animations on elements with data-animation attribute
 */
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');

    animatedElements.forEach((el, index) => {
        const animationType = el.getAttribute('data-animation');
        const animationPreset = animations[animationType];
        const baseDelay = Number(el.getAttribute('data-delay')) || 0;
        const staggerInterval = Number(el.getAttribute('data-stagger')) || 0;
        const delay = baseDelay + staggerInterval * index;

        if (animationPreset) {
            animate(el, buildKeyframes(animationPreset), {
                duration: animationPreset.transition.duration,
                delay,
                easing: animationPreset.transition.easing || 'ease-out',
                fill: 'both',
            });
        }
    });
}

/**
 * Initialize animations when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}
