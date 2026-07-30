import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * One-shot, first-party scroll reveal for Nocturne static pages.
 *
 * IntersectionObserver toggles a data attribute once; CSS handles the subtle
 * fade and translates. The reduced-motion media query renders it immediately.
 */
export default function ScrollFade({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;

        if (element === null) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.dataset.visible = 'true';

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                element.dataset.visible = 'true';
                observer.disconnect();
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={elementRef} className={cn('nocturne-reveal', className)}>
            {children}
        </section>
    );
}
