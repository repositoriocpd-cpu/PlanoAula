import { FormattedText } from '../ui/FormattedText';
import { FileText, FileEdit, Trash2, ArrowLeft, Palette } from 'lucide-react';
import type { LessonPlan } from '../../types/lesson';
import { exportLessonToPDF, exportLessonsToWord } from '../../services/exportService';
import { useLessonStore } from '../../store/useLessonStore';

interface LessonViewerProps {
    plan: LessonPlan;
    onBack: () => void;
    onDelete?: () => void;
}

export function LessonViewer({ plan, onBack, onDelete }: LessonViewerProps) {
    const { updateHeaderColor } = useLessonStore();
    const content = plan.content;
    const activeColor = plan.headerColor || '#3B82F6'; // Default blue for lessons

    const colors = [
        { name: 'Azul', value: '#3B82F6' },
        { name: 'Roxo', value: '#7C3AED' },
        { name: 'Verde', value: '#10B981' },
        { name: 'Rosa', value: '#EC4899' },
        { name: 'Laranja', value: '#F59E0B' },
        { name: 'Cinza', value: '#6B7280' },
    ];

    if (!content) return null;

    const handleDownloadPDF = () => {
        exportLessonToPDF(plan);
    };

    const handleDownloadWord = () => {
        exportLessonsToWord([plan], `${plan.title.replace(/[/\\?%*:|"<>]/g, '-')}.docx`);
    };

    const handleColorChange = (color: string) => {
        updateHeaderColor(plan.id, color);
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
                            onClick={onDelete}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Excluir"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl font-bold mb-2" style={{ color: activeColor }}>{plan.title}</h1>
                <div className="flex space-x-4 text-sm text-gray-500 mb-6">
                    <span>{plan.discipline}</span>
                    <span>•</span>
                    <span>{plan.grade}</span>
                    <span>•</span>
                    <span>{plan.duration}</span>
                </div>

                <Section title="1. Fundamentação" content={content.foundation} activeColor={activeColor} />
                <Section title="2. Objetivo Geral" content={content.generalObjective} activeColor={activeColor} />
                <Section title="3. Objetivos Específicos" content={content.specificObjectives} activeColor={activeColor} />
                <Section title="4. Conteúdo" content={content.content} activeColor={activeColor} />
                <Section title="5. Metodologia" content={content.methodology} activeColor={activeColor} />
                <Section title="6. Recursos Didáticos" content={content.resources} activeColor={activeColor} />
                <Section title="7. Avaliação" content={content.evaluation} activeColor={activeColor} />
                <Section title="8. Habilidades BNCC" content={content.bnccSkills} activeColor={activeColor} />
                <Section title="9. Adaptações" content={content.adaptations} activeColor={activeColor} />
                <Section title="10. Atividades de Casa" content={content.homework} activeColor={activeColor} />
            </div>
        </div>
    );
}

function Section({ title, content, activeColor }: { title: string, content: string | string[], activeColor: string }) {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: activeColor }}>{title}</h3>
            <FormattedText text={content} className="text-gray-700" />
        </div>
    );
}
