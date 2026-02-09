import { useState, useEffect } from 'react';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportViewer } from '../components/reports/ReportViewer';
import { generateReport } from '../services/aiGenerator';
import type { Report as ReportType, ReportFormData } from '../types/report';

import { ReportList } from '../components/reports/ReportList';
import { useReportStore } from '../store/useReportStore';

export function Reports() {
    const { reports, addReport, removeReport, fetchReports } = useReportStore();
    const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleGenerate = async (data: ReportFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const report = await generateReport(data);
            await addReport(report);
            setCurrentReport(report);
        } catch (err) {
            setError('Erro ao gerar relatório. Verifique sua conexão.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este relatório?')) {
            await removeReport(id);
            if (currentReport?.id === id) {
                setCurrentReport(null);
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Relatórios Individuais</h1>
                {currentReport && (
                    <button
                        onClick={() => setCurrentReport(null)}
                        className="text-sm text-primary hover:text-blue-700 font-medium"
                    >
                        + Novo Relatório
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

                    {currentReport ? (
                        <ReportViewer
                            report={currentReport}
                            onBack={() => setCurrentReport(null)}
                        />
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <ReportForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50 rounded-lg lg:border-l lg:border-gray-200 lg:pl-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50 py-2">Meus Relatórios</h2>
                    <ReportList
                        reports={reports}
                        onSelect={setCurrentReport}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
