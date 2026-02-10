import React, { useState } from 'react';
import { Presentation as PresentationIcon, X, Loader2, Sparkles, Clock, Palette } from 'lucide-react';
import type { PresentationTheme } from '../../types/presentation';
import { presentationService } from '../../services/presentationService';

interface PresentationGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        title: string;
        grade: string;
        discipline: string;
        content: string;
    };
    onGenerated: (content: any) => void;
}

export const PresentationGeneratorModal: React.FC<PresentationGeneratorModalProps> = ({
    isOpen, onClose, initialData, onGenerated
}) => {
    const [theme, setTheme] = useState<PresentationTheme>('clean-modern');
    const [duration, setDuration] = useState<5 | 10 | 15>(10);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const content = await presentationService.generatePresentation({
                ...initialData,
                theme,
                duration,
                baseContext: initialData.content
            });
            onGenerated(content);
            onClose();
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Falha ao gerar apresentação. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <PresentationIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">IA Slideshow</h3>
                            <p className="text-sm text-gray-500 font-medium italic">Estilo Gamma e Boardmix</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Theme Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-700 font-bold uppercase text-xs tracking-widest">
                            <Palette className="h-4 w-4 text-primary" />
                            Estilo Visual
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ThemeOption
                                selected={theme === 'clean-modern'}
                                onClick={() => setTheme('clean-modern')}
                                title="Clean Moderno"
                                desc="Fundo branco, minimalista, foco no conteúdo"
                                icon="✨"
                            />
                            <ThemeOption
                                selected={theme === 'kids-colorful'}
                                onClick={() => setTheme('kids-colorful')}
                                title="Colorido Infantil"
                                desc="Elementos lúdicos, vibrante e didático"
                                icon="🎨"
                            />
                            <ThemeOption
                                selected={theme === 'institutional'}
                                onClick={() => setTheme('institutional')}
                                title="Institucional"
                                desc="Azul e branco, sóbrio e profissional"
                                icon="🏛️"
                            />
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-700 font-bold uppercase text-xs tracking-widest">
                            <Clock className="h-4 w-4 text-primary" />
                            Duração Estimada
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-2xl">
                            {[5, 10, 15].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d as any)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${duration === d ? 'bg-white text-primary shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {d} min
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Construindo Slides...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Gerar Apresentação
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-[0.2em]">
                        IA de Alta Fidelidade • Máximo 9 Slides
                    </p>
                </div>
            </div>
        </div>
    );
};

const ThemeOption: React.FC<{ selected: boolean, onClick: () => void, title: string, desc: string, icon: string }> = ({
    selected, onClick, title, desc, icon
}) => (
    <button
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selected ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
    >
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
                <h4 className={`text-sm font-black uppercase ${selected ? 'text-primary' : 'text-gray-700'}`}>{title}</h4>
                <p className="text-xs text-gray-500 font-medium">{desc}</p>
            </div>
        </div>
    </button>
);
