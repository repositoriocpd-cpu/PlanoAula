import React, { useState } from 'react';
import { X, FileText, File as FileIcon, Presentation, Layout, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VisualMindMap } from './VisualMindMap';
import { exportMarkdownToPDF, exportMarkdownToWord, exportMarkdownToPPTX } from '../../services/exportService';

interface ResourceViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    type: string;
}

import { Maximize2, Minimize2 } from 'lucide-react';

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
    isOpen, onClose, title, content, type
}) => {
    const [viewMode, setViewMode] = useState<'text' | 'visual'>(type === 'mapas_mentais' || type === 'apresentacoes' ? 'visual' : 'text');
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!isOpen) return null;

    const handleExportPDF = () => {
        exportMarkdownToPDF(title, content, `Recurso_${type}_${title.replace(/ /g, '_')}`);
    };

    const handleExportWord = () => {
        exportMarkdownToWord(title, content, `Recurso_${type}_${title.replace(/ /g, '_')}`);
    };

    const handleExportSlides = () => {
        exportMarkdownToPPTX(title, content, `Apresentacao_${title.replace(/ /g, '_')}`);
    };

    const isVisualSupported = type === 'mapas_mentais';

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 ${isFullscreen ? 'p-0' : 'p-4'}`}>
            <div className={`bg-white w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${isFullscreen ? 'h-full rounded-none max-w-none max-h-none' : 'max-w-5xl max-h-[90vh]'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{title}</h3>
                            <p className="text-sm text-gray-500 font-medium tracking-wide italic">Recurso Pedagógico Inteligente</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isVisualSupported && (
                            <>
                                <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                                    <button
                                        onClick={() => setViewMode('text')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'text' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <List className="h-3.5 w-3.5" />
                                        Texto
                                    </button>
                                    <button
                                        onClick={() => setViewMode('visual')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'visual' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Layout className="h-3.5 w-3.5" />
                                        Visual
                                    </button>
                                </div>
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                    title={isFullscreen ? "Restaurar" : "Tela Cheia"}
                                >
                                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto p-8 ${isFullscreen && viewMode === 'visual' ? 'p-0 overflow-hidden' : ''}`}>
                    {type === 'mapas_mentais' && viewMode === 'visual' ? (
                        <div className="h-full w-full">
                            <VisualMindMap markdown={content} />
                        </div>
                    ) : (
                        <div className="prose prose-slate max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Footer / Actions - Hide in Fullscreen Visual Mode for Immersion */}
                {!(isFullscreen && viewMode === 'visual') && (
                    <div className="p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                        <div className="flex gap-3">
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                <FileIcon className="h-4 w-4" />
                                Exportar PDF
                            </button>
                            <button
                                onClick={handleExportWord}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                <FileText className="h-4 w-4" />
                                Exportar Word
                            </button>
                            {type === 'apresentacoes' && (
                                <button
                                    onClick={handleExportSlides}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                                >
                                    <Presentation className="h-4 w-4" />
                                    Exportar Slides
                                </button>
                            )}
                        </div>
                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            PlanejaEdu AI • Inteligência Pedagógica
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
