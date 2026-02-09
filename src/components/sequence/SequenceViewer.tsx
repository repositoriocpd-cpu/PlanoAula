import { FileText, FileEdit, ArrowLeft } from 'lucide-react';
import { FormattedText } from '../ui/FormattedText';
import type { DidacticSequence } from '../../types/sequence';
import { exportSequenceToPDF, exportSequencesToWord } from '../../services/exportService';

interface SequenceViewerProps {
    sequence: DidacticSequence;
    onBack: () => void;
}

export function SequenceViewer({ sequence, onBack }: SequenceViewerProps) {

    const handleDownloadPDF = () => {
        exportSequenceToPDF(sequence);
    };

    const handleDownloadWord = () => {
        exportSequencesToWord([sequence], `Sequencia_${sequence.theme.replace(/ /g, '_')}.docx`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-gray-900 font-bold text-sm bg-gray-100/50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </button>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner border border-gray-200/50">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center space-x-2 px-4 py-2.5 text-rose-600 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-300 group"
                        title="Baixar PDF"
                    >
                        <div className="p-1 px-1.5 bg-rose-50 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black tracking-tight">PDF</span>
                    </button>
                    <button
                        onClick={handleDownloadWord}
                        className="flex items-center space-x-2 px-4 py-2.5 text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-300 group"
                        title="Baixar Word"
                    >
                        <div className="p-1 px-1.5 bg-blue-50 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                            <FileEdit className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black tracking-tight">Word</span>
                    </button>
                </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl font-bold text-primary mb-2">{sequence.theme}</h1>
                <p className="text-gray-600 mb-6">{sequence.numClasses} Aulas Previstas</p>

                <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Objetivos</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {sequence.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    {sequence.classes.map((c) => (
                        <div key={c.classNumber} className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                                    AULA {c.classNumber}
                                </span>
                                <h4 className="font-bold text-gray-800">{c.topic}</h4>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Atividades</h5>
                                    <ul className="list-disc pl-4 text-sm text-gray-700 mt-1">
                                        {c.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recursos</h5>
                                    <ul className="list-disc pl-4 text-sm text-gray-700 mt-1">
                                        {c.resources.map((res, i) => <li key={i}>{res}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Avaliação Final Sugerida</h3>
                    <FormattedText text={sequence.finalEvaluation} className="text-gray-700" />
                </div>
            </div>
        </div>
    );
}
