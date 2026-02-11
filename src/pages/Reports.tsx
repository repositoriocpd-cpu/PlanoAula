import { useState, useEffect } from 'react';
import { FileText, FileEdit } from 'lucide-react';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportViewer } from '../components/reports/ReportViewer';
import { generateReport } from '../services/aiGenerator';
import type { ReportFormData } from '../types/report';
import { ReportList } from '../components/reports/ReportList';
import { useReportStore } from '../store/useReportStore';
import { exportReportToPDF, exportReportsToWord } from '../services/exportService';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { PedagogicalResourcesPanel } from '../components/pedagogical/PedagogicalResourcesPanel';
import { ResourceViewerModal } from '../components/pedagogical/ResourceViewerModal';
import { generatePedagogicalResource } from '../services/resourceGenerator';
import type { ResourceType } from '../types/resources';
import { performSafetyBackup } from '../services/backupService';

export function Reports() {
    const { user } = useAuth();
    const { reports, addReport, removeReport, fetchReports } = useReportStore();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentReport = reports.find(r => r.id === selectedReportId) || null;
    const [error, setError] = useState<string | null>(null);

    // Resource State
    const [generatingResourceType, setGeneratingResourceType] = useState<ResourceType | null>(null);
    const [viewerResource, setViewerResource] = useState<{ title: string, content: string, type: string } | null>(null);
    const { updateResources } = useReportStore();

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleGenerate = async (data: ReportFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const report = await generateReport(data);
            if (user) {
                report.userId = user.id;
            }
            await addReport(report);
            await performSafetyBackup({
                type: 'report',
                data: report,
                filename: `RELATORIO_${report.studentName.replace(/ /g, '_')}`
            });
            setSelectedReportId(report.id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar relatório.';
            setError(`Erro: ${errorMessage}`);
            alert(`Erro ao salvar no banco de dados: ${errorMessage}`);
            console.error('Report generation/save error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateResource = async (type: ResourceType) => {
        if (!currentReport) return;

        if (currentReport.generatedResources?.[type]) {
            setViewerResource({
                title: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
                content: currentReport.generatedResources[type].content,
                type
            });
            return;
        }

        setGeneratingResourceType(type);
        try {
            const content = await generatePedagogicalResource(type, currentReport);
            const newResources = {
                ...(currentReport.generatedResources || {}),
                [type]: {
                    type,
                    content,
                    createdAt: new Date().toISOString()
                }
            };

            await updateResources(currentReport.id, newResources);

            setViewerResource({
                title: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
                content,
                type
            });
        } catch (err) {
            console.error('Error generating resource:', err);
            alert('Erro ao gerar recurso pedagógico.');
        } finally {
            setGeneratingResourceType(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este relatório?')) {
            await removeReport(id);
            if (selectedReportId === id) {
                setSelectedReportId(null);
            }
        }
    };

    const handleExportAllPDF = () => {
        if (reports.length === 0) return;
        const doc = new jsPDF();
        let y = 30;
        reports.forEach((report, index) => {
            if (index > 0) {
                doc.addPage();
                y = 30;
            }
            y = exportReportToPDF(report, doc, y);
        });
        doc.save(`Todos_os_Relatorios_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    };

    const handleExportAllWord = async () => {
        if (reports.length === 0) return;
        await exportReportsToWord(reports, `Todos_os_Relatorios_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Relatórios Individuais</h1>
                {selectedReportId && (
                    <button
                        onClick={() => setSelectedReportId(null)}
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
                        <>
                            <ReportViewer
                                report={currentReport}
                                onBack={() => setSelectedReportId(null)}
                                onDelete={handleDelete}
                            />
                            <PedagogicalResourcesPanel
                                onGenerate={handleGenerateResource}
                                generatingType={generatingResourceType}
                                existingResources={currentReport.generatedResources}
                            />
                        </>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <ReportForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50/50 rounded-2xl lg:border-l lg:border-white p-4 flex flex-col h-full overflow-hidden border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Meus Relatórios</h2>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">{reports.length}</span>
                    </div>

                    {/* Bulk Export Actions */}
                    {reports.length > 0 && (
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
                        <ReportList
                            reports={reports}
                            onSelect={(r) => setSelectedReportId(r.id)}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>

            {viewerResource && (
                <ResourceViewerModal
                    isOpen={!!viewerResource}
                    onClose={() => setViewerResource(null)}
                    title={viewerResource.title}
                    content={viewerResource.content}
                    type={viewerResource.type}
                />
            )}
        </div>
    );
}
