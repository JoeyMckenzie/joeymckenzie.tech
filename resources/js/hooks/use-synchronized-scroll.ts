import { useCallback, useEffect, useRef } from 'react';

const scrollProgress = (element: HTMLElement): number => {
    const scrollableDistance = element.scrollHeight - element.clientHeight;

    if (scrollableDistance <= 0) {
        return 0;
    }

    return Math.min(1, Math.max(0, element.scrollTop / scrollableDistance));
};

export function useSynchronizedScroll(): (
    source: HTMLElement,
    target: HTMLElement | null,
) => void {
    const synchronizedTarget = useRef<HTMLElement | null>(null);
    const releaseFrame = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (releaseFrame.current !== null) {
                cancelAnimationFrame(releaseFrame.current);
            }
        };
    }, []);

    return useCallback((source: HTMLElement, target: HTMLElement | null) => {
        if (target === null || synchronizedTarget.current === source) {
            return;
        }

        const targetScrollableDistance = Math.max(
            0,
            target.scrollHeight - target.clientHeight,
        );

        synchronizedTarget.current = target;
        target.scrollTop = scrollProgress(source) * targetScrollableDistance;

        if (releaseFrame.current !== null) {
            cancelAnimationFrame(releaseFrame.current);
        }

        releaseFrame.current = requestAnimationFrame(() => {
            synchronizedTarget.current = null;
            releaseFrame.current = null;
        });
    }, []);
}
