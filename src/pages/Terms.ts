/* src/pages/Terms.ts */

export async function renderTerms(container: HTMLElement) {
  container.innerHTML = `
    <div class="container" style="padding: 64px 20px;">
        <h1 style="margin-bottom: 24px;">Terms & Conditions</h1>
        <div class="legal-content">
          <p>By using CurricuLab, you agree to the following terms:</p>
          <h2>Content Usage</h2>
          <p>This website is for educational purposes only. All course materials and syllabus information are subject to change by the university administration.</p>
          <h2>Disclaimers</h2>
          <p>While we strive for accuracy, CurricuLab is not an official university resource. Always cross-verify information with your department or the official university portal.</p>
          <h2>External Links</h2>
          <p>We are not responsible for the content of external websites linked from this application (e.g., e-books, tools, or notes hosting services).</p>
        </div>
    </div>
  `;
}
