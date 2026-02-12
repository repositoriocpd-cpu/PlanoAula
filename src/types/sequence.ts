import type { ResourceData } from './resources';

export interface DidacticSequence {
    id: string;
    userId?: string;
    theme: string;
    numClasses: number;
    createdAt: string;
    headerColor?: string;
    objectives: string[];
    bnccSkills: string[];
    classes: ClassPlan[];
    finalEvaluation: string;
    generatedResources?: ResourceData;
}

export interface ClassPlan {
    classNumber: number;
    topic: string;
    activities: string[];
    resources: string[];
}

export interface SequenceFormData {
    theme: string;
    numClasses: number;
    discipline: string; // Added discipline to context for better generation
    grade: string;
}
