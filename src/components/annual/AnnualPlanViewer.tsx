import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import type { AnnualPlan } from '../../types/annualPlan';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface AnnualPlanViewerProps {
    plan: AnnualPlan;
    onBack: () => void;
}

export function AnnualPlanViewer({ plan, onBack }: AnnualPlanViewerProps) {

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Planejamento Anual - ${plan.discipline}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Série: ${plan.grade}`, 20, 30);

        let y = 40;

        plan.bimesters.forEach((bimester) => {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'bold');
            doc.text(bimester.name, 20, y);
            y += 8;
            doc.setFont('helvetica', 'normal');

            const addList = (title: string, items: string[]) => {
                doc.setFont('helvetica', 'italic');
                doc.text(title, 25, y);
                doc.setFont('helvetica', 'normal');
                y += 6;
                items.forEach(item => {
                    const lines = doc.splitTextToSize(`• ${item}`, 160);
                    doc.text(lines, 30, y);
                    y += lines.length * 6;
                });
                y += 4;
            };

            addList("Temas:", bimester.themes);
            addList("Habilidades BNCC:", bimester.bnccSkills);
            y += 4;
        });

        doc.save(`Planejamento_Anual_${plan.discipline}.pdf`);
    };

    const handleDownloadWord = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Planejamento Anual", bold: true, size: 32 }),
                            new TextRun({ text: `\nDisciplina: ${plan.discipline}`, size: 24, break: 1 }),
                            new TextRun({ text: `\nSérie: ${plan.grade}`, size: 24, break: 1 }),
                        ],
                    }),
                    ...plan.bimesters.flatMap(bimester => [
                        new Paragraph({
                            children: [new TextRun({ text: `\n${bimester.name}`, bold: true, size: 28, break: 1 })],
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: "Temas: " + bimester.themes.join(", "), italics: true })],
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: "Habilidades: " + bimester.bnccSkills.join(", ") })],
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: "Avaliação: " + bimester.evaluation })],
                        }),
                    ])
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Planejamento_Anual_${plan.discipline}.docx`);
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
                <h1 className="text-2xl font-bold text-primary mb-2">Planejamento Anual</h1>
                <div className="flex space-x-4 text-sm text-gray-500 mb-8">
                    <span className="font-semibold text-gray-700">{plan.discipline}</span>
                    <span>•</span>
                    <span>{plan.grade}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.bimesters.map((bimester, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white transition-colors">
                            <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">{bimester.name}</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Temas</h4>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                                        {bimester.themes.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Objetivos</h4>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                                        {bimester.objectives.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Habilidades BNCC</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {bimester.bnccSkills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-mono">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Avaliação</h4>
                                    <p className="text-sm text-gray-600 mt-1">{bimester.evaluation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
