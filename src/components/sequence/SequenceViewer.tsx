import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { Download, ArrowLeft } from 'lucide-react';
import type { DidacticSequence } from '../../types/sequence';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface SequenceViewerProps {
    sequence: DidacticSequence;
    onBack: () => void;
}

export function SequenceViewer({ sequence, onBack }: SequenceViewerProps) {

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Sequência Didática: ${sequence.theme}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Duração: ${sequence.numClasses} aulas`, 20, 30);

        let y = 40;

        // Objectives
        doc.setFont('helvetica', 'bold');
        doc.text('Objetivos:', 20, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        sequence.objectives.forEach(obj => {
            const lines = doc.splitTextToSize(`• ${obj}`, 170);
            doc.text(lines, 25, y);
            y += lines.length * 6;
        });

        if (y > 270) { doc.addPage(); y = 20; }
        y += 4;

        // Classes
        sequence.classes.forEach(c => {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'bold');
            doc.text(`Aula ${c.classNumber}: ${c.topic}`, 20, y);
            y += 6;
            doc.setFont('helvetica', 'normal');

            const addItems = (label: string, items: string[]) => {
                doc.setFont('helvetica', 'italic');
                doc.text(label, 25, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
                items.forEach(i => {
                    const lines = doc.splitTextToSize(`- ${i}`, 160);
                    doc.text(lines, 30, y);
                    y += lines.length * 5;
                });
                y += 2;
            };

            addItems("Atividades:", c.activities);
            addItems("Recursos:", c.resources);
            y += 6;
        });

        doc.save(`Sequencia_${sequence.theme}.pdf`);
    };

    const handleDownloadWord = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Sequência Didática", bold: true, size: 32 }),
                            new TextRun({ text: `\nTema: ${sequence.theme}`, size: 24, break: 1 }),
                        ],
                    }),
                    ...sequence.classes.flatMap(c => [
                        new Paragraph({
                            children: [new TextRun({ text: `\nAula ${c.classNumber}: ${c.topic}`, bold: true, size: 28, break: 1 })],
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: "Atividades: " + c.activities.join(", "), italics: true })],
                        }),
                    ])
                ],
            }],
        });
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Sequencia_${sequence.theme}.docx`);
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
                <h1 className="text-2xl font-bold text-primary mb-2">{sequence.theme}</h1>
                <p className="text-gray-600 mb-6">{sequence.numClasses} Aulas Previstas</p>

                <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Objetivos</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {sequence.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>

                <div className="space-y-6">
                    {sequence.classes.map((c) => (
                        <div key={c.classNumber} className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                                    AULA {c.classNumber}
                                </span>
                                <h4 className="font-bold text-gray-800">{c.topic}</h4>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Atividades</h5>
                                    <ul className="list-disc pl-4 text-sm text-gray-700 mt-1">
                                        {c.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recursos</h5>
                                    <ul className="list-disc pl-4 text-sm text-gray-700 mt-1">
                                        {c.resources.map((res, i) => <li key={i}>{res}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Avaliação Final Sugerida</h3>
                    <FormattedText text={sequence.finalEvaluation} className="text-gray-700" />
                </div>
            </div>
        </div>
    );
}
