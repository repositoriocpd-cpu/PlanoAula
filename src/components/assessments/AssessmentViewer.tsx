import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import type { Assessment } from '../../types/assessment';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface AssessmentViewerProps {
    assessment: Assessment;
    onBack: () => void;
}

export function AssessmentViewer({ assessment, onBack }: AssessmentViewerProps) {

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(assessment.title, 20, 20);
        doc.setFontSize(12);
        doc.text(`Disciplina: ${assessment.discipline} - ${assessment.grade}`, 20, 30);

        let y = 40;

        if (assessment.questions) {
            assessment.questions.forEach((q, index) => {
                if (y > 250) { doc.addPage(); y = 20; }
                const lines = doc.splitTextToSize(`${index + 1}. ${q.text}`, 170);
                doc.text(lines, 20, y);
                y += lines.length * 6 + 4;

                if (q.type === 'multiple_choice' && q.options) {
                    q.options.forEach(opt => {
                        if (y > 270) { doc.addPage(); y = 20; }
                        doc.text(opt, 25, y);
                        y += 6;
                    });
                    y += 4;
                } else if (q.type === 'essay') {
                    y += 20; // Space for answer
                }
            });
        }

        if (assessment.rubric) {
            assessment.rubric.forEach(criteria => {
                if (y > 250) { doc.addPage(); y = 20; }
                doc.setFont('helvetica', 'bold');
                doc.text(criteria.criteria, 20, y);
                y += 6;
                doc.setFont('helvetica', 'normal');

                criteria.levels.forEach(l => {
                    const text = `${l.level}: ${l.description}`;
                    const lines = doc.splitTextToSize(text, 160);
                    doc.text(lines, 25, y);
                    y += lines.length * 6;
                });
                y += 6;
            });
        }

        doc.save(`${assessment.title}.pdf`);
    };

    const handleDownloadWord = () => {
        // Basic word export structure
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ children: [new TextRun({ text: assessment.title, bold: true, size: 32 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Disciplina: ${assessment.discipline} - ${assessment.grade}`, size: 24 })] }),
                    new Paragraph({ text: "" }), // Spacing
                    ...(assessment.questions ? assessment.questions.flatMap((q, i) => [
                        new Paragraph({ children: [new TextRun({ text: `${i + 1}. ${q.text}`, bold: true })] }),
                        ...(q.options ? q.options.map(opt => new Paragraph({ text: opt, indent: { left: 720 } })) : [new Paragraph({ text: "\n\n" })])
                    ]) : []),
                    ...(assessment.rubric ? assessment.rubric.flatMap(c => [
                        new Paragraph({ children: [new TextRun({ text: c.criteria, bold: true, size: 28 })] }),
                        ...c.levels.map(l => new Paragraph({ text: `${l.level}: ${l.description}`, bullet: { level: 0 } }))
                    ]) : [])
                ]
            }]
        });
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${assessment.title}.docx`);
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
                    <button onClick={handleDownloadWord} className="p-2 text-gray-600 hover:text-primary" title="Baixar Word">
                        <Download className="h-5 w-5 text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl font-bold text-primary mb-2">{assessment.title}</h1>
                <p className="text-gray-600 mb-6">{assessment.type} • {assessment.discipline}</p>

                <div className="space-y-8">
                    {assessment.questions && assessment.questions.map((q, index) => (
                        <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-3">{index + 1}. {q.text}</h3>
                            {q.type === 'multiple_choice' && (
                                <ul className="space-y-2">
                                    {q.options?.map((opt, i) => (
                                        <li key={i} className="flex items-center text-gray-700">
                                            <div className="h-4 w-4 rounded-full border border-gray-400 mr-2"></div>
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {q.type === 'essay' && (
                                <div className="h-24 border border-gray-300 rounded-md bg-white mt-2"></div>
                            )}
                        </div>
                    ))}

                    {assessment.rubric && assessment.rubric.map((c, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">{c.criteria}</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {c.levels.map((l, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-baseline">
                                        <span className="font-semibold text-primary min-w-[100px]">{l.level}:</span>
                                        <span className="text-gray-600 text-sm">{l.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
