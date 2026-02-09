import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { AnnualPlan } from '../types/annualPlan';

interface AnnualPlanStore {
    plans: AnnualPlan[];
    isLoading: boolean;
    fetchPlans: () => Promise<void>;
    addPlan: (plan: AnnualPlan) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
}

export const useAnnualPlanStore = create<AnnualPlanStore>((set) => ({
    plans: [],
    isLoading: false,

    fetchPlans: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('annual_plans')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedPlans: AnnualPlan[] = (data || []).map(item => ({
                id: item.id,
                discipline: item.discipline,
                grade: item.grade,
                createdAt: item.created_at,
                bimesters: item.bimesters
            }));

            set({ plans: formattedPlans });
        } catch (error) {
            console.error('Error fetching annual plans:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addPlan: async (plan) => {
        set((state) => ({ plans: [plan, ...state.plans] }));
        try {
            const { error } = await supabase
                .from('annual_plans')
                .insert({
                    id: plan.id,
                    discipline: plan.discipline,
                    grade: plan.grade,
                    bimesters: plan.bimesters,
                    created_at: plan.createdAt
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error adding annual plan:', error);
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
    }
}));
