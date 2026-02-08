import React, { useState } from 'react';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportViewer } from '../components/reports/ReportViewer';
import { generateReport } from '../services/aiGenerator';
import type { Report as ReportType, ReportFormData } from '../types/report';

export function Reports() {
    const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (data: ReportFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const report = await generateReport(data);
            setCurrentReport(report);
        } catch (err) {
            setError('Erro ao gerar relatório. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Relatórios Individuais</h1>

            <div className="flex-1 overflow-hidden">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                {currentReport ? (
                    <ReportViewer
                        report={currentReport}
                        onBack={() => setCurrentReport(null)}
                    />
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <ReportForm onSubmit={handleGenerate} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
}
