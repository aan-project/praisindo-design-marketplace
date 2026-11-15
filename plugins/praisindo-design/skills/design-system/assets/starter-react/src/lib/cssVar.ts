/** Prototype cv(): computed value of a CSS custom property on :root. */
export const cv = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
