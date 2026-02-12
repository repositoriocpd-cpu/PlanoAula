import { Calendar, Clock, ChevronRight, FileText, FileEdit, Trash2 } from 'lucide-react';
import type { LessonPlan } from '../../types/lesson';
import { exportLessonToPDF, exportLessonsToWord } from '../../services/exportService';

interface LessonListProps {
    plans: LessonPlan[];
    onSelect: (plan: LessonPlan) => void;
    onDelete?: (id: string) => void;
}

export function LessonList({ plans, onSelect, onDelete }: LessonListProps) {
    if (plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Nenhum plano criado ainda.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    onClick={() => onSelect(plan)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary cursor-pointer transition-all hover:shadow-md group"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 group-hover:text-primary line-clamp-1">{plan.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{plan.discipline} • {plan.grade}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        exportLessonToPDF(plan);
                                    }}
                                    className="p-1.5 text-rose-600 hover:bg-white rounded-lg transition-colors"
                                    title="PDF"
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        exportLessonsToWord([plan], `${plan.title.replace(/ /g, '_')}.docx`);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors"
                                    title="Word"
                                >
                                    <FileEdit className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(plan.id);
                                    }}
                                    className="p-1 px-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(plan.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {plan.duration}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
