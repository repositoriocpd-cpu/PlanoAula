import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Assessment } from '../types/assessment';

interface AssessmentStore {
    assessments: Assessment[];
    isLoading: boolean;
    fetchAssessments: () => Promise<void>;
    addAssessment: (assessment: Assessment) => Promise<void>;
    removeAssessment: (id: string) => Promise<void>;
    updateHeaderColor: (id: string, color: string) => Promise<void>;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
    assessments: [],
    isLoading: false,

    fetchAssessments: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching assessments for user:', user?.id);

            if (!user) {
                console.warn('No user found during fetchAssessments');
                set({ assessments: [] });
                return;
            }

            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching assessments:', error);
                throw error;
            }

            const formattedAssessments: Assessment[] = (data || []).map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                title: item.title,
                discipline: item.discipline,
                grade: item.grade,
                type: item.type,
                content: item.content,
                createdAt: item.created_at,
                questions: item.questions,
                rubric: item.rubric,
                headerColor: item.header_color
            }));

            set({ assessments: formattedAssessments });
        } catch (error) {
            console.error('Error fetching assessments catch block:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addAssessment: async (assessment) => {
        console.log('Adding assessment to store and Supabase:', assessment.id);
        set((state) => ({ assessments: [assessment, ...state.assessments] }));
        try {
            const { data, error } = await supabase
                .from('assessments')
                .insert({
                    id: assessment.id,
                    user_id: assessment.userId,
                    title: assessment.title,
                    discipline: assessment.discipline,
                    grade: assessment.grade,
                    type: assessment.type,
                    content: assessment.content,
                    questions: assessment.questions,
                    rubric: assessment.rubric,
                    header_color: assessment.headerColor,
                    created_at: assessment.createdAt
                })
                .select();

            if (error) {
                console.error('Supabase error adding assessment:', error);
                throw error;
            }
            console.log('Assessment added successfully to Supabase:', data);
        } catch (error) {
            console.error('Error adding assessment catch block:', error);
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
    },

    updateHeaderColor: async (id, color) => {
        set((state) => ({
            assessments: state.assessments.map((a) =>
                a.id === id ? { ...a, headerColor: color } : a
            )
        }));

        try {
            const { error } = await supabase
                .from('assessments')
                .update({ header_color: color })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating header color:', error);
        }
    }
}));
