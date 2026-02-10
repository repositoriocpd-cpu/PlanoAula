import React from 'react';
import {
    FileText, Pencil, ClipboardCheck, Accessibility,
    Gamepad2, GitBranch, Presentation, UserCheck,
    CheckSquare, Layers, ListChecks, Video,
    Loader2
} from 'lucide-react';
import type { ResourceType } from '../../types/resources';

interface ResourceCardProps {
    type: ResourceType;
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    onClick: (type: ResourceType) => void;
    isGenerating?: boolean;
    hasGenerated?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
    type, label, icon: Icon, color, bgColor, onClick, isGenerating, hasGenerated
}) => (
    <button
        onClick={() => onClick(type)}
        disabled={isGenerating}
        className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all group border border-transparent shadow-sm hover:shadow-md bg-white ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:border-gray-100'}`}
    >
        <div className={`p-3 ${bgColor} ${color} rounded-xl group-hover:scale-110 transition-transform mb-2 shadow-sm relative`}>
            {isGenerating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <Icon className="h-6 w-6" />
            )}
            {hasGenerated && !isGenerating && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
        </div>
        <span className="text-[11px] font-black text-gray-700 tracking-tight text-center uppercase leading-tight">
            {label}
        </span>
    </button>
);

interface PedagogicalResourcesPanelProps {
    onGenerate: (type: ResourceType) => void;
    generatingType?: ResourceType | null;
    existingResources?: Record<string, any>;
}

export const PedagogicalResourcesPanel: React.FC<PedagogicalResourcesPanelProps> = ({
    onGenerate, generatingType, existingResources = {}
}) => {
    const resources = [
        { type: 'planejamento', label: 'Planejamento', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { type: 'atividades', label: 'Atividades', icon: Pencil, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { type: 'avaliacoes', label: 'Avaliações', icon: ClipboardCheck, color: 'text-rose-600', bgColor: 'bg-rose-100' },
        { type: 'inclusao', label: 'Inclusão', icon: Accessibility, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },

        { type: 'jogos', label: 'Jogos Pedagógicos', icon: Gamepad2, color: 'text-amber-600', bgColor: 'bg-amber-100' },
        { type: 'mapas_mentais', label: 'Mapas Mentais', icon: GitBranch, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
        { type: 'apresentacoes', label: 'Apresentações', icon: Presentation, color: 'text-slate-600', bgColor: 'bg-slate-100' },
        { type: 'pei', label: 'PEI', icon: UserCheck, color: 'text-teal-600', bgColor: 'bg-teal-100' },

        { type: 'tarefas_adaptadas', label: 'Tarefas Adaptadas', icon: CheckSquare, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { type: 'simulado_saeb', label: 'Simulados SAEB', icon: Layers, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
        { type: 'listas_bncc', label: 'Listas BNCC', icon: ListChecks, color: 'text-lime-600', bgColor: 'bg-lime-100' },
        { type: 'recursos_multimidia', label: 'Recursos Multimídia', icon: Video, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    ] as const;

    return (
        <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-xl">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-8 bg-primary rounded-full mr-3" />
                Recursos Pedagógicos Inteligentes
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {resources.map((res) => (
                    <ResourceCard
                        key={res.type}
                        {...res}
                        onClick={onGenerate}
                        isGenerating={generatingType === res.type}
                        hasGenerated={!!existingResources[res.type]}
                    />
                ))}
            </div>
        </div>
    );
};
