import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { LessonPlan } from '../types/lesson';

interface LessonStore {
    plans: LessonPlan[];
    isLoading: boolean;
    fetchPlans: () => Promise<void>;
    addPlan: (plan: LessonPlan) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
    getPlan: (id: string) => LessonPlan | undefined;
    updateHeaderColor: (id: string, color: string) => Promise<void>;
    updateResources: (id: string, resources: any) => Promise<void>;
}

export const useLessonStore = create<LessonStore>((set, get) => ({
    plans: [],
    isLoading: false,

    fetchPlans: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching lesson plans for user:', user?.id);

            if (!user) {
                console.warn('No user found during fetchPlans (lessons)');
                set({ plans: [] });
                return;
            }

            const { data, error } = await supabase
                .from('lesson_plans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching lesson plans:', error);
                throw error;
            }

            const formattedLessons: LessonPlan[] = (data || []).map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                title: item.title,
                discipline: item.discipline,
                grade: item.grade,
                theme: item.theme,
                duration: item.duration,
                context: item.context,
                createdAt: item.created_at,
                headerColor: item.header_color,
                content: item.content,
                generatedResources: item.generated_resources || {}
            }));

            set({ plans: formattedLessons });
        } catch (error) {
            console.error('Error fetching lesson plans catch block:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addPlan: async (plan) => {
        console.log('Adding lesson plan to store and Supabase:', plan.id);
        // Optimistic update
        set((state) => ({ plans: [plan, ...state.plans] }));

        try {
            const { data, error } = await supabase
                .from('lesson_plans')
                .insert({
                    id: plan.id,
                    user_id: plan.userId,
                    title: plan.title,
                    discipline: plan.discipline,
                    grade: plan.grade,
                    theme: plan.theme,
                    duration: plan.duration,
                    context: plan.context,
                    content: plan.content,
                    header_color: plan.headerColor,
                    created_at: plan.createdAt
                })
                .select();

            if (error) {
                console.error('Supabase error adding lesson plan:', error);
                throw error;
            }
            console.log('Lesson plan added successfully to Supabase:', data);
        } catch (error) {
            console.error('Error adding lesson plan catch block:', error);
            // Revert optimistic update if needed
        }
    },

    removePlan: async (id) => {
        // Optimistic update
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));

        try {
            const { error } = await supabase
                .from('lesson_plans')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing plan:', error);
        }
    },

    getPlan: (id) => get().plans.find((p) => p.id === id),

    updateHeaderColor: async (id, color) => {
        set((state) => ({
            plans: state.plans.map((p) =>
                p.id === id ? { ...p, headerColor: color } : p
            )
        }));

        try {
            const { error } = await supabase
                .from('lesson_plans')
                .update({ header_color: color })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating header color:', error);
        }
    },

    updateResources: async (id, resources) => {
        set((state) => ({
            plans: state.plans.map((p) =>
                p.id === id ? { ...p, generatedResources: resources } : p
            )
        }));
        try {
            const { error } = await supabase
                .from('lesson_plans')
                .update({ generated_resources: resources })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating lesson plan resources:', error);
            throw error;
        }
    }
}));
