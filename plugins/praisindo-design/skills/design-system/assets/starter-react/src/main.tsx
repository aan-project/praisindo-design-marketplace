import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyBrand, cachedBrand } from './branding/brandStore';
import { motionOn } from './lib/countUp';
import './design-system/styles/index.css';

document.documentElement.dataset.motion = motionOn() ? 'on' : 'off';   // rule MO-03: the page fade and the count-up stand still for reduced motion and for automated browsers

applyBrand(document, cachedBrand(), 'light', 'en');   // first paint with the cached brand (no flash of the default colours); PrefsProvider takes over
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
