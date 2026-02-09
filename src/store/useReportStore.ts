import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Report } from '../types/report';

interface ReportStore {
    reports: Report[];
    isLoading: boolean;
    fetchReports: () => Promise<void>;
    addReport: (report: Report) => Promise<void>;
    removeReport: (id: string) => Promise<void>;
    updateHeaderColor: (id: string, color: string) => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
    reports: [],
    isLoading: false,

    fetchReports: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching reports for user:', user?.id);

            if (!user) {
                console.warn('No user found during fetchReports');
                set({ reports: [] });
                return;
            }

            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching reports:', error);
                throw error;
            }

            const formattedReports: Report[] = (data || []).map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                studentName: item.student_name,
                grade: item.grade,
                period: item.period,
                content: item.content,
                createdAt: item.created_at,
                headerColor: item.header_color
            }));

            set({ reports: formattedReports });
        } catch (error) {
            console.error('Error fetching reports catch block:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addReport: async (report) => {
        console.log('Adding report to store and Supabase:', report.id);
        set((state) => ({ reports: [report, ...state.reports] }));
        try {
            const { data, error } = await supabase
                .from('reports')
                .insert({
                    id: report.id,
                    user_id: report.userId,
                    student_name: report.studentName,
                    grade: report.grade,
                    period: report.period,
                    content: report.content,
                    header_color: report.headerColor,
                    created_at: report.createdAt
                })
                .select();

            if (error) {
                console.error('Supabase error adding report:', error);
                throw error;
            }
            console.log('Report added successfully to Supabase:', data);
        } catch (error) {
            console.error('Error adding report catch block:', error);
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
    },

    updateHeaderColor: async (id, color) => {
        set((state) => ({
            reports: state.reports.map((r) =>
                r.id === id ? { ...r, headerColor: color } : r
            )
        }));

        try {
            const { error } = await supabase
                .from('reports')
                .update({ header_color: color })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating header color:', error);
        }
    }
}));
