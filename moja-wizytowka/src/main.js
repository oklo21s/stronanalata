import './style.css';
import { initNavigation, initReveal, initRouting, initStickyCta, initTheme } from './app.js';

document.documentElement.classList.add('js');
initTheme(document);
initNavigation(document);
initRouting(document);
initReveal(document);
initStickyCta(document);
