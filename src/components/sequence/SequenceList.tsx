import { Calendar, Trash2 } from 'lucide-react';
import type { DidacticSequence } from '../../types/sequence';

interface SequenceListProps {
    sequences: DidacticSequence[];
    onSelect: (sequence: DidacticSequence) => void;
    onDelete: (id: string) => void;
}

export function SequenceList({ sequences, onSelect, onDelete }: SequenceListProps) {
    if (sequences.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <p>Nenhuma sequência didática salva.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {sequences.map((sequence) => (
                <div
                    key={sequence.id}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onSelect(sequence)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                {sequence.theme}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {sequence.numClasses} aulas
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(sequence.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-1"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(sequence.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
