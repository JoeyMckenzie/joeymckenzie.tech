import { useEffect, useState } from 'react';

/**
 * The value, settled after it stops changing for `delayMs`.
 *
 * The first value passes through immediately — settled state starts equal to
 * it — so a caller that mounts with content already in hand does not wait out a
 * delay before acting on it. Only subsequent changes are debounced.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
    const [settled, setSettled] = useState(value);

    useEffect(() => {
        if (settled === value) {
            return;
        }

        const timeout = setTimeout(() => setSettled(value), delayMs);

        return () => clearTimeout(timeout);
    }, [delayMs, settled, value]);

    return settled;
};
