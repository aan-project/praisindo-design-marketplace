// The one place that holds the branding adapter. Default: the TEMPORARY localStorage adapter (front-end only). Call setAdapter(httpAdapter('/api')) at boot when a server exists.
import { localAdapter } from './brandStore.js';
let current = localAdapter;
export const adapter = () => current;
export const setAdapter = (a) => { current = a; };
