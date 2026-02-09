import { FileText, FileEdit, ArrowLeft, Palette, Trash2 } from 'lucide-react';
import type { Report } from '../../types/report';
import { exportReportToPDF, exportReportsToWord } from '../../services/exportService';
import { FormattedText } from '../ui/FormattedText';
import { useReportStore } from '../../store/useReportStore';

interface ReportViewerProps {
    report: Report;
    onBack: () => void;
    onDelete?: (id: string) => void;
}

export function ReportViewer({ report, onBack, onDelete }: ReportViewerProps) {
    const { updateHeaderColor } = useReportStore();
    const activeColor = report.headerColor || '#3B82F6';

    const colors = [
        { name: 'Azul', value: '#3B82F6' },
        { name: 'Roxo', value: '#7C3AED' },
        { name: 'Verde', value: '#10B981' },
        { name: 'Rosa', value: '#EC4899' },
        { name: 'Laranja', value: '#F59E0B' },
        { name: 'Cinza', value: '#6B7280' },
    ];

    const handleDownloadPDF = () => {
        exportReportToPDF(report);
    };

    const handleDownloadWord = () => {
        exportReportsToWord([report], `Relatorio_${report.studentName.replace(/ /g, '_')}.docx`);
    };

    const handleColorChange = (color: string) => {
        updateHeaderColor(report.id, color);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-gray-900 font-bold text-sm bg-gray-100/50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </button>

                <div className="flex items-center gap-4">
                    {/* Color Picker with Label */}
                    <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-2 rounded-2xl border border-gray-200/50 shadow-sm transition-all hover:bg-white">
                        <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                            <Palette className="h-4 w-4 text-gray-500" />
                            <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Cores do cabeçalho:</span>
                        </div>
                        <div className="flex gap-1.5">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => handleColorChange(c.value)}
                                    className={`w-6 h-6 rounded-lg transition-all border-2 ${activeColor === c.value ? 'border-white ring-2 ring-gray-200 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner border border-gray-200/50">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center space-x-2 px-4 py-2.5 text-rose-600 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-300 group"
                            title="Baixar PDF"
                        >
                            <div className="p-1 px-1.5 bg-rose-50 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-black tracking-tight">PDF</span>
                        </button>
                        <button
                            onClick={handleDownloadWord}
                            className="flex items-center space-x-2 px-4 py-2.5 text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-300 group"
                            title="Baixar Word"
                        >
                            <div className="p-1 px-1.5 bg-blue-50 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                                <FileEdit className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-black tracking-tight">Word</span>
                        </button>
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(report.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Excluir"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Relatório Individual</h1>
                        <h2 className="text-lg font-semibold mt-1" style={{ color: activeColor }}>{report.studentName}</h2>
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
        </div>
    );
}
