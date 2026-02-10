import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { PedagogicalResourcesPanel } from '../components/pedagogical/PedagogicalResourcesPanel';
import { ResourceViewerModal } from '../components/pedagogical/ResourceViewerModal';
import { generatePedagogicalResource } from '../services/resourceGenerator';
import type { ResourceType } from '../types/resources';

export function Resources() {
    const [topic, setTopic] = useState('');
    const [generatingType, setGeneratingType] = useState<ResourceType | null>(null);
    const [viewerResource, setViewerResource] = useState<{ title: string, content: string, type: string } | null>(null);

    const handleGenerate = async (type: ResourceType) => {
        if (!topic.trim()) {
            alert('Por favor, informe um tema ou conteúdo para gerar o recurso.');
            return;
        }

        setGeneratingType(type);
        try {
            const content = await generatePedagogicalResource(type, topic);
            setViewerResource({
                title: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
                content,
                type
            });
        } catch (error) {
            console.error('Error generating resource:', error);
            alert('Erro ao gerar recurso. Tente novamente.');
        } finally {
            setGeneratingType(null);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Hub de Recursos</h1>
                <p className="text-gray-500 font-medium">Gere materiais pedagógicos inteligentes de forma independente.</p>
            </div>

            <div className="max-w-4xl w-full mx-auto space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-purple-100/50 border border-purple-50 space-y-6 transition-all hover:shadow-purple-200/50">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">O que você quer gerar hoje?</h2>
                            <p className="text-sm text-gray-500 italic">Digite um tema, assunto ou conteúdo base</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ex: Ciclo da Água, Revolução Francesa, Funções de Primeiro Grau..."
                            className="block w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-3xl text-gray-900 font-bold placeholder-gray-400 transition-all outline-none text-lg shadow-inner"
                        />
                    </div>
                </div>

                <PedagogicalResourcesPanel
                    onGenerate={handleGenerate}
                    generatingType={generatingType}
                />
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
