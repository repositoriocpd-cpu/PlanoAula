import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { AnnualPlan } from '../types/annualPlan';

interface AnnualPlanStore {
    plans: AnnualPlan[];
    isLoading: boolean;
    fetchPlans: () => Promise<void>;
    addPlan: (plan: AnnualPlan) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
    updatePlanColor: (id: string, color: string) => Promise<void>;
    updateResources: (id: string, resources: any) => Promise<void>;
}

export const useAnnualPlanStore = create<AnnualPlanStore>((set) => ({
    plans: [],
    isLoading: false,

    fetchPlans: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching plans for user:', user?.id);

            if (!user) {
                console.warn('No user found during fetchPlans');
                set({ plans: [] });
                return;
            }

            const { data, error } = await supabase
                .from('annual_plans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching plans:', error);
                throw error;
            }

            console.log('Fetched plans count:', data?.length || 0);

            const formattedPlans: AnnualPlan[] = (data || []).map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                discipline: item.discipline,
                grade: item.grade,
                createdAt: item.created_at,
                planType: item.plan_type || 'fundamental',
                headerColor: item.header_color,
                bimesters: item.bimesters,
                infantilContent: item.infantil_content,
                generatedResources: item.generated_resources || {}
            }));

            set({ plans: formattedPlans });
        } catch (error) {
            console.error('Error fetching plans catch block:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addPlan: async (plan) => {
        console.log('Adding plan to store and Supabase:', plan.id);
        // Optimistic update
        set((state) => ({ plans: [plan, ...state.plans] }));
        try {
            const { data, error } = await supabase
                .from('annual_plans')
                .insert({
                    id: plan.id,
                    user_id: plan.userId,
                    discipline: plan.discipline,
                    grade: plan.grade,
                    plan_type: plan.planType,
                    header_color: plan.headerColor,
                    bimesters: plan.bimesters,
                    infantil_content: plan.infantilContent,
                    created_at: plan.createdAt
                })
                .select();

            if (error) {
                console.error('Supabase error adding plan:', error);
                // Revert optimistic update?
                throw error;
            }
            console.log('Plan added successfully to Supabase:', data);
        } catch (error) {
            console.error('Error adding plan catch block:', error);
            // Optionally revert local state here
        }
    },

    removePlan: async (id) => {
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
        try {
            const { error } = await supabase
                .from('annual_plans')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing annual plan:', error);
        }
    },

    updatePlanColor: async (id, color) => {
        set((state) => ({
            plans: state.plans.map((p) =>
                p.id === id ? { ...p, headerColor: color } : p
            )
        }));
        try {
            const { error } = await supabase
                .from('annual_plans')
                .update({ header_color: color })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating plan color:', error);
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
                .from('annual_plans')
                .update({ generated_resources: resources })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating annual plan resources:', error);
            throw error;
        }
    }
}));
