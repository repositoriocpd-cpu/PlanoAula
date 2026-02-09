export interface AnnualPlan {
    id: string;
    userId?: string;
    discipline: string;
    grade: string;
    createdAt: string;
    planType: 'fundamental' | 'infantil';
    headerColor?: string;
    bimesters?: Bimester[];
    infantilContent?: InfantilPlanContent;
}

export interface Bimester {
    name: string;
    themes: string[];
    objectives: string[];
    bnccSkills: string[];
    methodologies: string[];
    evaluation: string;
}

export interface ExperienceField {
    fieldName: string;
    objectives: string[];
    themes: string[]; // Eixo Temático
    methodology: string;
}

export interface InfantilPlanContent {
    experienceFields: ExperienceField[];
    learningRights: string[];
    materials: string[];
    evaluation: string;
    generalObjective: string;
}

export type AnnualPlanFormData = Pick<AnnualPlan, 'discipline' | 'grade'>;
