import React, { useState } from 'react';
import { LessonForm } from '../components/lessons/LessonForm';
import { LessonList } from '../components/lessons/LessonList';
import { LessonViewer } from '../components/lessons/LessonViewer';
import { generateLessonPlan } from '../services/aiGenerator';
import { useLessonStore } from '../store/useLessonStore';
import type { LessonPlan, LessonPlanFormData } from '../types/lesson';
import { PlusCircle, FileText, FileEdit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { exportLessonToPDF, exportLessonsToWord } from '../services/exportService';

export function DailyLessons() {
    const { plans, addPlan, removePlan, fetchPlans } = useLessonStore();
    const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleCreatePlan = async (data: LessonPlanFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const newPlan = await generateLessonPlan(data);
            addPlan(newPlan);
            setSelectedPlan(newPlan);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar plano.';
            setError(`Erro: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeletePlan = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            removePlan(id);
            if (selectedPlan?.id === id) {
                setSelectedPlan(null);
            }
        }
    };

    const handleExportAllPDF = () => {
        if (plans.length === 0) return;
        const doc = new jsPDF();
        let y = 30;
        plans.forEach((plan, index) => {
            if (index > 0) {
                doc.addPage();
                y = 30;
            }
            y = exportLessonToPDF(plan, doc, y);
        });
        doc.save(`Todos_os_Planos_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    };

    const handleExportAllWord = async () => {
        if (plans.length === 0) return;
        await exportLessonsToWord(plans, `Todos_os_Planos_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Aulas Diárias</h1>
                {selectedPlan && (
                    <button
                        onClick={() => setSelectedPlan(null)}
                        className="flex items-center text-sm text-primary hover:text-blue-700 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition-all hover:-translate-y-0.5"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Gerar Novo Plano
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* Left Panel: Content (Form or Viewer) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar lg:pr-2">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    {selectedPlan ? (
                        <LessonViewer
                            plan={selectedPlan}
                            onBack={() => setSelectedPlan(null)}
                            onDelete={() => handleDeletePlan(selectedPlan.id)}
                        />
                    ) : (
                        <div className="max-w-2xl mx-auto py-4">
                            <LessonForm onSubmit={handleCreatePlan} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50/50 rounded-2xl lg:border-l lg:border-white p-4 flex flex-col h-full overflow-hidden border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Meus Planos</h2>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">{plans.length}</span>
                    </div>

                    {/* Bulk Export Actions */}
                    {plans.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-6 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <button
                                onClick={handleExportAllPDF}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-rose-50 transition-all group border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md bg-white"
                            >
                                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform mb-2 shadow-sm">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-rose-700 tracking-wider">BAIXAR PDF (TODOS)</span>
                            </button>
                            <button
                                onClick={handleExportAllWord}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md bg-white"
                            >
                                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform mb-2 shadow-sm">
                                    <FileEdit className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-blue-700 tracking-wider">BAIXAR WORD (TODOS)</span>
                            </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <LessonList
                            plans={plans}
                            onSelect={setSelectedPlan}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
