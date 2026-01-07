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
    window.addEventListener('popstate', handleRoute);

    // Intercept all clicks for SPA routing
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.hasAttribute('data-link')) {
            e.preventDefault();
            const href = anchor.getAttribute('href')!;
            window.history.pushState(null, '', href);
            handleRoute();
        }
    });
}

function handleRoute() {
    const path = window.location.pathname;
    appElement.innerHTML = ''; // Clear main content

    if (path === '/' || path === '/index.html') {
        renderHome(appElement);
    } else if (path.startsWith('/resources')) {
        renderResources(appElement);
    } else if (path.startsWith('/unit-details')) {
        renderUnitDetails(appElement);
    } else if (path === '/privacy') {
        renderPrivacy(appElement);
    } else if (path === '/terms') {
        renderTerms(appElement);
    } else {
        appElement.innerHTML = '<h1>404 - Page Not Found</h1><a href="/" data-link>Go Home</a>';
    }
}

init();
