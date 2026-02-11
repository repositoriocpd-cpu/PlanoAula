import React, { useState } from 'react';
import { PlusCircle, FileText, FileEdit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SequenceForm } from '../components/sequence/SequenceForm';
import { SequenceViewer } from '../components/sequence/SequenceViewer';
import { generateDidacticSequence } from '../services/aiGenerator';
import { SequenceList } from '../components/sequence/SequenceList';
import { useSequenceStore } from '../store/useSequenceStore';
import type { SequenceFormData } from '../types/sequence';
import { exportSequenceToPDF, exportSequencesToWord } from '../services/exportService';
import { useAuth } from '../contexts/AuthContext';
import { PedagogicalResourcesPanel } from '../components/pedagogical/PedagogicalResourcesPanel';
import { ResourceViewerModal } from '../components/pedagogical/ResourceViewerModal';
import { generatePedagogicalResource } from '../services/resourceGenerator';
import type { ResourceType } from '../types/resources';
import { performSafetyBackup } from '../services/backupService';

export function DidacticSequence() {
    const { user } = useAuth();
    const { sequences, addSequence, removeSequence, fetchSequences } = useSequenceStore();
    const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentSequence = sequences.find(s => s.id === selectedSequenceId) || null;
    const [error, setError] = useState<string | null>(null);

    // Resource State
    const [generatingResourceType, setGeneratingResourceType] = useState<ResourceType | null>(null);
    const [viewerResource, setViewerResource] = useState<{ title: string, content: string, type: string } | null>(null);
    const { updateResources } = useSequenceStore();

    React.useEffect(() => {
        fetchSequences();
    }, [fetchSequences]);

    const handleGenerate = async (data: SequenceFormData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const sequence = await generateDidacticSequence(data);
            if (user) {
                sequence.userId = user.id;
            }
            await addSequence(sequence);
            await performSafetyBackup({
                type: 'sequence',
                data: sequence,
                filename: `SEQUENCIA_${sequence.theme.replace(/ /g, '_')}`
            });
            setSelectedSequenceId(sequence.id);
        } catch (err: any) {
            console.error('Sequence generation/save error:', err);

            let errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar sequência.';
            let userFriendlyMessage = errorMessage;

            if (errorMessage.includes('quota') || errorMessage.includes('429')) {
                userFriendlyMessage = '⚠️ Limite de uso da IA atingido. Por favor, aguarde alguns instantes e tente novamente. Se o problema persistir, verifique seu plano.';
            } else if (errorMessage.includes('503')) {
                userFriendlyMessage = '⚠️ O serviço de IA está temporariamente indisponível (sobrecarregado). Tente novamente em alguns segundos.';
            } else if (errorMessage.toLowerCase().includes('generate')) {
                userFriendlyMessage = 'Erro na geração do conteúdo pela IA. ' + errorMessage;
            } else if (errorMessage.toLowerCase().includes('database') || errorMessage.toLowerCase().includes('supabase')) {
                userFriendlyMessage = 'Erro ao salvar a sequência no banco de dados. Seus dados podem não ter sido salvos.';
            }

            setError(userFriendlyMessage);

            // Only alert if it's not a quota error (which is handled gracefully by the UI message)
            if (!errorMessage.includes('quota') && !errorMessage.includes('429')) {
                alert(userFriendlyMessage);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateResource = async (type: ResourceType) => {
        if (!currentSequence) return;

        if (currentSequence.generatedResources?.[type]) {
            setViewerResource({
                title: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
                content: currentSequence.generatedResources[type].content,
                type
            });
            return;
        }

        setGeneratingResourceType(type);
        try {
            const content = await generatePedagogicalResource(type, currentSequence);
            const newResources = {
                ...(currentSequence.generatedResources || {}),
                [type]: {
                    type,
                    content,
                    createdAt: new Date().toISOString()
                }
            };

            await updateResources(currentSequence.id, newResources);

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
        if (confirm('Tem certeza que deseja excluir esta sequência?')) {
            await removeSequence(id);
            if (selectedSequenceId === id) {
                setSelectedSequenceId(null);
            }
        }
    };

    const handleExportAllPDF = () => {
        if (sequences.length === 0) return;
        const doc = new jsPDF();
        let y = 30;
        sequences.forEach((seq, index) => {
            if (index > 0) {
                doc.addPage();
                y = 30;
            }
            y = exportSequenceToPDF(seq, doc, y);
        });
        doc.save(`Todas_as_Sequencias_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    };

    const handleExportAllWord = async () => {
        if (sequences.length === 0) return;
        await exportSequencesToWord(sequences, `Todas_as_Sequencias_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sequência Didática</h1>
                {selectedSequenceId && (
                    <button
                        onClick={() => setSelectedSequenceId(null)}
                        className="flex items-center text-sm text-primary hover:text-blue-700 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition-all hover:-translate-y-0.5"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Gerar Nova Sequência
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

                    {currentSequence ? (
                        <>
                            <SequenceViewer
                                sequence={currentSequence}
                                onBack={() => setSelectedSequenceId(null)}
                                onDelete={handleDelete}
                            />
                            <PedagogicalResourcesPanel
                                onGenerate={handleGenerateResource}
                                generatingType={generatingResourceType}
                                existingResources={currentSequence.generatedResources}
                            />
                        </>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <SequenceForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </div>
                    )}
                </div>

                {/* Right Panel: List */}
                <div className="lg:w-1/3 bg-gray-50/50 rounded-2xl lg:border-l lg:border-white p-4 flex flex-col h-full overflow-hidden border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Minhas Sequências</h2>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">{sequences.length}</span>
                    </div>

                    {/* Bulk Export Actions */}
                    {sequences.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-6 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <button
                                onClick={handleExportAllPDF}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-rose-50 transition-all group border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md bg-white"
                            >
                                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform mb-2 shadow-sm">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-rose-700 tracking-wider">BAIXAR PDF (TODAS)</span>
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
                        <SequenceList
                            sequences={sequences}
                            onSelect={(seq) => setSelectedSequenceId(seq.id)}
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
