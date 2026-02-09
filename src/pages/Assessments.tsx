import { useState, useEffect } from 'react';
import { FileText, FileEdit } from 'lucide-react';
import { AssessmentForm } from '../components/assessments/AssessmentForm';
import { AssessmentViewer } from '../components/assessments/AssessmentViewer';
import { generateAssessment } from '../services/aiGenerator';
import type { AssessmentFormData } from '../types/assessment';
import { AssessmentList } from '../components/assessments/AssessmentList';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { exportAssessmentToPDF, exportAssessmentsToWord } from '../services/exportService';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';

export function Assessments() {
    const { user } = useAuth();
    const { assessments, addAssessment, removeAssessment, fetchAssessments } = useAssessmentStore();
    const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentAssessment = assessments.find(a => a.id === selectedAssessmentId) || null;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    const handleGenerate = async (data: AssessmentFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const assessment = await generateAssessment(data);
            if (user) {
                assessment.userId = user.id;
            }
            await addAssessment(assessment);
            setSelectedAssessmentId(assessment.id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar avaliação.';
            setError(`Erro: ${errorMessage}`);
            console.error('Assessment generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
            await removeAssessment(id);
            if (selectedAssessmentId === id) {
                setSelectedAssessmentId(null);
            }
        }
    };

    const handleExportAllPDF = () => {
        if (assessments.length === 0) return;
        const doc = new jsPDF();
        let y = 30;
        assessments.forEach((assessment, index) => {
            if (index > 0) {
                doc.addPage();
                y = 30;
            }
            y = exportAssessmentToPDF(assessment, doc, y);
        });
        doc.save(`Todas_as_Avaliacoes_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    };

    const handleExportAllWord = async () => {
        if (assessments.length === 0) return;
        await exportAssessmentsToWord(assessments, `Todas_as_Avaliacoes_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Avaliações</h1>
                {selectedAssessmentId && (
                    <button
                        onClick={() => setSelectedAssessmentId(null)}
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
                            onBack={() => setSelectedAssessmentId(null)}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <AssessmentForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50/50 rounded-2xl lg:border-l lg:border-white p-4 flex flex-col h-full overflow-hidden border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Minhas Avaliações</h2>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">{assessments.length}</span>
                    </div>

                    {/* Bulk Export Actions */}
                    {assessments.length > 0 && (
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
                        <AssessmentList
                            assessments={assessments}
                            onSelect={(a) => setSelectedAssessmentId(a.id)}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
