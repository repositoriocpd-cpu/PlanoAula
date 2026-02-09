import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { DidacticSequence } from '../types/sequence';

interface SequenceStore {
    sequences: DidacticSequence[];
    isLoading: boolean;
    fetchSequences: () => Promise<void>;
    addSequence: (sequence: DidacticSequence) => Promise<void>;
    removeSequence: (id: string) => Promise<void>;
    updateHeaderColor: (id: string, color: string) => Promise<void>;
}

export const useSequenceStore = create<SequenceStore>((set) => ({
    sequences: [],
    isLoading: false,

    fetchSequences: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching sequences for user:', user?.id);

            if (!user) {
                console.warn('No user found during fetchSequences');
                set({ sequences: [] });
                return;
            }

            const { data, error } = await supabase
                .from('didactic_sequences')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching sequences:', error);
                throw error;
            }

            const formattedSequences: DidacticSequence[] = (data || []).map(item => ({
                id: item.id,
                userId: item.user_id,
                theme: item.theme,
                numClasses: item.num_classes,
                createdAt: item.created_at,
                objectives: item.objectives,
                bnccSkills: item.bncc_skills,
                classes: item.classes,
                finalEvaluation: item.final_evaluation,
                headerColor: item.header_color
            }));

            set({ sequences: formattedSequences });
        } catch (error) {
            console.error('Error fetching sequences catch block:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addSequence: async (sequence) => {
        console.log('Adding sequence to store and Supabase:', sequence.id);
        set((state) => ({ sequences: [sequence, ...state.sequences] }));
        try {
            const { data, error } = await supabase
                .from('didactic_sequences')
                .insert({
                    id: sequence.id,
                    user_id: sequence.userId,
                    theme: sequence.theme,
                    num_classes: sequence.numClasses,
                    objectives: sequence.objectives,
                    bncc_skills: sequence.bnccSkills,
                    classes: sequence.classes,
                    final_evaluation: sequence.finalEvaluation,
                    header_color: sequence.headerColor,
                    created_at: sequence.createdAt
                })
                .select();

            if (error) {
                console.error('Supabase error adding sequence:', error);
                throw error;
            }
            console.log('Sequence added successfully to Supabase:', data);
        } catch (error) {
            console.error('Error adding sequence catch block:', error);
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
    },

    updateHeaderColor: async (id, color) => {
        set((state) => ({
            sequences: state.sequences.map((s) =>
                s.id === id ? { ...s, headerColor: color } : s
            )
        }));

        try {
            const { error } = await supabase
                .from('didactic_sequences')
                .update({ header_color: color })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating header color:', error);
        }
    }
}));
