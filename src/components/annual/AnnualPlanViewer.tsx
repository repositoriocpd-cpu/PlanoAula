import { FileText, FileEdit, ArrowLeft } from 'lucide-react';
import type { AnnualPlan } from '../../types/annualPlan';
import { exportAnnualPlanToPDF, exportAnnualPlansToWord } from '../../services/exportService';

interface AnnualPlanViewerProps {
    plan: AnnualPlan;
    onBack: () => void;
}

export function AnnualPlanViewer({ plan, onBack }: AnnualPlanViewerProps) {

    const handleDownloadPDF = () => {
        exportAnnualPlanToPDF(plan);
    };

    const handleDownloadWord = () => {
        exportAnnualPlansToWord([plan], `Plano_Anual_${plan.discipline}.docx`);
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
