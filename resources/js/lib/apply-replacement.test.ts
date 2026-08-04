import { describe, expect, it } from 'vitest';
import { applyReplacement } from './apply-replacement';

describe('applyReplacement', () => {
    it('replaces the excerpt and reports its source offsets', () => {
        const result = applyReplacement(
            'the quick brown fox',
            'quick brown',
            'slow grey',
        );

        expect(result).toEqual({
            from: 4,
            to: 15,
            doc: 'the slow grey fox',
        });
    });

    it('returns null when the excerpt is absent', () => {
        expect(
            applyReplacement('the quick brown fox', 'lazy dog', 'x'),
        ).toBeNull();
    });

    it('replaces only the first of multiple occurrences', () => {
        const result = applyReplacement('na na na batman', 'na', 'yo');

        expect(result?.doc).toBe('yo na na batman');
        expect(result?.from).toBe(0);
        expect(result?.to).toBe(2);
    });

    it('matches a multi-line excerpt spanning newlines', () => {
        const result = applyReplacement(
            'intro\nfirst line\nsecond line\noutro',
            'first line\nsecond line',
            'merged line',
        );

        expect(result?.doc).toBe('intro\nmerged line\noutro');
    });

    it('deletes the excerpt when the replacement is empty', () => {
        const result = applyReplacement('keep this out', 'this ', '');

        expect(result?.doc).toBe('keep out');
        expect(result?.from).toBe(5);
        expect(result?.to).toBe(10);
    });
});
