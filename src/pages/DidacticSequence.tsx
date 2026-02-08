import React, { useState } from 'react';
import { SequenceForm } from '../components/sequence/SequenceForm';
import { SequenceViewer } from '../components/sequence/SequenceViewer';
import { generateDidacticSequence } from '../services/aiGenerator';
import type { DidacticSequence as SequenceType, SequenceFormData } from '../types/sequence';

export function DidacticSequence() {
    const [currentSequence, setCurrentSequence] = useState<SequenceType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (data: SequenceFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const sequence = await generateDidacticSequence(data);
            setCurrentSequence(sequence);
        } catch (err) {
            setError('Erro ao gerar sequência. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Sequência Didática</h1>

            <div className="flex-1 overflow-hidden">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                {currentSequence ? (
                    <SequenceViewer
                        sequence={currentSequence}
                        onBack={() => setCurrentSequence(null)}
                    />
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <SequenceForm onSubmit={handleGenerate} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
}
