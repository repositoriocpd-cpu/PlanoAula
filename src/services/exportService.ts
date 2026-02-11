import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import pptxgen from 'pptxgenjs';
import type { LessonPlan } from '../types/lesson';
import type { AnnualPlan } from '../types/annualPlan';
import type { DidacticSequence } from '../types/sequence';
import type { Assessment } from '../types/assessment';
import type { Report as AppReport } from '../types/report';

// --- VISUAL CONSTANTS ---
const COLORS = {
    primary: [79, 70, 229], // Indigo 600
    secondary: [238, 242, 255], // Indigo 50
    text: [31, 41, 55], // Gray 800
    textLight: [107, 114, 128], // Gray 500
    accent: [224, 231, 255], // Indigo 200 (Borders)
    white: [255, 255, 255]
};

const FONTS = {
    title: { font: 'helvetica', style: 'bold', size: 18 },
    subtitle: { font: 'helvetica', style: 'normal', size: 11 },
    section: { font: 'helvetica', style: 'bold', size: 12 },
    body: { font: 'helvetica', style: 'normal', size: 10 },
    bold: { font: 'helvetica', style: 'bold', size: 10 }
};

const PAGE = {
    width: 210,
    height: 297,
    margin: 20,
    contentWidth: 170 // 210 - 40
};

// --- HELPERS ---

const cleanText = (text: string) => text.replace(/\*\*|\*/g, '');



const renderJustifiedBoldText = (doc: jsPDF, text: string, x: number, y: number, width: number, fontSize: number, isLastLine = false) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    const wordsWithFormat: { text: string, bold: boolean }[] = [];

    parts.forEach(part => {
        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
            const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
            content.split(' ').forEach(w => wordsWithFormat.push({ text: w, bold: true }));
        } else {
            part.split(' ').forEach(w => {
                if (w) wordsWithFormat.push({ text: w, bold: false });
            });
        }
    });

    if (wordsWithFormat.length === 0) return y;

    if (isLastLine) {
        let currentX = x;
        wordsWithFormat.forEach((w, index) => {
            doc.setFont('helvetica', w.bold ? 'bold' : 'normal');
            doc.text(w.text + (index < wordsWithFormat.length - 1 ? ' ' : ''), currentX, y);
            currentX += doc.getTextWidth(w.text + ' ');
        });
        return y + fontSize * 0.5;
    }

    const totalWordsWidth = wordsWithFormat.reduce((acc, w) => {
        doc.setFont('helvetica', w.bold ? 'bold' : 'normal');
        return acc + doc.getTextWidth(w.text);
    }, 0);

    const spaceCount = wordsWithFormat.length - 1;
    const totalSpaceWidth = width - totalWordsWidth;
    const spaceWidth = spaceCount > 0 ? totalSpaceWidth / spaceCount : 0;

    let currentX = x;
    wordsWithFormat.forEach((w) => {
        doc.setFont('helvetica', w.bold ? 'bold' : 'normal');
        doc.text(w.text, currentX, y);
        currentX += doc.getTextWidth(w.text) + spaceWidth;
    });

    return y + fontSize * 0.5;
};

const splitTextWithBold = (doc: jsPDF, text: string, maxWidth: number) => {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    paragraphs.forEach(p => {
        const words = p.split(' ');
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const plainTestLine = testLine.replace(/\*\*|\*/g, '');
            if (doc.getTextWidth(plainTestLine) > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine + '\n');
    });

    return lines;
};

// --- DESIGN COMPONENTS ---

const drawHeader = (doc: jsPDF, title: string, _subtitle: string) => {
    // Top Bar
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, PAGE.width, 24, 'F');

    // Logo / Brand
    doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PLANEJAEDU', PAGE.margin, 16);

    // Document Type (Right Aligned)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(title.toUpperCase(), PAGE.width - PAGE.margin, 16, { align: 'right' });

    // Reset
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
};

const drawFooter = (doc: jsPDF, pageNumber: number) => {
    const y = PAGE.height - 10;
    doc.setDrawColor(229, 231, 235); // Gray 200
    doc.setLineWidth(0.5);
    doc.line(PAGE.margin, y - 5, PAGE.width - PAGE.margin, y - 5);

    doc.setFontSize(8);
    doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    doc.text(`Gerado por PlanejaEdu AI • ${new Date().toLocaleDateString()}`, PAGE.margin, y);
    doc.text(`Página ${pageNumber}`, PAGE.width - PAGE.margin, y, { align: 'right' });
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
};

const drawSectionTitle = (doc: jsPDF, title: string, y: number) => {
    doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.roundedRect(PAGE.margin, y - 5, PAGE.contentWidth, 10, 2, 2, 'FD');

    doc.setFont(FONTS.section.font, FONTS.section.style);
    doc.setFontSize(FONTS.section.size);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(title.toUpperCase(), PAGE.margin + 4, y + 1.5);

    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    return y + 12;
};

const checkPageBreak = (doc: jsPDF, y: number, heightObj: number, title: string, subtitle: string, pageNum: { val: number }) => {
    if (y + heightObj > PAGE.height - 20) {
        drawFooter(doc, pageNum.val);
        doc.addPage();
        pageNum.val++;
        drawHeader(doc, title, subtitle);
        return 40; // New Y
    }
    return y;
};

// --- EXPORT FUNCTIONS ---

export const exportLessonToPDF = (plan: LessonPlan, doc?: jsPDF, startY = 35) => {
    const internalDoc = doc || new jsPDF();
    let y = startY;
    let pageNum = { val: 1 };

    if (!doc) drawHeader(internalDoc, 'Plano de Aula', plan.discipline);

    // Title Block
    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    const titleLines = internalDoc.splitTextToSize(cleanText(plan.title), PAGE.contentWidth);
    internalDoc.text(titleLines, PAGE.margin, y);
    y += (titleLines.length * 8) + 4;

    // Info Grid
    internalDoc.setFillColor(250, 250, 250);
    internalDoc.setDrawColor(230, 230, 230);
    internalDoc.roundedRect(PAGE.margin, y, PAGE.contentWidth, 18, 2, 2, 'FD');

    internalDoc.setFontSize(9);
    internalDoc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.text('Disciplina:', PAGE.margin + 5, y + 6);
    internalDoc.text('Série/Ano:', PAGE.margin + 70, y + 6);
    internalDoc.text('Duração:', PAGE.margin + 130, y + 6);

    internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
    internalDoc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    internalDoc.text(plan.discipline, PAGE.margin + 5, y + 12);
    internalDoc.text(plan.grade, PAGE.margin + 70, y + 12);
    internalDoc.text(plan.duration, PAGE.margin + 130, y + 12);
    y += 28;

    const addSection = (title: string, rawText: string | string[]) => {
        if (!rawText || (Array.isArray(rawText) && rawText.length === 0)) return;

        y = checkPageBreak(internalDoc, y, 20, 'Plano de Aula', plan.discipline, pageNum);
        y = drawSectionTitle(internalDoc, title, y);

        internalDoc.setFont(FONTS.body.font, FONTS.body.style);
        internalDoc.setFontSize(FONTS.body.size);

        const items = Array.isArray(rawText) ? rawText : [rawText];
        items.forEach(item => {
            const textToProcess = Array.isArray(rawText) ? `• ${item}` : item;
            const lines = splitTextWithBold(internalDoc, textToProcess, PAGE.contentWidth);
            lines.forEach((line: string) => {
                y = checkPageBreak(internalDoc, y, 10, 'Plano de Aula', plan.discipline, pageNum);
                const isEndOfParagraph = line.endsWith('\n');
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, PAGE.margin, y, PAGE.contentWidth, 10, isEndOfParagraph);
                y += 2;
            });
            y += 2; // Paragraph spacing
        });
        y += 6; // Section spacing
    };

    const c = plan.content;
    if (c) {
        addSection('Fundamentação', c.foundation);
        addSection('Objetivo Geral', c.generalObjective);
        addSection('Objetivos Específicos', c.specificObjectives);
        addSection('Conteúdo', c.content);
        addSection('Metodologia', c.methodology);
        addSection('Recursos', c.resources);
        addSection('Avaliação', c.evaluation);
        addSection('BNCC', c.bnccSkills);
    }

    if (!doc) {
        drawFooter(internalDoc, pageNum.val);
        internalDoc.save(`${plan.title.replace(/ /g, '_')}.pdf`);
    }
    return y;
};

export const exportAnnualPlanToPDF = (plan: AnnualPlan, doc?: jsPDF, startY = 35) => {
    const internalDoc = doc || new jsPDF();
    let y = startY;
    let pageNum = { val: 1 };

    if (!doc) drawHeader(internalDoc, 'Plano Anual', plan.discipline);

    // Title
    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    internalDoc.text(`Plano Anual: ${plan.discipline}`, PAGE.margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setFont(FONTS.subtitle.font, FONTS.subtitle.style);
    internalDoc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.text(`Série: ${plan.grade}`, PAGE.margin, y);
    internalDoc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    y += 15;

    if (plan.planType === 'infantil' && plan.infantilContent) {
        const content = plan.infantilContent;
        y = drawSectionTitle(internalDoc, "OBJETIVO GERAL", y);
        const objLines = splitTextWithBold(internalDoc, content.generalObjective, PAGE.contentWidth);
        objLines.forEach(line => {
            y = checkPageBreak(internalDoc, y, 6, 'Plano Anual', plan.discipline, pageNum);
            y = renderJustifiedBoldText(internalDoc, line.replace('\n', ''), PAGE.margin, y, PAGE.contentWidth, 10, line.endsWith('\n'));
            y += 2;
        });
        y += 8;

        content.experienceFields.forEach(field => {
            y = checkPageBreak(internalDoc, y, 30, 'Plano Anual', plan.discipline, pageNum);
            y = drawSectionTitle(internalDoc, field.fieldName, y);

            const addSubItem = (label: string, text: string | string[]) => {
                internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
                internalDoc.text(label, PAGE.margin + 2, y);
                y += 5;
                internalDoc.setFont(FONTS.body.font, FONTS.body.style);
                const raw = Array.isArray(text) ? text.map(t => `• ${t}`).join('\n') : text;
                const lines = splitTextWithBold(internalDoc, raw, PAGE.contentWidth - 5);
                lines.forEach(l => {
                    y = checkPageBreak(internalDoc, y, 6, 'Plano Anual', plan.discipline, pageNum);
                    y = renderJustifiedBoldText(internalDoc, l.replace('\n', ''), PAGE.margin + 4, y, PAGE.contentWidth - 4, 10, l.endsWith('\n'));
                    y += 2;
                });
                y += 4;
            };

            addSubItem('Objetivos:', field.objectives);
            addSubItem('Eixos:', field.themes);
            addSubItem('Metodologia:', field.methodology);
            y += 4;
        });

    } else if (plan.bimesters) {
        plan.bimesters.forEach(bim => {
            y = checkPageBreak(internalDoc, y, 40, 'Plano Anual', plan.discipline, pageNum);
            y = drawSectionTitle(internalDoc, bim.name, y);

            const addList = (label: string, items: string[]) => {
                if (!items.length) return;
                internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
                internalDoc.text(label, PAGE.margin + 2, y);
                y += 5;
                internalDoc.setFont(FONTS.body.font, FONTS.body.style);
                items.forEach(i => {
                    y = checkPageBreak(internalDoc, y, 6, 'Plano Anual', plan.discipline, pageNum);
                    const lines = splitTextWithBold(internalDoc, `• ${i}`, PAGE.contentWidth - 4);
                    lines.forEach(l => {
                        y = renderJustifiedBoldText(internalDoc, l.replace('\n', ''), PAGE.margin + 4, y, PAGE.contentWidth - 4, 10, l.endsWith('\n'));
                        y += 2;
                    });
                });
                y += 4;
            };

            addList('Temas:', bim.themes);
            addList('Habilidades:', bim.bnccSkills);
            addList('Objetivos:', bim.objectives);

            internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
            internalDoc.text("Avaliação:", PAGE.margin + 2, y);
            y += 5;
            const evalLines = splitTextWithBold(internalDoc, bim.evaluation, PAGE.contentWidth - 4);
            evalLines.forEach(l => {
                y = checkPageBreak(internalDoc, y, 6, 'Plano Anual', plan.discipline, pageNum);
                y = renderJustifiedBoldText(internalDoc, l.replace('\n', ''), PAGE.margin + 4, y, PAGE.contentWidth - 4, 10, l.endsWith('\n'));
                y += 2;
            });
            y += 8;
        });
    }

    if (!doc) {
        drawFooter(internalDoc, pageNum.val);
        internalDoc.save(`Plano_Anual_${plan.discipline}.pdf`);
    }
    return y;
};

export const exportSequenceToPDF = (sequence: DidacticSequence, doc?: jsPDF, startY = 35) => {
    const internalDoc = doc || new jsPDF();
    let y = startY;
    let pageNum = { val: 1 };

    if (!doc) drawHeader(internalDoc, 'Sequência Didática', sequence.theme);

    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    const titleLines = internalDoc.splitTextToSize(sequence.theme || 'Sem Título', PAGE.contentWidth);
    internalDoc.text(titleLines, PAGE.margin, y);
    y += (titleLines.length * 8) + 4;

    internalDoc.setFontSize(11);
    internalDoc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.text(`Duração Total: ${sequence.numClasses} aulas`, PAGE.margin, y);
    internalDoc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    y += 15;

    if (sequence.classes && Array.isArray(sequence.classes)) {
        sequence.classes.forEach(c => {
            y = checkPageBreak(internalDoc, y, 30, 'Sequência Didática', sequence.theme, pageNum);
            y = drawSectionTitle(internalDoc, `AULA ${c.classNumber}: ${c.topic}`, y);

            const addList = (label: string, items: string[]) => {
                if (!items || !Array.isArray(items) || !items.length) return;
                internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
                internalDoc.text(label, PAGE.margin + 2, y);
                y += 5;
                internalDoc.setFont(FONTS.body.font, FONTS.body.style);
                items.forEach(i => {
                    const lines = splitTextWithBold(internalDoc, `• ${i}`, PAGE.contentWidth - 4);
                    lines.forEach(l => {
                        y = checkPageBreak(internalDoc, y, 6, 'Sequência Didática', sequence.theme, pageNum);
                        y = renderJustifiedBoldText(internalDoc, l.replace('\n', ''), PAGE.margin + 4, y, PAGE.contentWidth - 4, 10, l.endsWith('\n'));
                        y += 2;
                    });
                });
                y += 4;
            };

            addList("Atividades:", c.activities);
            addList("Recursos:", c.resources);
            y += 4;
        });
    }

    if (!doc) {
        drawFooter(internalDoc, pageNum.val);
        internalDoc.save(`Sequencia_${(sequence.theme || 'Untitled').replace(/ /g, '_')}.pdf`);
    }
    return y;
};

export const exportSequencesToWord = async (sequences: DidacticSequence[], filename = "Sequencias.docx") => {
    const sections = sequences.map(seq => {
        const children = [
            new Paragraph({
                children: [new TextRun({ text: seq.theme || 'Sem Título', bold: true, size: 36, color: "4F46E5" })],
                spacing: { after: 200 }
            }),
            new Paragraph({
                children: [new TextRun({ text: `Duração: ${seq.numClasses} aulas`, size: 24, color: "6B7280" })],
                spacing: { after: 400 }
            })
        ];

        if (seq.classes && Array.isArray(seq.classes)) {
            seq.classes.forEach(c => {
                // Class Header
                children.push(
                    new Paragraph({
                        children: [new TextRun({ text: `AULA ${c.classNumber}: ${c.topic}`, bold: true, size: 28, color: "1F2937" })],
                        spacing: { before: 300, after: 200 },
                        border: { bottom: { color: "E5E7EB", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                    })
                );

                // Activities
                if (c.activities && c.activities.length) {
                    children.push(new Paragraph({ children: [new TextRun({ text: "Atividades:", bold: true, size: 24 })], spacing: { after: 100 } }));
                    c.activities.forEach(act => {
                        children.push(new Paragraph({ children: [new TextRun({ text: `• ${act}`, size: 24 })], spacing: { after: 50 }, indent: { left: 400 } }));
                    });
                }

                // Resources
                if (c.resources && c.resources.length) {
                    children.push(new Paragraph({ children: [new TextRun({ text: "Recursos:", bold: true, size: 24 })], spacing: { before: 200, after: 100 } }));
                    c.resources.forEach(res => {
                        children.push(new Paragraph({ children: [new TextRun({ text: `• ${res}`, size: 24 })], spacing: { after: 50 }, indent: { left: 400 } }));
                    });
                }
            });
        }

        // Final Evaluation
        if (seq.finalEvaluation) {
            children.push(new Paragraph({ children: [new TextRun({ text: "Avaliação Final:", bold: true, size: 28, color: "1F2937" })], spacing: { before: 400, after: 200 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: seq.finalEvaluation, size: 24 })] }));
        }

        return {
            properties: {},
            children: children
        };
    });

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
export const exportAssessmentToPDF = (assessment: Assessment, doc?: jsPDF, startY = 35) => {
    const internalDoc = doc || new jsPDF();
    let y = startY;
    let pageNum = { val: 1 };

    if (!doc) drawHeader(internalDoc, 'Avaliação', assessment.discipline);

    // Title Block
    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    internalDoc.text(assessment.title, PAGE.margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.text(`${assessment.type} • ${assessment.discipline} • ${assessment.grade}`, PAGE.margin, y);
    internalDoc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    y += 15;

    // Student Name Box
    internalDoc.setDrawColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.rect(PAGE.margin, y, PAGE.contentWidth, 12);
    internalDoc.setFontSize(10);
    internalDoc.text("Nome: __________________________________________________________________  Data: ___/___/___", PAGE.margin + 4, y + 8);
    y += 24;

    if (assessment.questions) {
        y = drawSectionTitle(internalDoc, "QUESTÕES", y);
        y += 5;

        assessment.questions.forEach((q, index) => {
            y = checkPageBreak(internalDoc, y, 30, 'Avaliação', assessment.discipline, pageNum);

            // Question Header
            internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
            internalDoc.text(`${index + 1}.`, PAGE.margin, y);

            const qLines = splitTextWithBold(internalDoc, q.text, PAGE.contentWidth - 10);
            qLines.forEach(line => {
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, PAGE.margin + 8, y, PAGE.contentWidth - 10, 10, line.endsWith('\n'));
                y += 2;
            });
            y += 4;

            internalDoc.setFont(FONTS.body.font, FONTS.body.style);

            if (q.type === 'multiple_choice' && q.options) {
                q.options.forEach(opt => {
                    const optText = `(   )  ${opt}`;
                    const optLines = internalDoc.splitTextToSize(optText, PAGE.contentWidth - 12);
                    y = checkPageBreak(internalDoc, y, optLines.length * 6, 'Avaliação', assessment.discipline, pageNum);
                    internalDoc.text(optLines, PAGE.margin + 8, y);
                    y += (optLines.length * 6) + 2;
                });
            } else if (q.type === 'essay') {
                y = checkPageBreak(internalDoc, y, 30, 'Avaliação', assessment.discipline, pageNum);
                // Dotted lines
                for (let i = 0; i < 5; i++) {
                    internalDoc.text("____________________________________________________________________________________________", PAGE.margin + 8, y);
                    y += 8;
                }
            }
            y += 6;
        });
    }

    if (assessment.rubric) {
        y = checkPageBreak(internalDoc, y, 40, 'Avaliação', assessment.discipline, pageNum);
        y = drawSectionTitle(internalDoc, "CRITÉRIOS DE AVALIAÇÃO (RUBRICA)", y);

        assessment.rubric.forEach(criteria => {
            y = checkPageBreak(internalDoc, y, 20, 'Avaliação', assessment.discipline, pageNum);
            internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
            internalDoc.text(criteria.criteria, PAGE.margin, y);
            y += 6;

            internalDoc.setFont(FONTS.body.font, FONTS.body.style);
            criteria.levels.forEach(l => {
                y = checkPageBreak(internalDoc, y, 10, 'Avaliação', assessment.discipline, pageNum);
                const text = `${l.level}: ${l.description}`;
                const lines = internalDoc.splitTextToSize(text, PAGE.contentWidth - 5);
                internalDoc.text(lines, PAGE.margin + 5, y);
                y += (lines.length * 5) + 2;
            });
            y += 4;
        });
    }

    if (!doc) {
        drawFooter(internalDoc, pageNum.val);
        internalDoc.save(`${assessment.title.replace(/ /g, '_')}.pdf`);
    }
    return y;
};

export const exportReportToPDF = (report: AppReport, doc?: jsPDF, startY = 35) => {
    const internalDoc = doc || new jsPDF();
    let y = startY;
    let pageNum = { val: 1 };

    if (!doc) drawHeader(internalDoc, 'Relatório Individual', report.studentName);

    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    internalDoc.text(`Relatório: ${report.studentName}`, PAGE.margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
    internalDoc.text(`${report.grade} • ${report.period}`, PAGE.margin, y);
    internalDoc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    y += 15;

    const lines = splitTextWithBold(internalDoc, report.content, PAGE.contentWidth);
    lines.forEach((line: string) => {
        y = checkPageBreak(internalDoc, y, 6, 'Relatório Individual', report.studentName, pageNum);
        const isEndOfParagraph = line.endsWith('\n');
        const cleanLine = line.replace('\n', '');
        y = renderJustifiedBoldText(internalDoc, cleanLine, PAGE.margin, y, PAGE.contentWidth, 10, isEndOfParagraph);
        y += 2;
    });

    if (!doc) {
        drawFooter(internalDoc, pageNum.val);
        internalDoc.save(`Relatorio_${report.studentName.replace(/ /g, '_')}.pdf`);
    }
    return y;
};

// --- RESTORED EXPORTS (MARKDOWN / WORD / PPTX) ---

export const exportMarkdownToPDF = (title: string, markdown: string, filename: string) => {
    const internalDoc = new jsPDF();
    let y = 35;
    let pageNum = { val: 1 };

    drawHeader(internalDoc, 'Recurso Pedagógico', title);

    internalDoc.setFont(FONTS.title.font, FONTS.title.style);
    internalDoc.setFontSize(FONTS.title.size);
    const titleLines = internalDoc.splitTextToSize(title, PAGE.contentWidth);
    internalDoc.text(titleLines, PAGE.margin, y);
    y += (titleLines.length * 8) + 10;

    internalDoc.setFont(FONTS.body.font, FONTS.body.style);
    internalDoc.setFontSize(FONTS.body.size);

    const lines = splitTextWithBold(internalDoc, markdown, PAGE.contentWidth);
    lines.forEach((line: string) => {
        y = checkPageBreak(internalDoc, y, 6, 'Recurso Pedagógico', title, pageNum);

        // Detect Header Lines (starting with #)
        const trimmedLine = line.trim();
        const isHeader = trimmedLine.startsWith('#');
        const contentToRender = isHeader ? trimmedLine.replace(/^#+\s*/, '') : line;

        if (isHeader) {
            internalDoc.setFont(FONTS.bold.font, FONTS.bold.style);
        } else {
            internalDoc.setFont(FONTS.body.font, FONTS.body.style);
        }

        const isEndOfParagraph = line.endsWith('\n');
        const cleanLine = contentToRender.replace('\n', '');

        // If header, render simpler (no justified needed usually, but keeping consistency)
        if (isHeader) {
            internalDoc.text(cleanLine, PAGE.margin, y);
        } else {
            y = renderJustifiedBoldText(internalDoc, cleanLine, PAGE.margin, y, PAGE.contentWidth, 10, isEndOfParagraph);
            y -= 2; // Adjust for renderJustified adding line height, we manage it below for headers
        }

        y += isHeader ? 8 : 4; // More space after headers

        // Reset font
        internalDoc.setFont(FONTS.body.font, FONTS.body.style);
    });

    drawFooter(internalDoc, pageNum.val);
    internalDoc.save(`${filename}.pdf`);
};

export const exportMarkdownToWord = async (title: string, markdown: string, filename: string) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: title, bold: true, size: 36, color: "4F46E5" }),
                    ],
                    spacing: { after: 400 }
                }),
                ...markdown.split('\n').map(line => {
                    const trimmed = line.trim();
                    const isHeader = trimmed.startsWith('#');
                    const cleanContent = isHeader ? trimmed.replace(/^#+\s*/, '') : line;

                    if (isHeader) {
                        return new Paragraph({
                            children: [new TextRun({ text: cleanContent, bold: true, size: 28, color: "1F2937" })],
                            spacing: { before: 240, after: 120 }
                        });
                    }

                    return new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: cleanContent.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                            if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                return new TextRun({ text: content, bold: true, size: 22 });
                            }
                            return new TextRun({ text: part, size: 22 });
                        }),
                        spacing: { after: 200 }
                    });
                })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
};

export const exportMarkdownToPPTX = async (title: string, markdown: string, filename: string) => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    const cleanContent = (text: string) => text
        .replace(/\[TÍTULO DO SLIDE\]/i, '')
        .replace(/\[KEYWORD:.*?\]/i, '')
        .replace(/\[CONTEÚDO:\]/i, '')
        .replace(/Slide\s+\d+:?/gi, '')
        .replace(/\*\*|\*|#|\[|\]/g, '')
        .trim();

    const slides = markdown.includes('---SPLIT---')
        ? markdown.split('---SPLIT---')
        : markdown.split(/(?:^|\n)Slide\s+\d+:?/i);

    const processedSlides = slides.filter(s => s.trim().length > 10);

    const coverData = processedSlides[0] || markdown;
    const coverTitle = cleanContent(coverData.split('\n')[0]) || title;
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: '0F172A' };

    coverSlide.addText('PlanejaEdu AI', { x: '5%', y: '10%', fontSize: 14, color: 'A78BFA', bold: true });
    coverSlide.addText(coverTitle.toUpperCase(), { x: '5%', y: '40%', w: '90%', fontSize: 44, color: 'FFFFFF', bold: true, align: 'center' });

    for (let i = 1; i < processedSlides.length; i++) {
        const rawContent = processedSlides[i];
        const lines = rawContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const slideTitle = cleanContent(lines[0] || 'Conteúdo');
        const contentLines = lines.slice(1).map(l => cleanContent(l));

        const slideObj = pptx.addSlide();
        slideObj.addText(slideTitle.toUpperCase(), { x: '5%', y: '10%', w: '90%', fontSize: 24, color: '4F46E5', bold: true });

        slideObj.addText(contentLines.join('\n\n'), {
            x: '5%', y: '25%', w: '90%', h: '65%', fontSize: 16, color: '334155', valign: 'top', bullet: { indent: 15 }
        });

        slideObj.addText('PlanejaEdu AI', { x: '5%', y: '92%', w: '90%', fontSize: 9, color: 'CBD5E1', align: 'right' });
    }

    await pptx.writeFile({ fileName: `${filename}.pptx` });
};

export const exportJSONToPPTX = async (presentation: any, filename: string) => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    if (presentation && presentation.content_json && presentation.content_json.slides) {
        presentation.content_json.slides.forEach((slide: any) => {
            const slideObj = pptx.addSlide();
            slideObj.addText(slide.headline || 'Slide', { x: 1, y: 1, fontSize: 24 });
        });
    }

    await pptx.writeFile({ fileName: `${filename}.pptx` });
};

export const exportLessonsToWord = async (plans: LessonPlan[], filename = "Planos_de_Aula.docx") => {
    const doc = new Document({
        sections: plans.map(plan => ({
            properties: {},
            children: [
                new Paragraph({ children: [new TextRun({ text: plan.title, bold: true, size: 32 })] }),
                new Paragraph({ children: [new TextRun({ text: `\n${plan.discipline} • ${plan.grade}`, size: 24 })] })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

export const exportAnnualPlansToWord = async (plans: AnnualPlan[], filename = "Planos_Anuais.docx") => {
    const doc = new Document({
        sections: plans.map(plan => ({
            properties: {},
            children: [
                new Paragraph({ children: [new TextRun({ text: plan.discipline, bold: true, size: 32 })] })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};



export const exportAssessmentsToWord = async (assessments: Assessment[], filename = "Avaliacoes.docx") => {
    const doc = new Document({
        sections: assessments.map(assessment => ({
            properties: {},
            children: [
                new Paragraph({ children: [new TextRun({ text: assessment.title, bold: true, size: 32 })] })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

export const exportReportsToWord = async (reports: AppReport[], filename = "Relatorios.docx") => {
    const doc = new Document({
        sections: reports.map(report => ({
            properties: {},
            children: [
                new Paragraph({ children: [new TextRun({ text: report.studentName, bold: true, size: 32 })] })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
