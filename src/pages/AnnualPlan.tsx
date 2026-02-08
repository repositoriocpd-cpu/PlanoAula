import React, { useState } from 'react';
import { AnnualPlanForm } from '../components/annual/AnnualPlanForm';
import { AnnualPlanViewer } from '../components/annual/AnnualPlanViewer';
import { generateAnnualPlan } from '../services/aiGenerator';
import type { AnnualPlan as AnnualPlanType, AnnualPlanFormData } from '../types/annualPlan';

export function AnnualPlan() {
    const [currentPlan, setCurrentPlan] = useState<AnnualPlanType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (data: AnnualPlanFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const plan = await generateAnnualPlan(data);
            setCurrentPlan(plan);
        } catch (err) {
            setError('Erro ao gerar planejamento. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Plano Anual</h1>

            <div className="flex-1 overflow-hidden">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                {currentPlan ? (
                    <AnnualPlanViewer
                        plan={currentPlan}
                        onBack={() => setCurrentPlan(null)}
                    />
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <AnnualPlanForm onSubmit={handleGenerate} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
}
