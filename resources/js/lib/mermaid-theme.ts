import type { ResolvedAppearance } from '@/hooks/use-appearance';

/**
 * Nocturne Mermaid theme (JOEY-4.1).
 *
 * A reusable config the post page (JOEY-4.3) passes to `mermaid.initialize`
 * before `mermaid.run()`, so diagrams read as though drawn by the same hand
 * as the prose: transparent plate, iris/ember strokes, Geist Mono labels,
 * soft-rounded nodes. Palette mirrors the Nocturne tokens in app.css.
 */

const palette = {
    light: {
        canvas: '#f7f5ef',
        panel: '#ffffff',
        hairline: '#e4e0d6',
        prose: '#1b1d24',
        subtle: '#5b6070',
        iris: '#4c5cc5',
        ember: '#b4863b',
    },
    dark: {
        canvas: '#0e1016',
        panel: '#171a23',
        hairline: '#262b38',
        prose: '#e8e6df',
        subtle: '#8b90a0',
        iris: '#9aa7ff',
        ember: '#e0b978',
    },
} as const;

/**
 * Mermaid config object for the given resolved appearance. Typed loosely
 * because `mermaid` is only added as a dependency in JOEY-4.3.
 */
export function mermaidTheme(appearance: ResolvedAppearance) {
    const c = palette[appearance];

    return {
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        themeVariables: {
            background: 'transparent',
            primaryColor: c.panel,
            primaryTextColor: c.prose,
            primaryBorderColor: c.iris,
            secondaryColor: c.canvas,
            tertiaryColor: c.panel,
            lineColor: c.subtle,
            textColor: c.prose,
            mainBkg: c.panel,
            nodeBorder: c.iris,
            clusterBkg: c.canvas,
            clusterBorder: c.hairline,
            edgeLabelBackground: c.panel,
            noteBkgColor: c.canvas,
            noteBorderColor: c.ember,
            fontSize: '14px',
        },
        flowchart: {
            curve: 'basis',
            padding: 12,
        },
    } as const;
}
