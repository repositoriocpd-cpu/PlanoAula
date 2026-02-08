export interface AnnualPlan {
    id: string;
    discipline: string;
    grade: string;
    createdAt: string;
    bimesters: Bimester[];
}

export interface Bimester {
    name: string; // e.g., "1º Bimestre"
    themes: string[];
    objectives: string[];
    bnccSkills: string[];
    methodologies: string[];
    evaluation: string;
}

export type AnnualPlanFormData = Pick<AnnualPlan, 'discipline' | 'grade'>;
