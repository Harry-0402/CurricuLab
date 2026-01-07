/* src/components/header.ts */
import { themeManager } from '../themeManager';
import { Config } from '../types';

export function createHeader(config: Config): HTMLElement {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="container header-content">
      <a href="/" class="logo" data-link>${config.appName || 'CurricuLab'}</a>
      <div class="nav-links">
        <a href="/" class="nav-link" data-link>Home</a>
        <a href="/resources" class="nav-link" data-link>Resources</a>
        <button id="theme-toggle" class="btn-icon" aria-label="Toggle theme">
          🌓
        </button>
      </div>
    </div>
  `;

  header.querySelector('#theme-toggle')?.addEventListener('click', () => {
    themeManager.toggleTheme();
  });

  return header;
}
