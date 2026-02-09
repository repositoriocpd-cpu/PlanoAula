import { Calendar, Trash2 } from 'lucide-react';
import type { Report } from '../../types/report';

interface ReportListProps {
    reports: Report[];
    onSelect: (report: Report) => void;
    onDelete: (id: string) => void;
}

export function ReportList({ reports, onSelect, onDelete }: ReportListProps) {
    if (reports.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <p>Nenhum relatório salvo.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {reports.map((report) => (
                <div
                    key={report.id}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onSelect(report)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                                {report.studentName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {report.grade} • {report.period}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(report.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-1"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
