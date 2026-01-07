/* src/pages/Home.ts */
import router from '../router';
import { createCard } from '../components/card';

export async function renderHome(container: HTMLElement) {
  container.innerHTML = `
    <div class="container">
      <section class="hero">
        <h1>Explore Your Semester</h1>
        <p>Curated resources for your MBA journey</p>
      </section>

      <section>
        <div class="section-header">
          <h2 class="section-title">Weekly Timetable</h2>
          <span class="badge">Current Semester</span>
        </div>
        <div class="timetable-container" id="timetable-container">
          <p>Loading...</p>
        </div>
      </section>

      <section style="margin-top: 48px;">
        <div class="section-header">
          <h2 class="section-title">Core Subjects</h2>
          <span class="badge" id="subject-count">...</span>
        </div>
        <div id="subject-grid" class="grid"></div>
      </section>
    </div>
  `;

  const subjects = await router.getSubjects();
  const timetableData = await router.getTimetable();

  document.getElementById('subject-count')!.textContent = `${subjects.length} Subjects`;

  const grid = document.getElementById('subject-grid')!;
  grid.innerHTML = '';
  subjects.forEach(subject => {
    const card = createCard({
      title: subject.title,
      description: subject.description,
      icon: subject.icon,
      code: subject.code,
      teacher: subject.teacher,
      onClick: () => {
        window.history.pushState(null, '', `/resources?subject=${subject.subjectId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
    grid.appendChild(card);
  });

  const ttContainer = document.getElementById('timetable-container')!;
  if (timetableData?.schedule) {
    let html = `<table class="timetable-table"><thead><tr><th>Time</th>`;
    timetableData.schedule.forEach(day => html += `<th>${day.day}</th>`);
    html += `</tr></thead><tbody>`;

    const timeSlots = [...new Set(timetableData.schedule.flatMap(d => d.slots.map(s => s.time)))].sort();
    timeSlots.forEach(slot => {
      html += `<tr><td><strong>${slot}</strong></td>`;
      timetableData.schedule.forEach(day => {
        const session = day.slots.find(s => s.time === slot);
        html += `<td>${session ? `<span class="subject-code">${session.subject}</span><br><small style="color:var(--textSecondary)">${session.room}</small>` : '-'}</td>`;
      });
      html += `</tr>`;
    });
    ttContainer.innerHTML = html + '</tbody></table>';
  }
}
