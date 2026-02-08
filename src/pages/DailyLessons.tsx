import React, { useState } from 'react';
import { LessonForm } from '../components/lessons/LessonForm';
import { LessonList } from '../components/lessons/LessonList';
import { LessonViewer } from '../components/lessons/LessonViewer';
import { generateLessonPlan } from '../services/aiGenerator';
import { useLessonStore } from '../store/useLessonStore';
import type { LessonPlan, LessonPlanFormData } from '../types/lesson';
import { PlusCircle } from 'lucide-react';

export function DailyLessons() {
    const { plans, addPlan, removePlan } = useLessonStore();
    const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePlan = async (data: LessonPlanFormData) => {
        setIsLoading(true);
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
            setIsLoading(false);
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

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Aulas Diárias</h1>
                {selectedPlan && (
                    <button
                        onClick={() => setSelectedPlan(null)}
                        className="flex items-center text-sm text-primary hover:text-blue-700 font-medium"
                    >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Novo Plano
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* Left Panel: Content (Form or Viewer) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar lg:pr-2">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
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
                        <LessonForm onSubmit={handleCreatePlan} isLoading={isLoading} />
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50 rounded-lg lg:border-l lg:border-gray-200 lg:pl-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50 py-2">Meus Planos de Aula</h2>
                    <LessonList
                        plans={plans}
                        onSelect={setSelectedPlan}
                    />
                </div>
            </div>
        </div>
    );
}
