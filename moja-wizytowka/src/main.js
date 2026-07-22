import './style.css';
import { initNavigation, initReveal, initTheme } from './app.js';

document.documentElement.classList.add('js');
initTheme(document);
initNavigation(document);
initReveal(document);
