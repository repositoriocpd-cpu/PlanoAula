export interface DidacticSequence {
    id: string;
    theme: string;
    numClasses: number;
    createdAt: string;
    objectives: string[];
    bnccSkills: string[];
    classes: ClassPlan[];
    finalEvaluation: string;
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
