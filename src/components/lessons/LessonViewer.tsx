import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { Download, Trash2, ArrowLeft } from 'lucide-react';
import type { LessonPlan } from '../../types/lesson';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface LessonViewerProps {
    plan: LessonPlan;
    onBack: () => void;
    onDelete?: () => void;
}

export function LessonViewer({ plan, onBack, onDelete }: LessonViewerProps) {
    const content = plan.content;

    if (!content) return null;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Helper: Clean Markdown
        const cleanText = (text: string) => text.replace(/\*\*/g, '');

        // Header Function
        const addHeader = (pageNo: number) => {
            doc.setFillColor(124, 58, 237); // Primary Purple
            doc.rect(0, 0, pageWidth, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('PLANO PRONTO', margin, 10);
            const date = new Date().toLocaleDateString();
            doc.setFont('helvetica', 'normal');
            doc.text(date, pageWidth - margin, 10, { align: 'right' });

            // Footer (Page Number)
            doc.setTextColor(150);
            doc.setFontSize(8);
            doc.text(`Página ${pageNo}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.setTextColor(0); // Reset
        };

        let y = 30; // Start below header
        let page = 1;

        addHeader(page);

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55); // Dark Gray
        const titleLines = doc.splitTextToSize(cleanText(plan.title), contentWidth);
        doc.text(titleLines, margin, y);
        y += (titleLines.length * 8) + 5;

        // Meta Info Box
        doc.setFillColor(243, 244, 246); // Light Gray
        doc.rect(margin, y, contentWidth, 25, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55);

        doc.text(`Disciplina: ${plan.discipline}`, margin + 5, y + 8);
        doc.text(`Série: ${plan.grade}`, margin + 5, y + 16);
        doc.text(`Duração: ${plan.duration}`, pageWidth / 2, y + 8);
        doc.text(`Tema: ${cleanText(plan.theme)}`, margin + 5, y + 24); // Removed Date override

        y += 35;

        const checkPageBreak = (heightNeeded: number) => {
            if (y + heightNeeded > pageHeight - 20) {
                doc.addPage();
                page++;
                addHeader(page);
                y = 30;
            }
        };

        const addSection = (title: string, rawText: string | string[]) => {
            if (!rawText || (Array.isArray(rawText) && rawText.length === 0)) return;

            checkPageBreak(20);

            // Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(124, 58, 237); // Primary Color
            doc.text(title.toUpperCase(), margin, y);
            y += 6;

            // Content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(30);

            if (Array.isArray(rawText)) {
                rawText.forEach(item => {
                    const cleanItem = cleanText(item);
                    const lines = doc.splitTextToSize(`• ${cleanItem}`, contentWidth);
                    checkPageBreak(lines.length * 6);
                    doc.text(lines, margin, y);
                    y += (lines.length * 6) + 2;
                });
            } else {
                const cleanBody = cleanText(rawText);
                const lines = doc.splitTextToSize(cleanBody, contentWidth);

                lines.forEach((line: string) => {
                    checkPageBreak(6);
                    const lineWidth = doc.getTextWidth(line);
                    // Only justify if line is long enough (approx 90% of width)
                    // This prevents short lines (like titles or list items inside text) from stretching
                    if (lineWidth > contentWidth * 0.90) {
                        doc.text(line, margin, y, { align: 'justify', maxWidth: contentWidth });
                    } else {
                        doc.text(line, margin, y);
                    }
                    y += 6;
                });
                y += 6; // Space after section
            }
        };

        addSection('Fundamentação', content.foundation);
        addSection('Objetivo Geral', content.generalObjective);
        addSection('Objetivos Específicos', content.specificObjectives);
        addSection('Conteúdo', content.content);
        addSection('Metodologia', content.methodology);
        addSection('Recursos Didáticos', content.resources);
        addSection('Avaliação', content.evaluation);
        addSection('Habilidades BNCC', content.bnccSkills);
        addSection('Adaptações', content.adaptations);
        addSection('Atividades de Casa', content.homework);

        doc.save(`${cleanText(plan.title)}.pdf`);
    };

    const handleDownloadWord = () => {
        // TODO: Implement thorough Word export
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ children: [new TextRun({ text: plan.title, bold: true, size: 32 })] }),
                    new Paragraph({ text: `Disciplina: ${plan.discipline}` }),
                    new Paragraph({ text: `Série: ${plan.grade}` }),
                    // ... add sections
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${plan.title}.docx`);
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Voltar
                </button>
                <div className="flex space-x-2">
                    <button onClick={handleDownloadPDF} className="p-2 text-gray-600 hover:text-primary" title="Baixar PDF">
                        <Download className="h-5 w-5" />
                    </button>
                    {onDelete && (
                        <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600" title="Excluir">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl font-bold text-primary mb-2">{plan.title}</h1>
                <div className="flex space-x-4 text-sm text-gray-500 mb-6">
                    <span>{plan.discipline}</span>
                    <span>•</span>
                    <span>{plan.grade}</span>
                    <span>•</span>
                    <span>{plan.duration}</span>
                </div>

                <Section title="1. Fundamentação" content={content.foundation} />
                <Section title="2. Objetivo Geral" content={content.generalObjective} />
                <Section title="3. Objetivos Específicos" content={content.specificObjectives} isList />
                <Section title="4. Conteúdo" content={content.content} isList />
                <Section title="5. Metodologia" content={content.methodology} />
                <Section title="6. Recursos Didáticos" content={content.resources} isList />
                <Section title="7. Avaliação" content={content.evaluation} />
                <Section title="8. Habilidades BNCC" content={content.bnccSkills} isList />
                <Section title="9. Adaptações" content={content.adaptations} />
                <Section title="10. Atividades de Casa" content={content.homework} />
            </div>
        </div>
    );
}

function Section({ title, content, isList }: { title: string, content: string | string[], isList?: boolean }) {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <FormattedText text={content} className="text-gray-700" />
        </div>
    );
}
