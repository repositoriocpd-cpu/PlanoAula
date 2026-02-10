import type { ResourceData } from './resources';

export interface Report {
    id: string;
    userId?: string;
    studentName: string;
    grade: string;
    period: string; // e.g. "1º Bimestre"
    createdAt: string;
    headerColor?: string;
    content: string; // The full text of the report
    generatedResources?: ResourceData;
}

export interface ReportFormData {
    studentName: string;
    grade: string;
    period: string;
    characteristics: string; // Key observations about the student
}
