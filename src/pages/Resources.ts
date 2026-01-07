/* src/pages/Resources.ts */
import router from '../router.ts';
import { createCard } from '../components/card.ts';

export async function renderResources(container: HTMLElement) {
  container.innerHTML = `
    <div class="container">
      <section class="hero" style="padding: 48px 0 32px;">
        <h1>Study Resources</h1>
        <p>Access all materials, notes, and syllabus in one place</p>
      </section>

      <!-- Subject Switcher - CENTERED -->
      <section class="subject-switcher-section" style="margin-bottom: 48px; display: flex; justify-content: center;">
        <div class="switcher-grid" id="subject-switcher" style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; justify-content: center; width: 100%;">
          <!-- Subject icons will be rendered here -->
        </div>
      </section>

      <!-- Search Area (Simplified as per requirements) -->
      <section class="filter-section" style="margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto;">
        <div class="search-wrapper" style="position: relative;">
          <input type="text" id="resource-search" placeholder="Search for topic keywords..." 
                 style="width: 100%; padding: 14px 20px; border-radius: 14px; border: 1px solid var(--borderColor); background: var(--surfaceColor); color: var(--textPrimary); font-size: 1rem; box-shadow: var(--cardShadow);">
        </div>
      </section>

      <!-- Results Area -->
      <section id="resource-results">
        <div class="grid" id="results-grid">
           <!-- Unit Notes will render here -->
        </div>
      </section>
    </div>
  `;

  const subjects = await router.getSubjects();
  let selectedSubjectId: string | null = router.getParam('subject') || (subjects.length > 0 ? subjects[0].subjectId : null);
  let searchQuery = '';

  const switcher = document.getElementById('subject-switcher')!;
  const resultsGrid = document.getElementById('results-grid')!;
  const searchInput = document.getElementById('resource-search') as HTMLInputElement;

  // Render Switcher Cards
  const renderSwitcher = () => {
    switcher.innerHTML = `
      ${subjects.map(s => `
        <div class="switcher-card ${selectedSubjectId === s.subjectId ? 'active' : ''}" 
             data-id="${s.subjectId}"
             style="min-width: 90px; padding: 16px 12px; border-radius: 16px; background: ${selectedSubjectId === s.subjectId ? 'var(--accentGradient)' : 'var(--cardBg)'}; 
                    color: ${selectedSubjectId === s.subjectId ? 'white' : 'var(--textPrimary)'}; border: 1px solid var(--borderColor); cursor: pointer; text-align: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          <div style="font-size: 1.75rem; margin-bottom: 6px; filter: ${selectedSubjectId === s.subjectId ? 'brightness(1.2)' : 'none'}">${getIconEmojiByCode(s.code)}</div>
          <div style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.5px;">${s.code}</div>
        </div>
      `).join('')}
    `;

    switcher.querySelectorAll('.switcher-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedSubjectId = card.getAttribute('data-id');
        window.history.replaceState(null, '', `#/resources?subject=${selectedSubjectId}`);
        renderSwitcher();
        updateResults();
      });
    });
  };

  const updateResults = async () => {
    if (!selectedSubjectId) return;
    resultsGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Loading resources...</p>';

    const subject = subjects.find(s => s.subjectId === selectedSubjectId);
    if (!subject) return;

    // Fetch Syllabus and Units (to get descriptions/titles)
    const syllabus = await router.getSyllabus(selectedSubjectId);
    const unitsData = await router.getUnits(selectedSubjectId);

    // Limit to 5 Units as per requirement
    const topUnits = Object.entries(syllabus).slice(0, 5);

    let items: any[] = [];

    for (const [unitId, description] of topUnits) {
      // Find matching unit in unitsData if exists for extra metadata
      const unitMetadata = unitsData.find(u => u.unitId === unitId);

      // Fetch notes for this unit to provide a direct link
      const notes = await router.getNotes(selectedSubjectId, unitId);
      const directLink = notes.length > 0 ? notes[0].link : null;

      items.push({
        unitId,
        title: `Unit ${unitId}`,
        subtitle: unitMetadata ? unitMetadata.title : `Exploring ${subject.title}`,
        description: description,
        link: directLink,
        badge: `Module ${unitId}`
      });
    }

    // Filter by search
    if (searchQuery) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    resultsGrid.innerHTML = '';
    if (items.length === 0) {
      resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--textSecondary);">No resources found for this search.</p>';
      return;
    }

    items.forEach(item => {
      // Format description as bullet points if it looks like a list
      const formattedDescription = item.description.includes(',')
        ? `<ul style="margin: 0; padding-left: 1.2rem; margin-top: 8px;">${item.description.split(',').map((s: string) => `<li style="margin-bottom: 4px;">${s.trim()}</li>`).join('')}</ul>`
        : item.description;

      const card = createCard({
        title: item.title,
        description: formattedDescription,
        badge: item.badge,
        icon: 'bi-journal-text',
        onClick: () => {
          window.location.hash = `/unit-details?subject=${selectedSubjectId}&unit=${item.unitId}`;
        }
      });

      // Customize the card footer text to "Explore Notes"
      const footer = card.querySelector('.card-footer');
      if (footer) {
        footer.innerHTML = `Explore Notes →`;
      }

      resultsGrid.appendChild(card);
    });
  };

  renderSwitcher();
  updateResults();

  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    updateResults();
  });
}

function getIconEmojiByCode(code: string): string {
  if (code.includes('PBA204')) return '🚚';
  if (code.includes('PBA205')) return '🤖';
  if (code.includes('PBA206')) return '📢';
  if (code.includes('PBA207')) return '📊';
  if (code.includes('PBA208')) return '🔮';
  if (code.includes('PBA211')) return '📚';
  if (code.includes('PBA212')) return '🛠️';
  if (code.includes('PBA213')) return '📝';
  return '📄';
}
