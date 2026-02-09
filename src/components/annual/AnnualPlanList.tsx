import { Calendar, Trash2, FileText, FileEdit } from 'lucide-react';
import type { AnnualPlan } from '../../types/annualPlan';
import { exportAnnualPlanToPDF, exportAnnualPlansToWord } from '../../services/exportService';

interface AnnualPlanListProps {
    plans: AnnualPlan[];
    onSelect: (plan: AnnualPlan) => void;
    onDelete: (id: string) => void; // Added onDelete directly here for convenience
}

export function AnnualPlanList({ plans, onSelect, onDelete }: AnnualPlanListProps) {
    if (plans.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <p>Nenhum plano anual salvo.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onSelect(plan)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                                {plan.discipline}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {plan.grade}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        exportAnnualPlanToPDF(plan);
                                    }}
                                    className="p-1.5 text-rose-600 hover:bg-white rounded-lg transition-colors"
                                    title="PDF"
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        exportAnnualPlansToWord([plan], `Plano_Anual_${plan.discipline}.docx`);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors"
                                    title="Word"
                                >
                                    <FileEdit className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(plan.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-1"
                                title="Excluir"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
