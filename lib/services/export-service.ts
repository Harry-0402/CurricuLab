import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { Question } from "@/types";

// Generic type for exportable notes (works with Note and RevisionNote)
interface ExportableNote {
    id: string;
    title: string;
    content: string;
}

export class PlatformExportService {
    static async generateWordDocument(
        subjectTitle: string,
        unitTitle: string,
        notes: ExportableNote[]
    ): Promise<void> {

        const doc = new Document({
            sections: [
                {
                    properties: {
                        type: SectionType.CONTINUOUS,
                    },
                    children: [
                        // Header
                        new Paragraph({
                            text: unitTitle,
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 }
                        }),
                        new Paragraph({
                            text: subjectTitle,
                            heading: HeadingLevel.HEADING_2, // Using H2 for subtitle look
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 }
                        }),

                        // Notes Content
                        ...notes.flatMap(note => this.parseNoteToDocx(note))
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${unitTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_revision.docx`);
    }

    private static parseNoteToDocx(note: ExportableNote): Paragraph[] {
        const paragraphs: Paragraph[] = [];

        // Note Title (H1 equivalent visually)
        paragraphs.push(new Paragraph({
            text: note.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            border: {
                bottom: {
                    color: "E5E7EB", // gray-200
                    space: 5,
                    style: BorderStyle.SINGLE,
                    size: 6
                }
            }
        }));

        // Parse Markdown Content
        const lines = note.content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith('# ')) {
                // H1 (in markdown) -> H2 (in docx to be smaller than Note Title)
                paragraphs.push(new Paragraph({
                    text: line.replace('# ', '').trim(),
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }));
            } else if (line.startsWith('## ')) {
                // H2 -> H3
                paragraphs.push(new Paragraph({
                    text: line.replace('## ', '').trim(),
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 200, after: 100 }
                }));
            } else if (line.startsWith('### ')) {
                // H3 -> H4
                paragraphs.push(new Paragraph({
                    text: line.replace('### ', '').trim(),
                    heading: HeadingLevel.HEADING_4,
                    spacing: { before: 150, after: 50 }
                }));
            } else if (line.startsWith('- ')) {
                // Bullet List
                paragraphs.push(new Paragraph({
                    children: this.parseTextRuns(line.substring(2)),
                    bullet: { level: 0 }
                }));
            } else {
                // Normal Text
                paragraphs.push(new Paragraph({
                    children: this.parseTextRuns(line),
                    spacing: { after: 100 }
                }));
            }
        }

        // Add a separator space after each note, but NO page break
        paragraphs.push(new Paragraph({ text: "", spacing: { after: 400 } }));

        return paragraphs;
    }

    static async generateChatExport(messages: { role: 'user' | 'assistant', content: string }[]): Promise<void> {
        const doc = new Document({
            sections: [{
                properties: { type: SectionType.CONTINUOUS },
                children: [
                    new Paragraph({
                        text: "LearnPilot Session",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    ...messages.flatMap(msg => this.parseChatToDocx(msg))
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `learnpilot_session_${new Date().toISOString().slice(0, 10)}.docx`);
    }

    private static parseChatToDocx(msg: { role: 'user' | 'assistant', content: string }): Paragraph[] {
        const paragraphs: Paragraph[] = [];
        const isUser = msg.role === 'user';

        // Role Label
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({
                    text: isUser ? "You" : "LearnPilot",
                    bold: true,
                    color: isUser ? "000000" : "2563EB", // Black for user, Blue for AI
                    size: 24 // 12pt
                })
            ],
            spacing: { before: 200, after: 100 },
            border: {
                bottom: {
                    color: "E5E7EB",
                    space: 5,
                    style: BorderStyle.SINGLE,
                    size: 4
                }
            }
        }));

        // Content
        if (isUser) {
            // User content usually plain text
            paragraphs.push(new Paragraph({
                text: msg.content,
                spacing: { after: 300 }
            }));
        } else {
            // AI Content needs markdown parsing
            const lines = msg.content.split('\n');
            lines.forEach(line => {
                const trimmed = line.trim();
                if (!trimmed) return;

                if (trimmed.startsWith('# ')) {
                    paragraphs.push(new Paragraph({
                        text: trimmed.replace('# ', '').trim(),
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 150, after: 100 }
                    }));
                } else if (trimmed.startsWith('## ')) {
                    paragraphs.push(new Paragraph({
                        text: trimmed.replace('## ', '').trim(),
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 150, after: 100 }
                    }));
                } else if (trimmed.startsWith('- ')) {
                    paragraphs.push(new Paragraph({
                        children: this.parseTextRuns(trimmed.substring(2)),
                        bullet: { level: 0 }
                    }));
                } else {
                    paragraphs.push(new Paragraph({
                        children: this.parseTextRuns(trimmed),
                        spacing: { after: 100 }
                    }));
                }
            });
            // Spacer
            paragraphs.push(new Paragraph({ text: "", spacing: { after: 300 } }));
        }

        return paragraphs;
    }

    static async generateQuestionBankExport(
        subjectTitle: string,
        unitTitle: string,
        questions: any[]
    ): Promise<void> {
        const doc = new Document({
            sections: [{
                properties: { type: SectionType.CONTINUOUS },
                children: [
                    new Paragraph({
                        text: "Question Bank: " + unitTitle,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: subjectTitle,
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    ...questions.flatMap(q => this.parseQuestionToDocx(q))
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${unitTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_questions.docx`);
    }

    private static parseQuestionToDocx(q: any): Paragraph[] {
        const paragraphs: Paragraph[] = [];

        // Question Title
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({ text: "Question: ", bold: true, color: "2563EB" }),
                new TextRun({ text: q.question, bold: true })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
        }));

        // Marks Badge
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({ text: `Marks: ${q.marksType}`, italics: true, color: "6B7280" })
            ],
            spacing: { after: 200 }
        }));

        // Answer Label
        paragraphs.push(new Paragraph({
            text: "Suggested Answer:",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 100, after: 100 }
        }));

        // Parse Answer Content
        const answer = q.formattedAnswer || q.answer || "No answer provided.";
        const lines = answer.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('- ')) {
                paragraphs.push(new Paragraph({
                    children: this.parseTextRuns(trimmed.substring(2)),
                    bullet: { level: 0 }
                }));
            } else {
                paragraphs.push(new Paragraph({
                    children: this.parseTextRuns(trimmed),
                    spacing: { after: 100 }
                }));
            }
        }

        paragraphs.push(new Paragraph({ text: "", spacing: { after: 400 } }));
        return paragraphs;
    }

    static async generateVaultExport(
        subjectTitle: string,
        resources: any[]
    ): Promise<void> {
        const doc = new Document({
            sections: [{
                properties: { type: SectionType.CONTINUOUS },
                children: [
                    new Paragraph({
                        text: "Knowledge Vault: " + subjectTitle,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    ...resources.flatMap(r => this.parseVaultResourceToDocx(r))
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${subjectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_vault.docx`);
    }

    private static parseVaultResourceToDocx(r: any): Paragraph[] {
        const paragraphs: Paragraph[] = [];

        // Resource Title
        paragraphs.push(new Paragraph({
            text: r.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            border: {
                bottom: { color: "E5E7EB", space: 5, style: BorderStyle.SINGLE, size: 6 }
            }
        }));

        // Meta info (Type and Unit)
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({ text: r.type.replace('_', ' ').toUpperCase(), bold: true, color: "2563EB" }),
                new TextRun({ text: r.unitId ? ` | ${r.unitId.replace('unit-', 'Unit ')}` : "", color: "6B7280" }),
                new TextRun({ text: r.partNumber ? ` | Part ${r.partNumber}` : "", color: "D97706" })
            ],
            spacing: { after: 200 }
        }));

        // Content
        const content = r.formattedContent || r.content || "";
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('# ')) {
                paragraphs.push(new Paragraph({ text: trimmed.replace('# ', '').trim(), heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
            } else if (trimmed.startsWith('## ')) {
                paragraphs.push(new Paragraph({ text: trimmed.replace('## ', '').trim(), heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }));
            } else if (trimmed.startsWith('- ')) {
                paragraphs.push(new Paragraph({ children: this.parseTextRuns(trimmed.substring(2)), bullet: { level: 0 } }));
            } else {
                paragraphs.push(new Paragraph({ children: this.parseTextRuns(trimmed), spacing: { after: 100 } }));
            }
        }

        paragraphs.push(new Paragraph({ text: "", spacing: { after: 400 } }));
        return paragraphs;
    }

    private static parseTextRuns(text: string): TextRun[] {
        const runs: TextRun[] = [];
        const parts = text.split(/(\*\*.*?\*\*)/g); // Split by bold markers

        parts.forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
                runs.push(new TextRun({
                    text: part.slice(2, -2),
                    bold: true
                }));
            } else if (part) {
                runs.push(new TextRun({
                    text: part
                }));
            }
        });

        return runs;
    }

    // HTML EXPORT METHODS
    static async generateQuestionBankHTMLExport(subjectTitle: string, unitTitle: string, questions: any[]): Promise<void> {
        const content = `
            <div class="header">
                <h1>Question Bank: ${unitTitle}</h1>
                <p class="subtitle">${subjectTitle}</p>
            </div>
            <div class="questions-list">
                ${questions.map((q, idx) => `
                    <div class="question-card">
                        <div class="question-header">
                            <span class="number">${idx + 1}</span>
                            <div class="meta">
                                <span class="marks">${q.marksType} Marks</span>
                            </div>
                        </div>
                        <h2 class="question-text">${q.question}</h2>
                        <div class="answer-section">
                            <p class="label">Suggested Answer:</p>
                            <div class="answer-content">
                                ${this.markdownToHtml(q.formattedAnswer || q.answer || "*No answer provided.*")}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.downloadHTML(content, `${unitTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_questions.html`);
    }

    static async generateVaultHTMLExport(subjectTitle: string, resources: any[]): Promise<void> {
        const content = `
            <div class="header">
                <h1>Knowledge Vault</h1>
                <p class="subtitle">${subjectTitle}</p>
            </div>
            <div class="resources-list">
                ${resources.map(r => `
                    <div class="resource-card">
                        <div class="resource-header">
                            <h2>${r.title}</h2>
                            <div class="badges">
                                <span class="badge type">${r.type.replace('_', ' ').toUpperCase()}</span>
                                ${r.unitId ? `<span class="badge unit">${r.unitId.replace('unit-', 'Unit ')}</span>` : ''}
                                ${r.partNumber ? `<span class="badge part">Part ${r.partNumber}</span>` : ''}
                            </div>
                        </div>
                        <div class="resource-content">
                            ${this.markdownToHtml(r.formattedContent || r.content || "*No content provided.*")}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.downloadHTML(content, `${subjectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_vault.html`);
    }

    static async generateNotesHTMLExport(subjectTitle: string, unitTitle: string, notes: any[]): Promise<void> {
        const content = `
            <div class="header">
                <h1>Revision Notes: ${unitTitle}</h1>
                <p class="subtitle">${subjectTitle}</p>
            </div>
            <div class="notes-list">
                ${notes.map(note => `
                    <div class="resource-card">
                        <div class="resource-header">
                            <h2>${note.title}</h2>
                        </div>
                        <div class="resource-content">
                            ${this.markdownToHtml(note.content)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.downloadHTML(content, `${unitTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.html`);
    }

    static async generateAssignmentHTMLExport(subjectTitle: string, assignment: any, aiAnswer: string): Promise<void> {
        const content = `
            <div class="header">
                <h1>Assignment: ${assignment.title}</h1>
                <p class="subtitle">${subjectTitle}</p>
            </div>
            <div class="resource-card">
                <div class="resource-header">
                    <h2>Task Description</h2>
                </div>
                <div class="resource-content">
                    <p>${assignment.description || 'No description provided.'}</p>
                </div>
            </div>
            <div class="resource-card">
                <div class="resource-header">
                    <h2>AI Solution</h2>
                </div>
                <div class="resource-content">
                    ${this.markdownToHtml(aiAnswer)}
                </div>
            </div>
        `;
        this.downloadHTML(content, `${assignment.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_assignment.html`);
    }

    static async generatePaperTrailHTMLExport(subjectTitle: string, question: Question, aiAnswer: string): Promise<void> {
        const content = `
            <div class="header">
                <h1>PaperTrail PYQ</h1>
                <p class="subtitle">${subjectTitle}</p>
            </div>
            <div class="resource-card">
                <div class="resource-header">
                    <div class="badges">
                        <span class="badge type">${question.marksType} MARKS</span>
                        <span class="badge part">${question.difficulty}</span>
                        ${question.year ? `<span class="badge unit">${question.year}</span>` : ''}
                    </div>
                </div>
                <div class="resource-content">
                    <h2 style="font-size: 20px; margin-bottom: 20px;">${question.question}</h2>
                </div>
            </div>
            <div class="resource-card">
                <div class="resource-header">
                    <h2>AI Solution</h2>
                </div>
                <div class="resource-content">
                    ${this.markdownToHtml(aiAnswer)}
                </div>
            </div>
        `;
        this.downloadHTML(content, `papertrail_${question.question.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`);
    }

    static async generateChatHTMLExport(messages: { role: 'user' | 'assistant', content: string }[]): Promise<void> {
        const content = `
            <div class="header" style="margin-bottom: 40px;">
                <h1>LearnPilot Session</h1>
                <p class="subtitle">${new Date().toLocaleDateString()}</p>
            </div>
            <div class="chat-history">
                ${messages.map(msg => `
                    <div class="chat-message ${msg.role}">
                        <div class="role-badge ${msg.role}">${msg.role === 'user' ? 'YOU' : 'LEARNPILOT'}</div>
                        <div class="message-content">
                            ${this.markdownToHtml(msg.content)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.downloadHTML(content, `learnpilot_session_${new Date().toISOString().slice(0, 10)}.html`, true);
    }

    private static markdownToHtml(md: string): string {
        const processedMd = md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/<\/ul>\s?<ul>/gim, '') // Clean up consecutive lists
            .replace(/\n$/gim, '<br />')
            .replace(/\|(.+)\|/gim, (match) => {
                // Basic table row detection
                const cells = match.split('|').filter(c => {
                    const trimmed = c.trim();
                    return trimmed.length > 0 && !trimmed.includes('---');
                });
                if (match.includes('---')) return ''; // Skip separator row
                return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
            });

        // Wrap table rows in table tags
        let html = processedMd.split('\n').map(line => line.trim().startsWith('<') ? line : `<p>${line}</p>`).join('');
        html = html.replace(/(<tr>.*?<\/tr>)+/gim, '<table>$&</table>');

        return html;
    }

    private static downloadHTML(bodyContent: string, filename: string, isChat: boolean = false): void {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Content - CurricuLab</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-foreground: #ffffff;
            --background: #fafbfc;
            --card: #ffffff;
            --text: #1a1a1a;
            --muted: #64748b;
            --border: #e2e8f0;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 60px;
        }
        .header h1 {
            font-size: ${isChat ? '32px' : '42px'};
            font-weight: 900;
            margin: 0 0 10px 0;
            letter-spacing: -0.02em;
        }
        .header .subtitle {
            font-size: 14px;
            font-weight: 700;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin: 0;
        }

        /* Question Cards */
        .question-card, .resource-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            page-break-inside: avoid;
        }
        .question-header, .resource-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        .number {
            width: 32px;
            height: 32px;
            background: var(--text);
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 14px;
        }
        .marks {
            font-size: 12px;
            font-weight: 800;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .question-text {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 25px 0;
            line-height: 1.2;
        }
        .answer-section {
            background: #f8fafc;
            border-radius: 16px;
            padding: 25px;
            border: 1px solid #f1f5f9;
        }
        .answer-section .label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--muted);
            margin-bottom: 15px;
        }

        /* Resource Styling */
        .resource-header h2 {
            font-size: 28px;
            font-weight: 900;
            margin: 0;
            flex: 1;
        }
        .badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge {
            font-size: 10px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .badge.type { background: #eff6ff; color: #2563eb; }
        .badge.unit { background: #f1f5f9; color: #64748b; }
        .badge.part { background: #fffbeb; color: #d97706; }

        /* Typography inside content */
        .answer-content, .resource-content { font-size: 15px; color: #334155; }
        h1, h2, h3 { color: var(--text); margin-top: 25px; }
        p { margin-bottom: 15px; }
        ul { padding-left: 20px; margin-bottom: 15px; }
        li { margin-bottom: 5px; }
        blockquote {
            border-left: 4px solid var(--primary);
            margin: 20px 0;
            padding: 10px 20px;
            background: #eff6ff;
            font-style: italic;
            border-radius: 0 8px 8px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border);
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        th {
            background: #f8fafc;
            font-weight: 700;
            color: var(--text);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        tr:last-child td { border-bottom: none; }

        /* Chat Specific Styling */
        .chat-history {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        .chat-message {
            padding: 30px;
            border-radius: 24px;
            border: 1px solid var(--border);
            position: relative;
        }
        .chat-message.user {
            background: #f8fafc;
            border-left: 6px solid #475569;
        }
        .chat-message.assistant {
            background: #ffffff;
            border-left: 6px solid var(--primary);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .role-badge {
            font-size: 10px;
            font-weight: 900;
            padding: 5px 12px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 20px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }
        .role-badge.user {
            background: #475569;
            color: #ffffff;
        }
        .role-badge.assistant {
            background: #dbeafe;
            color: #2563eb;
        }
        .message-content {
            color: #1e293b;
            font-size: 15px;
        }

        @media print {
            body { padding: 0; background: white; }
            .question-card, .resource-card, .chat-message { border: none; box-shadow: none; padding: 20px 0; border-bottom: 2px solid var(--border); border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        ${bodyContent}
    </div>
</body>
</html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        saveAs(blob, filename);
    }
}
