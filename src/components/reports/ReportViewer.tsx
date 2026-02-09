import { FormattedText } from '../ui/FormattedText';
import { Download, ArrowLeft } from 'lucide-react';
import type { Report } from '../../types/report';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface ReportViewerProps {
    report: Report;
    onBack: () => void;
}

export function ReportViewer({ report, onBack }: ReportViewerProps) {

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
            doc.setFillColor(124, 58, 237);
            doc.rect(0, 0, pageWidth, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('PLANO PRONTO', margin, 10);
            const date = new Date().toLocaleDateString();
            doc.setFont('helvetica', 'normal');
            doc.text(date, pageWidth - margin, 10, { align: 'right' });

            doc.setTextColor(150);
            doc.setFontSize(8);
            doc.text(`Página ${pageNo}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.setTextColor(0);
        };

        addHeader(1);

        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("Relatório Individual de Desenvolvimento", margin, 30);

        // Subinfo
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Aluno(a): ${cleanText(report.studentName)}`, margin, 40);
        doc.text(`Série: ${report.grade} | Período: ${report.period}`, margin, 46);

        doc.setLineWidth(0.5);
        doc.line(margin, 50, pageWidth - margin, 50);

        // Content
        let y = 60;
        const cleanBody = cleanText(report.content);
        const lines = doc.splitTextToSize(cleanBody, contentWidth);

        doc.setFontSize(11);

        // Pagination logic for long reports
        // Pagination and Printing


        // Improved Approach: text with maxwidth and justify handles lines, but not page breaks cleanly in middle of block
        // Manual Justify is hard.
        // Let's rely on standard text print which wraps.
        // If report is huge, one text() call might overflow page without adding new page?
        // jsPDF DOES NOT auto-page on text().
        // We must loop.

        lines.forEach((line: string) => {
            if (y > pageHeight - 20) {
                doc.addPage();
                addHeader(doc.getNumberOfPages());
                y = 30;
            }
            const lineWidth = doc.getTextWidth(line);
            if (lineWidth > contentWidth * 0.90) {
                doc.text(line, margin, y, { align: 'justify', maxWidth: contentWidth });
            } else {
                doc.text(line, margin, y);
            }
            y += 6;
        });

        doc.save(`Relatorio_${cleanText(report.studentName)}.pdf`);
    };

    const handleDownloadWord = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Relatório Individual de Desenvolvimento", bold: true, size: 28 }),
                        ],
                        alignment: "center",
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Aluno(a): ${report.studentName}`, bold: true }),
                            new TextRun({ text: `\nSérie: ${report.grade}`, break: 1 }),
                            new TextRun({ text: `\nPeríodo: ${report.period}`, break: 1 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [new TextRun({ text: report.content })],
                        alignment: "both" // Justified
                    })
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Relatorio_${report.studentName}.docx`);
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
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Relatório Individual</h1>
                    <h2 className="text-lg text-primary font-semibold mt-1">{report.studentName}</h2>
                    <p className="text-gray-500">{report.grade} • {report.period}</p>
                </div>

                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-justify">
                    <FormattedText text={report.content} />
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                    <div className="text-center w-1/3">
                        <div className="border-b border-black h-8 mb-2"></div>
                        <p className="text-xs text-gray-500">Assinatura do Professor(a)</p>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="border-b border-black h-8 mb-2"></div>
                        <p className="text-xs text-gray-500">Coordenação Pedagógica</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
