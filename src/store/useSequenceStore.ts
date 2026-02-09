import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { DidacticSequence } from '../types/sequence';

interface SequenceStore {
    sequences: DidacticSequence[];
    isLoading: boolean;
    fetchSequences: () => Promise<void>;
    addSequence: (sequence: DidacticSequence) => Promise<void>;
    removeSequence: (id: string) => Promise<void>;
}

export const useSequenceStore = create<SequenceStore>((set, get) => ({
    sequences: [],
    isLoading: false,

    fetchSequences: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('didactic_sequences')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedSequences: DidacticSequence[] = (data || []).map(item => ({
                id: item.id,
                theme: item.theme,
                numClasses: item.num_classes,
                createdAt: item.created_at,
                objectives: item.objectives,
                bnccSkills: item.bncc_skills,
                classes: item.classes,
                finalEvaluation: item.final_evaluation
            }));

            set({ sequences: formattedSequences });
        } catch (error) {
            console.error('Error fetching sequences:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addSequence: async (sequence) => {
        set((state) => ({ sequences: [sequence, ...state.sequences] }));
        try {
            const { error } = await supabase
                .from('didactic_sequences')
                .insert({
                    id: sequence.id,
                    theme: sequence.theme,
                    num_classes: sequence.numClasses,
                    objectives: sequence.objectives,
                    bncc_skills: sequence.bnccSkills,
                    classes: sequence.classes,
                    final_evaluation: sequence.finalEvaluation,
                    created_at: sequence.createdAt
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error adding sequence:', error);
        }
    },

    removeSequence: async (id) => {
        set((state) => ({ sequences: state.sequences.filter((s) => s.id !== id) }));
        try {
            const { error } = await supabase
                .from('didactic_sequences')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing sequence:', error);
        }
    }
}));
