import { create } from 'zustand';
import type { LessonPlan } from '../types/lesson';

interface LessonStore {
    plans: LessonPlan[];
    addPlan: (plan: LessonPlan) => void;
    removePlan: (id: string) => void;
    getPlan: (id: string) => LessonPlan | undefined;
}

export const useLessonStore = create<LessonStore>((set, get) => ({
    plans: [],
    addPlan: (plan) => set((state) => ({ plans: [plan, ...state.plans] })),
    removePlan: (id) => set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),
    getPlan: (id) => get().plans.find((p) => p.id === id),
}));
