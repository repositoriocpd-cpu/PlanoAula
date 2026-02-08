import React, { useState } from 'react';
import { AssessmentForm } from '../components/assessments/AssessmentForm';
import { AssessmentViewer } from '../components/assessments/AssessmentViewer';
import { generateAssessment } from '../services/aiGenerator';
import type { Assessment as AssessmentType, AssessmentFormData } from '../types/assessment';

export function Assessments() {
    const [currentAssessment, setCurrentAssessment] = useState<AssessmentType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (data: AssessmentFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const assessment = await generateAssessment(data);
            setCurrentAssessment(assessment);
        } catch (err) {
            setError('Erro ao gerar avaliação. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Avaliações</h1>

            <div className="flex-1 overflow-hidden">
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
                        <AssessmentForm onSubmit={handleGenerate} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
}
