export type ResourceType =
    | 'planejamento'
    | 'atividades'
    | 'avaliacoes'
    | 'inclusao'
    | 'jogos'
    | 'mapas_mentais'
    | 'apresentacoes'
    | 'pei'
    | 'tarefas_adaptadas'
    | 'simulado_saeb'
    | 'listas_bncc'
    | 'recursos_multimidia';

export interface GeneratedResource {
    type: ResourceType;
    content: any; // Dynamic content based on type
    createdAt: string;
}

export interface ResourceData {
    [key: string]: GeneratedResource;
}

// Specific content interfaces (to be expanded as needed)
export interface InclusionResource {
    tea: string;
    tdah: string;
    visual: string;
    auditory: string;
    intellectual: string;
}

export interface GameResource {
    name: string;
    objective: string;
    materials: string[];
    rules: string[];
    application: string;
}

export interface AdaptedTaskResource {
    basic: string;
    intermediate: string;
    advanced: string;
}

export interface SaebSimulationResource {
    questions: {
        text: string;
        options: string[];
        answer: string;
        descriptor: string;
    }[];
}

export interface MultimediaResource {
    videos: { title: string; url: string; description: string }[];
    sites: { name: string; url: string; description: string }[];
    apps: { name: string; url: string; description: string }[];
}
