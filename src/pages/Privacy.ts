/* src/pages/Privacy.ts */

export async function renderPrivacy(container: HTMLElement) {
  container.innerHTML = `
    <div class="container" style="padding: 64px 20px;">
        <h1 style="margin-bottom: 24px;">Privacy Policy</h1>
        <div class="legal-content">
          <p>Welcome to CurricuLab. We respect your privacy and are committed to protecting any information you may share with us. Since this is an offline-first, static website, we do not collect or store any personal data on any server.</p>
          <p>Any preferences you select (like theme mode) are stored locally in your browser's <code>localStorage</code> and never leave your device.</p>
          <h2>Contact</h2>
          <p>For any queries regarding the curriculum or materials, please contact your respective subject teachers listed on the home page.</p>
        </div>
    </div>
  `;
}
