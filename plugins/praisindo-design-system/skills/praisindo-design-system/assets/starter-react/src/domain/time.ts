// "Today" for the date pickers (presets and the highlighted day). In a real product read it from the server or the clock; tests may replace it.
export const TODAY: string = new Date().toISOString().slice(0, 10);
