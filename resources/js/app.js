import { animate } from 'motion';
import mermaid from 'mermaid';

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
 * Initialize Mermaid diagrams
 */
async function initializeMermaid() {
    mermaid.initialize({ startOnLoad: false });
    await mermaid.run({ querySelector: '.mermaid' });
}

/**
 * Initialize copy buttons for code blocks
 */
function initializeCodeCopyButtons() {
    // Find all pre elements (code blocks)
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
        // Wrap the pre in a div with relative positioning
        const wrapper = document.createElement('div');
        wrapper.classList.add('code-block-wrapper');
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.classList.add('code-copy-btn');
        copyButton.textContent = 'Copy';
        copyButton.type = 'button';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

        // Add click handler
        copyButton.addEventListener('click', async (e) => {
            e.preventDefault();

            // Get the text content from the code block
            const codeText = pre.textContent;

            try {
                // Copy to clipboard
                await navigator.clipboard.writeText(codeText);

                // Show success state
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');

                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.textContent = 'Failed';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }
        });

        // Insert the button into the wrapper
        wrapper.appendChild(copyButton);
    });
}

/**
 * Initialize all page features
 */
function initializePage() {
    initializeAnimations();
    initializeMermaid();
    initializeCodeCopyButtons();
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

/**
 * Re-initialize after Livewire navigation
 */
document.addEventListener('livewire:navigated', initializePage);
