/* src/main.ts */
import './assets/css/base.css';
import './assets/css/theme.css';
import './assets/css/components.css';
import themeManager from './themeManager';
import router from './router.ts';
import { createHeader } from './components/header.ts';
import { createFooter } from './components/footer.ts';

// Page Views
import { renderHome } from './pages/Home.ts';
import { renderResources } from './pages/Resources.ts';
import { renderPrivacy } from './pages/Privacy.ts';
import { renderTerms } from './pages/Terms.ts';
import { renderUnitDetails } from './pages/UnitDetails.ts';

const appElement = document.getElementById('app')!;

async function init() {
    await themeManager.init();
    const config = await router.getConfig();
    document.title = `${config.appName} | CurricuLab`;

    // Render Persistent Components
    const header = createHeader(config);
    const footer = createFooter(config);

    document.body.prepend(header);
    document.body.appendChild(footer);

    // Initial Route
    handleRoute();

    // Listen for navigation
    window.addEventListener('hashchange', handleRoute);
}

function handleRoute() {
    // Get path from hash, default to '/' if empty
    let path = window.location.hash.slice(1) || '/';

    // Handle parameterized routes (remove query string for matching)
    const cleanPath = path.split('?')[0];

    appElement.innerHTML = ''; // Clear main content

    if (cleanPath === '/' || cleanPath === '/index.html') {
        renderHome(appElement);
    } else if (cleanPath.startsWith('/resources')) {
        renderResources(appElement);
    } else if (cleanPath.startsWith('/unit-details')) {
        renderUnitDetails(appElement);
    } else if (cleanPath === '/privacy') {
        renderPrivacy(appElement);
    } else if (cleanPath === '/terms') {
        renderTerms(appElement);
    } else {
        appElement.innerHTML = '<h1>404 - Page Not Found</h1><a href="#/" data-link>Go Home</a>';
    }
}

init();
