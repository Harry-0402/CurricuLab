import router from '../router.ts';

function parseMarkdown(text: string): string {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

export async function renderUnitDetails(container: HTMLElement) {
    const subjectId = router.getParam('subject');
    const unitId = router.getParam('unit');

    if (!subjectId || !unitId) {
        window.history.pushState(null, '', '/resources');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    container.innerHTML = `
    <div class="container" style="padding: 40px 20px;">
        <nav style="margin-bottom: 24px; font-size: 0.875rem;">
            <a href="/resources?subject=${subjectId}" data-link style="color: var(--linkColor)">← Back to Resources</a>
        </nav>
        
        <div id="unit-hub-loading" style="text-align: center; padding: 100px 0;">
            <p style="color: var(--textSecondary)">Loading Learning Hub...</p>
        </div>
        <div id="unit-hub-content" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 1px solid var(--borderColor); padding-bottom: 24px;">
                <div>
                    <h1 id="hub-unit-title" style="font-size: 2.5rem; margin: 0;"></h1>
                    <p id="hub-subject-info" style="color: var(--textSecondary); font-size: 1.1rem; margin-top: 8px;"></p>
                </div>
                <a id="hub-ppt-download" href="#" target="_blank" style="background: var(--accentGradient); color: white; padding: 12px 24px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: var(--cardShadow);">
                    <span>📥</span> Download PPT
                </a>
            </div>

            <!-- Tab Switcher - Card Style -->
            <div style="display: flex; gap: 16px; margin-bottom: 48px; border-radius: 20px; width: fit-content; margin-left: auto; margin-right: auto; perspective: 1000px;">
                <button class="hub-tab-btn active" data-tab="notes" style="flex: 1; padding: 16px 32px; border-radius: 16px; font-weight: 800; border: 1px solid var(--borderColor); background: var(--cardBg); color: var(--textPrimary); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 140px; box-shadow: var(--cardShadow); transition: all 0.3s ease;">
                    <span style="font-size: 1.5rem;">📝</span>
                    <span>Study Notes</span>
                </button>
                <button class="hub-tab-btn" data-tab="questions" style="flex: 1; padding: 16px 32px; border-radius: 16px; font-weight: 800; border: 1px solid var(--borderColor); background: var(--cardBg); color: var(--textPrimary); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 140px; box-shadow: var(--cardShadow); transition: all 0.3s ease;">
                    <span style="font-size: 1.5rem;">❓</span>
                    <span>Questions</span>
                </button>
                <button class="hub-tab-btn" data-tab="assignments" style="flex: 1; padding: 16px 32px; border-radius: 16px; font-weight: 800; border: 1px solid var(--borderColor); background: var(--cardBg); color: var(--textPrimary); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 140px; box-shadow: var(--cardShadow); transition: all 0.3s ease;">
                    <span style="font-size: 1.5rem;">📅</span>
                    <span>Assignments</span>
                </button>
            </div>

            <div id="hub-tab-content">
                <!-- Data will be injected here -->
            </div>

            <!-- Back to Top Helper -->
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" 
                    style="position: fixed; bottom: 32px; right: 32px; background: var(--primaryBg); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: var(--cardShadow); font-size: 1.25rem; z-index: 1000; transition: all 0.3s ease;"
                    onmouseover="this.style.transform='translateY(-4px)'"
                    onmouseout="this.style.transform='none'">
                ↑
            </button>
        </div>
    </div>
    `;

    const data = await router.getUnitDetails(subjectId, unitId);
    const unitQuestions = await router.getUnitQuestions(subjectId, unitId);
    const subject = await router.getSubject(subjectId);

    if (!data && !unitQuestions) {
        document.getElementById('unit-hub-loading')!.innerHTML = '<p>Unit materials not found for this unit.</p>';
        return;
    }

    document.getElementById('unit-hub-loading')!.style.display = 'none';
    const hubContent = document.getElementById('unit-hub-content')!;
    hubContent.style.display = 'block';

    document.getElementById('hub-unit-title')!.textContent = `Unit ${unitId}: ${data.title}`;
    document.getElementById('hub-subject-info')!.textContent = `${subject?.code} - ${subject?.title}`;
    const pptBtn = document.getElementById('hub-ppt-download') as HTMLAnchorElement;
    pptBtn.href = data.pptLink || '#';

    const tabButtons = document.querySelectorAll('.hub-tab-btn');
    const tabContainer = document.getElementById('hub-tab-content')!;

    const renderTab = (tabName: string) => {
        // Update tab styles
        tabButtons.forEach(btn => {
            const b = btn as HTMLButtonElement;
            if (b.dataset.tab === tabName) {
                b.style.borderColor = 'var(--primaryBg)';
                b.style.background = 'rgba(79, 70, 229, 0.05)';
                b.style.transform = 'translateY(-4px) scale(1.02)';
                b.classList.add('active');
            } else {
                b.style.borderColor = 'var(--borderColor)';
                b.style.background = 'var(--cardBg)';
                b.style.transform = 'none';
                b.classList.remove('active');
            }
        });

        if (tabName === 'notes') {
            if (!data?.studyNotes) {
                tabContainer.innerHTML = '<div style="text-align: center; padding: 100px 0;"><p style="color: var(--textSecondary)">Study notes are coming soon for this unit.</p></div>';
                return;
            }
            tabContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: 240px 1fr; gap: 48px;">
                <aside style="position: sticky; top: 100px; max-height: calc(100vh - 120px); overflow-y: auto;">
                    <h4 style="margin-bottom: 16px; font-size: 0.8rem; text-transform: uppercase; color: var(--textSecondary); letter-spacing: 1px;">Contents</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${data.studyNotes.toc.map((item: any) => `
                            <li style="margin-bottom: 12px;">
                                <a href="#${item.id}" style="color: var(--textSecondary); font-weight: 500; font-size: 0.9375rem; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--linkColor)'" onmouseout="this.style.color='var(--textSecondary)'">
                                    ${item.label}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </aside>
                <main class="hub-notes-main">
                    ${data.studyNotes.content.map((section: any) => `
                        <article id="${section.id}" style="margin-bottom: 64px;">
                            <h2 style="font-size: 1.75rem; margin-bottom: 20px;">${section.title}</h2>
                            ${section.image ? `<img src="${section.image}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 16px; margin-bottom: 24px; box-shadow: var(--cardShadow); display: block;">` : ''}
                            <p style="color: var(--textSecondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">${parseMarkdown(section.text)}</p>
                            ${section.list ? `<ul style="color: var(--textSecondary); line-height: 1.8; margin-bottom: 24px;">${section.list.map((li: string) => `<li>${parseMarkdown(li)}</li>`).join('')}</ul>` : ''}
                            ${section.table ? `
                                <div style="overflow-x: auto; margin: 32px 0;">
                                    <table style="width: 100%; border-collapse: collapse; background: var(--cardBg); border-radius: 12px; overflow: hidden; border: 1px solid var(--borderColor);">
                                        <thead>
                                            <tr style="background: rgba(0,0,0,0.03);">
                                                ${section.table.headers.map((h: string) => `<th style="padding: 16px; text-align: left; border-bottom: 1px solid var(--borderColor); font-size: 0.9rem; font-weight: 700;">${h}</th>`).join('')}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${section.table.rows.map((row: any[]) => `
                                                <tr>
                                                    ${row.map(cell => `<td style="padding: 16px; border-bottom: 1px solid var(--borderColor); font-size: 0.9375rem; color: var(--textSecondary);">${cell}</td>`).join('')}
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : ''}
                        </article>
                    `).join('')}
                </main>
            </div>
            `;
        } else if (tabName === 'questions') {
            tabContainer.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                ${Object.entries(unitQuestions).map(([key, qs]: [string, any]) => `
                    <div style="margin-bottom: 40px;">
                        <h3 style="margin-bottom: 16px; border-left: 4px solid var(--linkColor); padding-left: 12px; font-size: 1.25rem;">
                            ${key.replace('_', ' ').toUpperCase()} Questions
                        </h3>
                        <div style="background: var(--cardBg); border: 1px solid var(--borderColor); border-radius: 12px; padding: 24px;">
                            ${qs.length > 0 ? `
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    ${qs.map((qData: any, idx: number) => {
                const isObject = typeof qData === 'object' && qData !== null;
                const question = isObject ? qData.question : qData;
                const answer = isObject ? qData.answer : null;
                const questionId = `${key}-${idx}`;

                return `
                                        <li style="padding: 16px 0; border-bottom: ${idx === qs.length - 1 ? 'none' : '1px solid var(--borderColor)'};">
                                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                                                <div style="display: flex; gap: 12px;">
                                                    <span style="font-weight: 700; color: var(--linkColor)">Q${idx + 1}.</span>
                                                    <span style="color: var(--textSecondary); font-weight: 600;">${parseMarkdown(question)}</span>
                                                </div>
                                                ${answer ? `
                                                    <button onclick="document.getElementById('sol-${questionId}').style.display = document.getElementById('sol-${questionId}').style.display === 'none' ? 'block' : 'none'; this.innerHTML = this.innerHTML.includes('View') ? 'Hide Solution' : 'View Solution';" 
                                                            style="background: var(--secondaryBg); color: var(--primaryBg); border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; min-width: 130px; transition: all 0.2s ease;">
                                                        View Solution
                                                    </button>
                                                ` : ''}
                                            </div>
                                            
                                            ${answer ? `
                                                <div id="sol-${questionId}" style="display: none; margin-top: 16px; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 12px; border-left: 4px solid var(--primaryBg);">
                                                    <div style="margin-bottom: 16px;">
                                                        <h5 style="font-size: 0.75rem; text-transform: uppercase; color: var(--textSecondary); margin-bottom: 8px; letter-spacing: 0.5px;">Detailed Answer</h5>
                                                        <p style="color: var(--textSecondary); line-height: 1.6;">${parseMarkdown(answer.definition)}</p>
                                                    </div>
                                                    
                                                    ${answer.types ? `
                                                    <div style="margin-bottom: 16px;">
                                                        <h5 style="font-size: 0.75rem; text-transform: uppercase; color: var(--textSecondary); margin-bottom: 8px; letter-spacing: 0.5px;">Types / Categories</h5>
                                                        <ul style="color: var(--textSecondary); line-height: 1.6; margin: 0; padding-left: 1.2rem;">
                                                            ${answer.types.split(/[,.]/).filter((s: string) => s.trim().length > 0).map((s: string) => `<li>${parseMarkdown(s.trim())}</li>`).join('')}
                                                        </ul>
                                                    </div>
                                                    ` : ''}

                                                    ${answer.table ? `
                                                        <div style="overflow-x: auto; margin: 24px 0;">
                                                            <table style="width: 100%; border-collapse: collapse; background: var(--cardBg); border-radius: 12px; overflow: hidden; border: 1px solid var(--borderColor);">
                                                                <thead>
                                                                    <tr style="background: rgba(0,0,0,0.03);">
                                                                        ${answer.table.headers.map((h: string) => `<th style="padding: 16px; text-align: left; border-bottom: 2px solid var(--borderColor); font-size: 0.8rem; font-weight: 700; color: var(--primaryBg);">${h}</th>`).join('')}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    ${answer.table.rows.map((row: any[]) => `
                                                                        <tr style="transition: background 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.015)'" onmouseout="this.style.background='transparent'">
                                                                            ${row.map(cell => `<td style="padding: 16px; border-bottom: 1px solid var(--borderColor); font-size: 0.875rem; color: var(--textSecondary); line-height: 1.5;">${cell}</td>`).join('')}
                                                                        </tr>
                                                                    `).join('')}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ` : ''}
                                                    
                                                    ${answer.explanation ? `
                                                    <div style="margin-bottom: 16px;">
                                                        <h5 style="font-size: 0.75rem; text-transform: uppercase; color: var(--textSecondary); margin-bottom: 8px; letter-spacing: 0.5px;">Explanation</h5>
                                                        <p style="color: var(--textSecondary); line-height: 1.6;">${parseMarkdown(answer.explanation)}</p>
                                                    </div>
                                                    ` : ''}
                                                    
                                                    ${answer.application ? `
                                                    <div style="background: var(--secondaryBg); padding: 16px; border-radius: 12px; border: 1px dashed var(--primaryBg);">
                                                        <h5 style="font-size: 0.75rem; text-transform: uppercase; color: var(--primaryBg); margin-bottom: 8px; letter-spacing: 0.5px;">Real-World Application</h5>
                                                        <p style="color: var(--textSecondary); line-height: 1.6; font-style: italic;">${parseMarkdown(answer.application)}</p>
                                                    </div>
                                                    ` : ''}
                                                </div>
                                            ` : ''}
                                        </li>
                                        `;
            }).join('')}
                                </ul>
                            ` : '<p style="color: var(--textSecondary); font-style: italic;">No questions available in this category.</p>'}
                        </div>
                    </div>
                `).join('')}
            </div>
            `;
        } else if (tabName === 'assignments') {
            tabContainer.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                ${(data?.assignments || []).length > 0 ? data.assignments.map((asm: any) => `
                    <div style="background: var(--cardBg); border: 1px solid var(--borderColor); border-radius: 16px; padding: 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; right: 0; background: var(--accentGradient); padding: 8px 16px; color: white; font-size: 0.75rem; font-weight: 800; border-bottom-left-radius: 12px;">DUE: ${asm.dueDate}</div>
                        <h3 style="margin-bottom: 12px; font-size: 1.5rem;">${asm.title}</h3>
                        <p style="color: var(--textSecondary); line-height: 1.6; margin-bottom: 24px;">${asm.description}</p>
                        <button style="background: var(--secondaryBg); color: var(--primaryBg); font-weight: 700; padding: 10px 20px; border-radius: 8px; font-size: 0.875rem;">Submit Assignment ↗</button>
                    </div>
                `).join('') : '<p style="text-align: center; color: var(--textSecondary); padding: 64px 0;">No active assignments for this unit.</p>'}
            </div>
            `;
        }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const b = btn as HTMLButtonElement;
            renderTab(b.dataset.tab!);
        });
    });

    renderTab('notes');
}
