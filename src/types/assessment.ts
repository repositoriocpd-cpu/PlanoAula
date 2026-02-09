export type AssessmentType = 'Prova' | 'Atividade' | 'Rubrica' | 'Diagnóstica';

export interface Assessment {
    id: string;
    userId?: string;
    title: string;
    discipline: string;
    grade: string;
    type: AssessmentType;
    content: string; // Topic/Content covered
    createdAt: string;
    headerColor?: string;

    questions?: Question[];
    rubric?: RubricCriteria[];
}

export interface Question {
    id: string;
    text: string;
    type: 'multiple_choice' | 'essay';
    options?: string[];
    correctAnswer?: string;
}

export interface RubricCriteria {
    criteria: string;
    levels: {
        level: string; // e.g. "Avançado"
        description: string;
    }[];
}

export interface AssessmentFormData {
    discipline: string;
    grade: string;
    content: string;
    type: AssessmentType;
}
