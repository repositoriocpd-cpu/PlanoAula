import { FileText, FileEdit, ArrowLeft, Palette, Trash2, Presentation as PresentationIcon } from 'lucide-react';
import type { AnnualPlan } from '../../types/annualPlan';
import { exportAnnualPlanToPDF, exportAnnualPlansToWord } from '../../services/exportService';
import { useAnnualPlanStore } from '../../store/useAnnualPlanStore';

interface AnnualPlanViewerProps {
    plan: AnnualPlan;
    onBack: () => void;
    onDelete?: (id: string) => void;
    onOpenPresentation?: () => void;
}

export function AnnualPlanViewer({ plan, onBack, onDelete, onOpenPresentation }: AnnualPlanViewerProps) {
    const { updatePlanColor } = useAnnualPlanStore();
    const activeColor = plan.headerColor || '#7C3AED';

    const colors = [
        { name: 'Roxo', value: '#7C3AED' },
        { name: 'Azul', value: '#2563EB' },
        { name: 'Verde', value: '#059669' },
        { name: 'Rosa', value: '#DB2777' },
        { name: 'Laranja', value: '#EA580C' },
        { name: 'Cinza', value: '#4B5563' },
    ];

    const handleDownloadPDF = () => {
        exportAnnualPlanToPDF(plan);
    };

    const handleDownloadWord = () => {
        exportAnnualPlansToWord([plan], `Plano_Anual_${plan.discipline}.docx`);
    };

    const handleColorChange = (color: string) => {
        updatePlanColor(plan.id, color);
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

                    {onOpenPresentation && (
                        <button
                            onClick={onOpenPresentation}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-md hover:shadow-lg shadow-purple-200"
                        >
                            <PresentationIcon className="h-4 w-4" />
                            Apresentação
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(plan.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Excluir"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <h1 className="text-2xl font-bold mb-2" style={{ color: activeColor }}>Planejamento Anual</h1>
                <div className="flex space-x-4 text-sm text-gray-500 mb-8">
                    <span className="font-semibold text-gray-700">{plan.discipline}</span>
                    <span>•</span>
                    <span>{plan.grade}</span>
                </div>

                {plan.planType === 'infantil' && plan.infantilContent ? (
                    <div className="space-y-8">
                        {/* Objetivo Geral */}
                        <div className="p-6 rounded-2xl border" style={{ backgroundColor: `${activeColor}10`, borderColor: `${activeColor}20` }}>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide" style={{ color: activeColor }}>Objetivo Geral</h3>
                            <p className="text-gray-700 text-justify">{plan.infantilContent.generalObjective}</p>
                        </div>

                        {/* Campos de Experiência */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: activeColor }}></div>
                                Campos de Experiências
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                {plan.infantilContent.experienceFields.map((field, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                                            <h4 className="font-black uppercase tracking-wider" style={{ color: activeColor }}>{field.fieldName}</h4>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-1">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Objetivos de Aprendizagem</h5>
                                                <ul className="space-y-2">
                                                    {field.objectives.map((obj, i) => (
                                                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                            <span className="font-bold" style={{ color: activeColor }}>•</span>
                                                            <span className="text-justify">{obj}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Eixos Temáticos (O Quê?)</h5>
                                                <ul className="space-y-2">
                                                    {field.themes.map((theme, i) => (
                                                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                            <span className="text-blue-400 font-bold">•</span>
                                                            <span className="text-justify">{theme}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Metodologia (Como?)</h5>
                                                <p className="text-sm text-gray-600 text-justify">{field.methodology}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Outras Seções */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' }}>
                                <h4 className="font-bold text-blue-900 mb-3 uppercase text-sm">Direitos de Aprendizagem</h4>
                                <div className="flex flex-wrap gap-2">
                                    {plan.infantilContent.learningRights.map((right, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full font-bold">
                                            {right}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' }}>
                                <h4 className="font-bold text-emerald-900 mb-3 uppercase text-sm">Recursos Materiais</h4>
                                <ul className="text-sm text-emerald-800 space-y-1">
                                    {plan.infantilContent.materials.map((m, i) => <li key={i}>• {m}</li>)}
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                                <h4 className="font-bold text-amber-900 mb-3 uppercase text-sm">Avaliação</h4>
                                <p className="text-sm text-amber-900 text-justify">{plan.infantilContent.evaluation}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plan.bimesters?.map((bimester, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white transition-colors">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: activeColor }}>{bimester.name}</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Temas</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1 text-justify">
                                            {bimester.themes.map((t, i) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Objetivos</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1 text-justify">
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
                                        <p className="text-sm text-gray-600 mt-1 text-justify">{bimester.evaluation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
