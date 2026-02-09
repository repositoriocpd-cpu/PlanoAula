import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { LessonPlan } from '../types/lesson';
import type { AnnualPlan } from '../types/annualPlan';
import type { DidacticSequence } from '../types/sequence';

const cleanText = (text: string) => text.replace(/\*\*/g, '');

export const exportLessonToPDF = (plan: LessonPlan, doc?: jsPDF, startY = 30) => {
    const internalDoc = doc || new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = startY;

    const addHeader = (title: string) => {
        internalDoc.setFillColor(124, 58, 237); // Purple
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
        internalDoc.setTextColor(124, 58, 237);
        internalDoc.text(title.toUpperCase(), margin, y);
        y += 7;
        internalDoc.setTextColor(30);
        internalDoc.setFont('helvetica', 'normal');
        internalDoc.setFontSize(11);

        const items = Array.isArray(rawText) ? rawText : [rawText];
        items.forEach(item => {
            const lines = internalDoc.splitTextToSize(Array.isArray(rawText) ? `• ${cleanText(item)}` : cleanText(item), contentWidth);
            lines.forEach((line: string) => {
                checkPageBreak(6);
                internalDoc.text(line, margin, y);
                y += 6;
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
                            children: [new TextRun({ text: Array.isArray(s.c) ? `• ${i}` : i, size: 22 })],
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

    if (!doc) {
        internalDoc.setFillColor(124, 58, 237); // Purple
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

    plan.bimesters.forEach((bim) => {
        checkPageBreak(30);
        internalDoc.setFont('helvetica', 'bold');
        internalDoc.setFontSize(13);
        internalDoc.setTextColor(124, 58, 237);
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
            internalDoc.setFont('helvetica', 'normal');
            items.forEach(i => {
                const lines = internalDoc.splitTextToSize(`• ${i}`, contentWidth - 10);
                lines.forEach((line: string) => {
                    checkPageBreak(6);
                    internalDoc.text(line, margin + 10, y);
                    y += 6;
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
        internalDoc.setFont('helvetica', 'normal');
        const evalLines = internalDoc.splitTextToSize(bim.evaluation, contentWidth - 10);
        evalLines.forEach((line: string) => {
            checkPageBreak(6);
            internalDoc.text(line, margin + 10, y);
            y += 6;
        });
        y += 10;
    });

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
                ...plan.bimesters.flatMap(bim => [
                    new Paragraph({
                        children: [new TextRun({ text: bim.name.toUpperCase(), bold: true, size: 28, color: "7C3AED" })],
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({ children: [new TextRun({ text: "Temas: ", bold: true }), new TextRun({ text: bim.themes.join(", ") })] }),
                    new Paragraph({ children: [new TextRun({ text: "Habilidades: ", bold: true }), new TextRun({ text: bim.bnccSkills.join(", ") })] }),
                    new Paragraph({ children: [new TextRun({ text: "Avaliação: ", bold: true }), new TextRun({ text: bim.evaluation })] }),
                ])
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

    if (!doc) {
        internalDoc.setFillColor(124, 58, 237); // Purple
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
        internalDoc.setTextColor(124, 58, 237);
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
            internalDoc.setFont('helvetica', 'normal');
            items.forEach(i => {
                const lines = internalDoc.splitTextToSize(`- ${i}`, contentWidth - 10);
                lines.forEach((line: string) => {
                    checkPageBreak(6);
                    internalDoc.text(line, margin + 10, y);
                    y += 5;
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
                    new Paragraph({ children: [new TextRun({ text: "Atividades: ", bold: true }), new TextRun({ text: c.activities.join(", ") })] }),
                    new Paragraph({ children: [new TextRun({ text: "Recursos: ", bold: true }), new TextRun({ text: c.resources.join(", ") })] }),
                ]),
                new Paragraph({
                    children: [new TextRun({ text: "\nAvaliação Final Sugerida:", bold: true, size: 24 })],
                    spacing: { before: 400 }
                }),
                new Paragraph({ text: seq.finalEvaluation })
            ]
        }))
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
