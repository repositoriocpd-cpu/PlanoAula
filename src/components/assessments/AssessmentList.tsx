import { Calendar, Trash2 } from 'lucide-react';
import type { Assessment } from '../../types/assessment';

interface AssessmentListProps {
    assessments: Assessment[];
    onSelect: (assessment: Assessment) => void;
    onDelete: (id: string) => void;
}

export function AssessmentList({ assessments, onSelect, onDelete }: AssessmentListProps) {
    if (assessments.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <p>Nenhuma avaliação salva.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {assessments.map((assessment) => (
                <div
                    key={assessment.id}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onSelect(assessment)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                {assessment.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${assessment.type === 'Prova' ? 'bg-red-100 text-red-700' :
                                    assessment.type === 'Atividade' ? 'bg-blue-100 text-blue-700' :
                                        assessment.type === 'Rubrica' ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {assessment.type}
                                </span>
                                <span className="text-xs text-gray-500">{assessment.grade}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(assessment.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-1"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(assessment.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
