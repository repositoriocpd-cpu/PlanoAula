import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Assessment } from '../types/assessment';

interface AssessmentStore {
    assessments: Assessment[];
    isLoading: boolean;
    fetchAssessments: () => Promise<void>;
    addAssessment: (assessment: Assessment) => Promise<void>;
    removeAssessment: (id: string) => Promise<void>;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
    assessments: [],
    isLoading: false,

    fetchAssessments: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedAssessments: Assessment[] = (data || []).map(item => ({
                id: item.id,
                title: item.title,
                discipline: item.discipline,
                grade: item.grade,
                type: item.type,
                content: item.content,
                createdAt: item.created_at,
                questions: item.questions,
                rubric: item.rubric
            }));

            set({ assessments: formattedAssessments });
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addAssessment: async (assessment) => {
        set((state) => ({ assessments: [assessment, ...state.assessments] }));
        try {
            const { error } = await supabase
                .from('assessments')
                .insert({
                    id: assessment.id,
                    title: assessment.title,
                    discipline: assessment.discipline,
                    grade: assessment.grade,
                    type: assessment.type,
                    content: assessment.content,
                    questions: assessment.questions,
                    rubric: assessment.rubric,
                    created_at: assessment.createdAt
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error adding assessment:', error);
        }
    },

    removeAssessment: async (id) => {
        set((state) => ({ assessments: state.assessments.filter((a) => a.id !== id) }));
        try {
            const { error } = await supabase
                .from('assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing assessment:', error);
        }
    }
}));
