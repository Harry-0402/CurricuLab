import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { Note } from "@/types";

export class PlatformExportService {
    static async generateWordDocument(
        subjectTitle: string,
        unitTitle: string,
        notes: Note[]
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

    private static parseNoteToDocx(note: Note): Paragraph[] {
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
}
