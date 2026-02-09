import { FileText, FileEdit, ArrowLeft, Palette, Trash2 } from 'lucide-react';
import type { Assessment } from '../../types/assessment';
import { exportAssessmentToPDF, exportAssessmentsToWord } from '../../services/exportService';
import { useAssessmentStore } from '../../store/useAssessmentStore';

interface AssessmentViewerProps {
    assessment: Assessment;
    onBack: () => void;
    onDelete?: (id: string) => void;
}

export function AssessmentViewer({ assessment, onBack, onDelete }: AssessmentViewerProps) {
    const { updateHeaderColor } = useAssessmentStore();
    const activeColor = assessment.headerColor || '#3B82F6';

    const colors = [
        { name: 'Azul', value: '#3B82F6' },
        { name: 'Roxo', value: '#7C3AED' },
        { name: 'Verde', value: '#10B981' },
        { name: 'Rosa', value: '#EC4899' },
        { name: 'Laranja', value: '#F59E0B' },
        { name: 'Cinza', value: '#6B7280' },
    ];

    const handleDownloadPDF = () => {
        exportAssessmentToPDF(assessment);
    };

    const handleDownloadWord = () => {
        exportAssessmentsToWord([assessment], `${assessment.title.replace(/ /g, '_')}.docx`);
    };

    const handleColorChange = (color: string) => {
        updateHeaderColor(assessment.id, color);
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
                            onClick={() => onDelete(assessment.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Excluir"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <h1 className="text-2xl font-bold mb-2" style={{ color: activeColor }}>{assessment.title}</h1>
                    <p className="text-gray-600 mb-6">{assessment.type} • {assessment.discipline}</p>

                    <div className="space-y-8">
                        {assessment.questions && assessment.questions.map((q, index) => (
                            <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-justify">
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
                                            <span className="font-semibold min-w-[100px]" style={{ color: activeColor }}>{l.level}:</span>
                                            <span className="text-gray-600 text-sm text-justify">{l.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
