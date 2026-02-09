import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { LessonPlan } from '../types/lesson';
import type { AnnualPlan } from '../types/annualPlan';
import type { DidacticSequence } from '../types/sequence';
import type { Assessment } from '../types/assessment';
import type { Report as AppReport } from '../types/report';

const cleanText = (text: string) => text.replace(/\*\*|\*/g, '');

const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
};

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

// Helper to split text into lines that fit a width, preserving bold markers
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
        lines.push(currentLine + '\n'); // \n denotes end of paragraph
    });

    return lines;
};

export const exportLessonToPDF = (plan: LessonPlan, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;

    const [r, g, b] = plan.headerColor ? hexToRgb(plan.headerColor) : [124, 58, 237];

    const addHeader = (title: string) => {
        internalDoc.setFillColor(r, g, b);
        internalDoc.rect(0, 0, pageWidth, 15, 'F');
        internalDoc.setTextColor(255, 255, 255);
        internalDoc.setFontSize(10);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.text('PLANEJAEDU - ' + title.toUpperCase(), margin, 10);
        internalDoc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
        internalDoc.setTextColor(0);
    };

    if (!doc) addHeader('Plano de Aula');

    const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - 20) {
            internalDoc.addPage();
            y = 20;
            addHeader('Plano de Aula (cont.)');
        }
    };

    // Title
    internalDoc.setFontSize(18);
    internalDoc.setFont('helvetica', 'bold');
    const titleLines = internalDoc.splitTextToSize(cleanText(plan.title), contentWidth);
    internalDoc.text(titleLines, margin, y);
    y += (titleLines.length * 8) + 5;

    // Info Box
    internalDoc.setFillColor(243, 244, 246);
    internalDoc.rect(margin, y, contentWidth, 20, 'F');
    internalDoc.setFontSize(10);
    internalDoc.setFont('helvetica', 'normal');
    internalDoc.text(`${plan.discipline} • ${plan.grade}`, margin + 5, y + 8);
    internalDoc.text(`Duração: ${plan.duration}`, margin + 5, y + 15);
    y += 30;

    const addSection = (title: string, rawText: string | string[]) => {
        if (!rawText || (Array.isArray(rawText) && rawText.length === 0)) return;
        checkPageBreak(15);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.setFontSize(12);
        internalDoc.setTextColor(r, g, b);
        internalDoc.text(title.toUpperCase(), margin, y);
        y += 7;
        internalDoc.setTextColor(30);
        internalDoc.setFontSize(11);

        const items = Array.isArray(rawText) ? rawText : [rawText];
        items.forEach(item => {
            const textToProcess = Array.isArray(rawText) ? `• ${item}` : item;
            const lines = splitTextWithBold(internalDoc, textToProcess, contentWidth);
            lines.forEach((line: string) => {
                checkPageBreak(6);
                const isEndOfParagraph = line.endsWith('\n');
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, margin, y, contentWidth, 11, isEndOfParagraph);
                y += 2;
            });
            y += 2;
        });
        y += 5;
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

    if (!doc) internalDoc.save(`${plan.title.replace(/ /g, '_')}.pdf`);
    return y;
};

export const exportLessonsToWord = async (plans: LessonPlan[], filename = "Planos_de_Aula.docx") => {
    const doc = new Document({
        sections: plans.map(plan => ({
            properties: {},
            children: [
                new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                        new TextRun({ text: plan.title, bold: true, size: 32 }),
                        new TextRun({ text: `\n${plan.discipline} • ${plan.grade} • ${plan.duration}`, size: 20, break: 1 }),
                    ],
                }),
                ...(plan.content ? [
                    { t: "Fundamentação", c: plan.content.foundation },
                    { t: "Objetivo Geral", c: plan.content.generalObjective },
                    { t: "Objetivos Específicos", c: plan.content.specificObjectives },
                    { t: "Conteúdo", c: plan.content.content },
                    { t: "Metodologia", c: plan.content.methodology },
                    { t: "Avaliação", c: plan.content.evaluation },
                ].flatMap(s => {
                    const items = Array.isArray(s.c) ? s.c : [s.c];
                    return [
                        new Paragraph({
                            children: [new TextRun({ text: s.t.toUpperCase(), bold: true, size: 24, color: "7C3AED" })],
                            spacing: { before: 400, after: 200 }
                        }),
                        ...items.map(i => new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            children: i.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true, size: 22 });
                                }
                                return new TextRun({ text: part, size: 22 });
                            }),
                            spacing: { after: 120 }
                        }))
                    ];
                }) : [])
            ]
        }))
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

// --- Annual Plan Exports ---

export const exportAnnualPlanToPDF = (plan: AnnualPlan, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;
    const [r, g, b] = plan.headerColor ? hexToRgb(plan.headerColor) : [124, 58, 237];

    if (!doc) {
        internalDoc.setFillColor(r, g, b);
        internalDoc.rect(0, 0, pageWidth, 15, 'F');
        internalDoc.setTextColor(255, 255, 255);
        internalDoc.setFontSize(10);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.text('PLANEJAEDU - PLANO ANUAL', margin, 10);
        internalDoc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
        internalDoc.setTextColor(0);
    }

    const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - 20) {
            internalDoc.addPage();
            y = 20;
        }
    };

    internalDoc.setFontSize(18);
    internalDoc.setFont('helvetica', 'bold');
    internalDoc.text(`Plano Anual: ${plan.discipline}`, margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setFont('helvetica', 'normal');
    internalDoc.text(`Série: ${plan.grade}`, margin, y);
    y += 12;

    if (plan.planType === 'infantil' && plan.infantilContent) {
        const content = plan.infantilContent;

        // Objetivo Geral
        checkPageBreak(20);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.setTextColor(r, g, b);
        internalDoc.text("OBJETIVO GERAL", margin, y);
        y += 7;
        internalDoc.setTextColor(30);
        internalDoc.setFont('helvetica', 'normal');
        const objLines = splitTextWithBold(internalDoc, content.generalObjective, contentWidth);
        objLines.forEach(line => {
            checkPageBreak(6);
            const isEndOfParagraph = line.endsWith('\n');
            const cleanLine = line.replace('\n', '');
            y = renderJustifiedBoldText(internalDoc, cleanLine, margin, y, contentWidth, 11, isEndOfParagraph);
            y += 2;
        });
        y += 5;

        // Campos de Experiência
        content.experienceFields.forEach(field => {
            checkPageBreak(30);
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.setTextColor(r, g, b);
            internalDoc.text(field.fieldName.toUpperCase(), margin, y);
            y += 7;
            internalDoc.setTextColor(30);
            internalDoc.setFontSize(10);

            const addSubSection = (label: string, items: string[] | string) => {
                internalDoc.setFont('helvetica', 'bold');
                internalDoc.text(label, margin + 5, y);
                y += 5;
                internalDoc.setFont('helvetica', 'normal');
                const rawText = Array.isArray(items) ? items.map(i => `• ${i}`).join('\n') : items;
                const lines = splitTextWithBold(internalDoc, rawText, contentWidth - 10);
                lines.forEach(line => {
                    checkPageBreak(6);
                    const isEndOfParagraph = line.endsWith('\n');
                    const cleanLine = line.replace('\n', '');
                    y = renderJustifiedBoldText(internalDoc, cleanLine, margin + 10, y, contentWidth - 10, 10, isEndOfParagraph);
                    y += 2;
                });
                y += 3;
            };

            addSubSection("Objetivos de Aprendizagem:", field.objectives);
            addSubSection("Eixos Temáticos:", field.themes);
            addSubSection("Metodologia:", field.methodology);
            y += 5;
            internalDoc.setFontSize(11);
        });

        // Direitos, Materiais, Avaliação
        const addFinalSection = (title: string, text: string | string[]) => {
            checkPageBreak(20);
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.setTextColor(r, g, b);
            internalDoc.text(title.toUpperCase(), margin, y);
            y += 7;
            internalDoc.setTextColor(30);
            internalDoc.setFont('helvetica', 'normal');
            const rawText = Array.isArray(text) ? text.join(', ') : text;
            const lines = splitTextWithBold(internalDoc, rawText, contentWidth);
            lines.forEach(line => {
                checkPageBreak(6);
                const isEndOfParagraph = line.endsWith('\n');
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, margin, y, contentWidth, 11, isEndOfParagraph);
                y += 2;
            });
            y += 5;
        };

        addFinalSection("Direitos de Aprendizagem", content.learningRights);
        addFinalSection("Recursos Materiais", content.materials);
        addFinalSection("Avaliação", content.evaluation);

    } else if (plan.bimesters) {
        plan.bimesters.forEach((bim) => {
            checkPageBreak(30);
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.setFontSize(13);
            internalDoc.setTextColor(r, g, b);
            internalDoc.text(bim.name.toUpperCase(), margin, y);
            y += 8;
            internalDoc.setTextColor(30);
            internalDoc.setFontSize(11);

            const addItems = (label: string, items: string[]) => {
                if (items.length === 0) return;
                checkPageBreak(10);
                internalDoc.setFont('helvetica', 'bold');
                internalDoc.text(label, margin + 5, y);
                y += 6;
                items.forEach(i => {
                    const lines = splitTextWithBold(internalDoc, `• ${i}`, contentWidth - 10);
                    lines.forEach((line: string) => {
                        checkPageBreak(6);
                        const isEndOfParagraph = line.endsWith('\n');
                        const cleanLine = line.replace('\n', '');
                        y = renderJustifiedBoldText(internalDoc, cleanLine, margin + 10, y, contentWidth - 10, 11, isEndOfParagraph);
                        y += 2;
                    });
                });
                y += 4;
            };

            addItems("Temas:", bim.themes);
            addItems("Habilidades BNCC:", bim.bnccSkills);
            addItems("Objetivos:", bim.objectives);

            checkPageBreak(15);
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.text("Avaliação:", margin + 5, y);
            y += 6;
            const evalLines = splitTextWithBold(internalDoc, bim.evaluation, contentWidth - 10);
            evalLines.forEach((line: string) => {
                checkPageBreak(6);
                const isEndOfParagraph = line.endsWith('\n');
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, margin + 10, y, contentWidth - 10, 11, isEndOfParagraph);
                y += 2;
            });
            y += 10;
        });
    }

    if (!doc) internalDoc.save(`Plano_Anual_${plan.discipline}.pdf`);
    return y;
};

export const exportAnnualPlansToWord = async (plans: AnnualPlan[], filename = "Planos_Anuais.docx") => {
    const doc = new Document({
        sections: plans.map(plan => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: `Plano Anual: ${plan.discipline}`, bold: true, size: 32 }),
                        new TextRun({ text: `\nSérie: ${plan.grade}`, size: 24, break: 1 }),
                    ],
                }),
                ...(plan.planType === 'infantil' && plan.infantilContent ? [
                    new Paragraph({
                        children: [new TextRun({ text: "OBJETIVO GERAL", bold: true, size: 28, color: "7C3AED" })],
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: plan.infantilContent.generalObjective.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                            if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                return new TextRun({ text: content, bold: true });
                            }
                            return new TextRun({ text: part });
                        }),
                        spacing: { after: 200 }
                    }),
                    ...plan.infantilContent.experienceFields.flatMap(field => [
                        new Paragraph({
                            children: [new TextRun({ text: field.fieldName.toUpperCase(), bold: true, size: 26, color: "7C3AED" })],
                            spacing: { before: 300, after: 150 }
                        }),
                        new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            children: [
                                new TextRun({ text: "Objetivos de Aprendizagem: ", bold: true }),
                                new TextRun({ text: field.objectives.join(", ") })
                            ],
                            spacing: { after: 120 }
                        }),
                        new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            children: [
                                new TextRun({ text: "Eixos Temáticos: ", bold: true }),
                                new TextRun({ text: field.themes.join(", ") })
                            ],
                            spacing: { after: 120 }
                        }),
                        new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            children: [
                                new TextRun({ text: "Metodologia: ", bold: true }),
                                ...field.methodology.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                        const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                        return new TextRun({ text: content, bold: true });
                                    }
                                    return new TextRun({ text: part });
                                })
                            ],
                            spacing: { after: 200 }
                        }),
                    ]),
                    new Paragraph({
                        children: [new TextRun({ text: "DIREITOS DE APRENDIZAGEM", bold: true, size: 24 })],
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [new TextRun({ text: plan.infantilContent.learningRights.join(", ") })],
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "RECURSOS MATERIAIS", bold: true, size: 24 })],
                        spacing: { before: 200, after: 200 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [new TextRun({ text: plan.infantilContent.materials.join(", ") })],
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "AVALIAÇÃO", bold: true, size: 24 })],
                        spacing: { before: 200, after: 200 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: plan.infantilContent.evaluation.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                            if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                return new TextRun({ text: content, bold: true });
                            }
                            return new TextRun({ text: part });
                        }),
                        spacing: { after: 200 }
                    }),
                ] : (plan.bimesters || []).flatMap(bim => [
                    new Paragraph({
                        children: [new TextRun({ text: bim.name.toUpperCase(), bold: true, size: 28, color: "7C3AED" })],
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: "Temas: ", bold: true }),
                            ...bim.themes.join(", ").split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: "Habilidades: ", bold: true }),
                            new TextRun({ text: bim.bnccSkills.join(", ") })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: "Avaliação: ", bold: true }),
                            ...bim.evaluation.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ]
                    }),
                ]))
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

// --- Didactic Sequence Exports ---

export const exportSequenceToPDF = (sequence: DidacticSequence, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;

    const [r, g, b] = sequence.headerColor ? hexToRgb(sequence.headerColor) : [124, 58, 237];

    if (!doc) {
        internalDoc.setFillColor(r, g, b);
        internalDoc.rect(0, 0, pageWidth, 15, 'F');
        internalDoc.setTextColor(255, 255, 255);
        internalDoc.setFontSize(10);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.text('PLANEJAEDU - SEQUÊNCIA DIDÁTICA', margin, 10);
        internalDoc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
        internalDoc.setTextColor(0);
    }

    const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - 20) {
            internalDoc.addPage();
            y = 20;
        }
    };

    internalDoc.setFontSize(18);
    internalDoc.setFont('helvetica', 'bold');
    internalDoc.text(`Sequência Didática: ${sequence.theme}`, margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setFont('helvetica', 'normal');
    internalDoc.text(`Duração: ${sequence.numClasses} aulas`, margin, y);
    y += 12;

    sequence.classes.forEach(c => {
        checkPageBreak(25);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.setFontSize(12);
        internalDoc.setTextColor(r, g, b);
        internalDoc.text(`AULA ${c.classNumber}: ${c.topic}`, margin, y);
        y += 7;
        internalDoc.setTextColor(30);
        internalDoc.setFontSize(11);
        internalDoc.setFont('helvetica', 'normal');

        const addItems = (label: string, items: string[]) => {
            if (items.length === 0) return;
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.text(label, margin + 5, y);
            y += 5;
            items.forEach(i => {
                const lines = splitTextWithBold(internalDoc, `- ${i}`, contentWidth - 10);
                lines.forEach((line: string) => {
                    checkPageBreak(6);
                    const isEndOfParagraph = line.endsWith('\n');
                    const cleanLine = line.replace('\n', '');
                    y = renderJustifiedBoldText(internalDoc, cleanLine, margin + 10, y, contentWidth - 10, 11, isEndOfParagraph);
                    y += 2;
                });
            });
            y += 2;
        };

        addItems("Atividades:", c.activities);
        addItems("Recursos:", c.resources);
        y += 6;
    });

    if (!doc) internalDoc.save(`Sequencia_${sequence.theme.replace(/ /g, '_')}.pdf`);
    return y;
};

export const exportSequencesToWord = async (sequences: DidacticSequence[], filename = "Sequencias_Didaticas.docx") => {
    const doc = new Document({
        sections: sequences.map(seq => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: `Sequência Didática: ${seq.theme}`, bold: true, size: 32 }),
                        new TextRun({ text: `\nDuração: ${seq.numClasses} aulas`, size: 24, break: 1 }),
                    ],
                }),
                ...seq.classes.flatMap(c => [
                    new Paragraph({
                        children: [new TextRun({ text: `AULA ${c.classNumber}: ${c.topic}`, bold: true, size: 26, color: "7C3AED" })],
                        spacing: { before: 300, after: 150 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: "Atividades: ", bold: true }),
                            ...c.activities.join(", ").split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: "Recursos: ", bold: true }),
                            ...c.resources.join(", ").split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ]
                    }),
                ]),
                new Paragraph({
                    children: [new TextRun({ text: "\nAvaliação Final Sugerida:", bold: true, size: 24 })],
                    spacing: { before: 400 }
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: seq.finalEvaluation.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                            const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                            return new TextRun({ text: content, bold: true });
                        }
                        return new TextRun({ text: part });
                    })
                })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

// --- Assessment Exports ---

export const exportAssessmentToPDF = (assessment: Assessment, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;

    const [r, g, b] = assessment.headerColor ? hexToRgb(assessment.headerColor) : [124, 58, 237];

    if (!doc) {
        internalDoc.setFillColor(r, g, b);
        internalDoc.rect(0, 0, pageWidth, 15, 'F');
        internalDoc.setTextColor(255, 255, 255);
        internalDoc.setFontSize(10);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.text('PLANEJAEDU - AVALIAÇÃO', margin, 10);
        internalDoc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
        internalDoc.setTextColor(0);
    }

    const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - 20) {
            internalDoc.addPage();
            y = 20;
        }
    };

    internalDoc.setFontSize(18);
    internalDoc.setFont('helvetica', 'bold');
    internalDoc.text(assessment.title, margin, y);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setFont('helvetica', 'normal');
    internalDoc.text(`${assessment.type} • ${assessment.discipline} • ${assessment.grade}`, margin, y);
    y += 12;

    if (assessment.questions) {
        assessment.questions.forEach((q, index) => {
            const questionHeader = `${index + 1}. ${q.text}`;
            internalDoc.setFont('helvetica', 'bold');
            const questionLines = splitTextWithBold(internalDoc, questionHeader, contentWidth);
            questionLines.forEach((line: string) => {
                checkPageBreak(6);
                const isEndOfParagraph = line.endsWith('\n');
                const cleanLine = line.replace('\n', '');
                y = renderJustifiedBoldText(internalDoc, cleanLine, margin, y, contentWidth, 11, isEndOfParagraph);
                y += 2;
            });
            internalDoc.setFont('helvetica', 'normal');

            if (q.type === 'multiple_choice' && q.options) {
                q.options.forEach(opt => {
                    const optLines = internalDoc.splitTextToSize(`(  ) ${opt}`, contentWidth - 10);
                    checkPageBreak(optLines.length * 6);
                    internalDoc.text(optLines, margin + 5, y);
                    y += optLines.length * 6;
                });
                y += 4;
            } else if (q.type === 'essay') {
                checkPageBreak(22);
                internalDoc.rect(margin, y, contentWidth, 20);
                y += 24;
            }
        });
    }

    if (assessment.rubric) {
        checkPageBreak(15);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.setFontSize(14);
        internalDoc.setTextColor(r, g, b);
        internalDoc.text("RUBRICA DE AVALIAÇÃO", margin, y);
        y += 8;
        internalDoc.setTextColor(0);
        internalDoc.setFontSize(11);

        assessment.rubric.forEach(criteria => {
            checkPageBreak(15);
            internalDoc.setFont('helvetica', 'bold');
            internalDoc.text(criteria.criteria, margin, y);
            y += 6;
            internalDoc.setFont('helvetica', 'normal');

            criteria.levels.forEach(l => {
                const text = `${l.level}: ${l.description}`;
                const lines = internalDoc.splitTextToSize(text, contentWidth - 10);
                checkPageBreak(lines.length * 6);
                internalDoc.text(lines, margin + 5, y);
                y += lines.length * 6;
            });
            y += 4;
        });
    }

    if (!doc) internalDoc.save(`${assessment.title.replace(/ /g, '_')}.pdf`);
    return y;
};

export const exportAssessmentsToWord = async (assessments: Assessment[], filename = "Avaliacoes.docx") => {
    const doc = new Document({
        sections: assessments.map(assessment => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: assessment.title, bold: true, size: 32 }),
                        new TextRun({ text: `\n${assessment.type} • ${assessment.discipline} • ${assessment.grade}`, size: 24, break: 1 }),
                    ],
                }),
                ...(assessment.questions ? assessment.questions.flatMap((q, i) => [
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: `${i + 1}. `, bold: true, size: 22 }),
                            ...q.text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true, size: 22 });
                                }
                                return new TextRun({ text: part, size: 22 });
                            })
                        ],
                        spacing: { before: 300, after: 150 }
                    }),
                    ...(q.type === 'multiple_choice' && q.options ? q.options.map(opt => new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: `(  ) ` }),
                            ...opt.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ],
                        spacing: { after: 100 },
                        indent: { left: 720 }
                    })) : [new Paragraph({ text: "__________________________________________________________________________", spacing: { after: 400 } })])
                ]) : []),
                ...(assessment.rubric ? assessment.rubric.flatMap(c => [
                    new Paragraph({
                        children: [new TextRun({ text: c.criteria, bold: true, size: 24, color: "7C3AED" })],
                        spacing: { before: 400, after: 200 }
                    }),
                    ...c.levels.map(l => new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({ text: `${l.level}: `, bold: true }),
                            ...l.description.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                    const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                    return new TextRun({ text: content, bold: true });
                                }
                                return new TextRun({ text: part });
                            })
                        ],
                        bullet: { level: 0 },
                        spacing: { after: 100 }
                    }))
                ]) : [])
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

// --- Report Exports ---

export const exportReportToPDF = (report: AppReport, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;

    if (!doc) {
        internalDoc.setFillColor(r, g, b);
        internalDoc.rect(0, 0, pageWidth, 15, 'F');
        internalDoc.setTextColor(255, 255, 255);
        internalDoc.setFontSize(10);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.text('PLANEJAEDU - RELATÓRIO INDIVIDUAL', margin, 10);
        internalDoc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
        internalDoc.setTextColor(0);
    }

    const checkPageBreak = (height: number) => {
        if (y + height > pageHeight - 20) {
            internalDoc.addPage();
            y = 20;
        }
    };

    internalDoc.setFontSize(18);
    internalDoc.setFont('helvetica', 'bold');
    internalDoc.setTextColor(r, g, b);
    internalDoc.text(`Relatório: ${report.studentName}`, margin, y);
    internalDoc.setTextColor(0);
    y += 8;
    internalDoc.setFontSize(11);
    internalDoc.setFont('helvetica', 'normal');
    internalDoc.text(`${report.grade} • ${report.period}`, margin, y);
    y += 15;

    const lines = splitTextWithBold(internalDoc, report.content, contentWidth);
    lines.forEach((line: string) => {
        checkPageBreak(6);
        const isEndOfParagraph = line.endsWith('\n');
        const cleanLine = line.replace('\n', '');
        y = renderJustifiedBoldText(internalDoc, cleanLine, margin, y, contentWidth, 11, isEndOfParagraph);
        y += 2;
    });

    if (!doc) internalDoc.save(`Relatorio_${report.studentName.replace(/ /g, '_')}.pdf`);
    return y;
};

export const exportReportsToWord = async (reports: AppReport[], filename = "Relatorios_Individuais.docx") => {
    const doc = new Document({
        sections: reports.map(report => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: `Relatório Individual: ${report.studentName}`, bold: true, size: 32 }),
                        new TextRun({ text: `\n${report.grade} • ${report.period}`, size: 24, break: 1 }),
                    ],
                    spacing: { after: 400 }
                }),
                ...report.content.split('\n').map(line => new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map(part => {
                        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                            const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                            return new TextRun({ text: content, bold: true, size: 22 });
                        }
                        return new TextRun({ text: part, size: 22 });
                    }),
                    spacing: { after: 200 }
                }))
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
