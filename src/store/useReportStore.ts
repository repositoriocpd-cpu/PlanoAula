import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Report } from '../types/report';

interface ReportStore {
    reports: Report[];
    isLoading: boolean;
    fetchReports: () => Promise<void>;
    addReport: (report: Report) => Promise<void>;
    removeReport: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
    reports: [],
    isLoading: false,

    fetchReports: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedReports: Report[] = (data || []).map(item => ({
                id: item.id,
                studentName: item.student_name,
                grade: item.grade,
                period: item.period,
                content: item.content,
                createdAt: item.created_at
            }));

            set({ reports: formattedReports });
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addReport: async (report) => {
        set((state) => ({ reports: [report, ...state.reports] }));
        try {
            const { error } = await supabase
                .from('reports')
                .insert({
                    id: report.id,
                    student_name: report.studentName,
                    grade: report.grade,
                    period: report.period,
                    content: report.content,
                    created_at: report.createdAt
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error adding report:', error);
        }
    },

    removeReport: async (id) => {
        set((state) => ({ reports: state.reports.filter((r) => r.id !== id) }));
        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing report:', error);
        }
    }
}));
