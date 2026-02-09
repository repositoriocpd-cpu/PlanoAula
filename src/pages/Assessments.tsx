import { useState, useEffect } from 'react';
import { AssessmentForm } from '../components/assessments/AssessmentForm';
import { AssessmentViewer } from '../components/assessments/AssessmentViewer';
import { generateAssessment } from '../services/aiGenerator';
import type { Assessment as AssessmentType, AssessmentFormData } from '../types/assessment';

import { AssessmentList } from '../components/assessments/AssessmentList';
import { useAssessmentStore } from '../store/useAssessmentStore';

export function Assessments() {
    const { assessments, addAssessment, removeAssessment, fetchAssessments } = useAssessmentStore();
    const [currentAssessment, setCurrentAssessment] = useState<AssessmentType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    const handleGenerate = async (data: AssessmentFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const assessment = await generateAssessment(data);
            await addAssessment(assessment);
            setCurrentAssessment(assessment);
        } catch (err) {
            setError('Erro ao gerar avaliação. Verifique sua conexão.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
            await removeAssessment(id);
            if (currentAssessment?.id === id) {
                setCurrentAssessment(null);
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Avaliações</h1>
                {currentAssessment && (
                    <button
                        onClick={() => setCurrentAssessment(null)}
                        className="text-sm text-primary hover:text-blue-700 font-medium"
                    >
                        + Nova Avaliação
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* Left Panel: Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar lg:pr-2">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
                            {error}
                        </div>
                    )}

                    {currentAssessment ? (
                        <AssessmentViewer
                            assessment={currentAssessment}
                            onBack={() => setCurrentAssessment(null)}
                        />
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <AssessmentForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50 rounded-lg lg:border-l lg:border-gray-200 lg:pl-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50 py-2">Minhas Avaliações</h2>
                    <AssessmentList
                        assessments={assessments}
                        onSelect={setCurrentAssessment}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
