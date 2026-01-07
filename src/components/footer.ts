/* src/components/footer.ts */
import { Config } from '../types';

export function createFooter(config: Config): HTMLElement {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="container footer-content">
      <div class="footer-info">
        <p><strong>${config.appName}</strong> &copy; ${new Date().getFullYear()}</p>
      </div>
      <div class="footer-links">
        <a href="/privacy" class="footer-link" data-link>Privacy</a>
        <a href="/terms" class="footer-link" data-link>Terms</a>
      </div>
    </div>
  `;
  return footer;
}
