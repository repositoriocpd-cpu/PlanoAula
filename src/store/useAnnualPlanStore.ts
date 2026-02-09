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
                planType: item.plan_type || 'fundamental',
                headerColor: item.header_color,
                bimesters: item.bimesters,
                infantilContent: item.infantil_content
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
                    plan_type: plan.planType,
                    header_color: plan.headerColor,
                    bimesters: plan.bimesters,
                    infantil_content: plan.infantilContent,
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
    }
}));
