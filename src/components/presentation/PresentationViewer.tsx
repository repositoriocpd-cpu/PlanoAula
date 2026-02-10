import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Download, Presentation as PresentationIcon, Edit3, Save, Check } from 'lucide-react';
import type { Presentation } from '../../types/presentation';
import { PresentationSlide } from './PresentationSlide';
import { exportJSONToPPTX } from '../../services/exportService';
import { presentationService } from '../../services/presentationService';

interface PresentationViewerProps {
    presentation: Presentation;
    onClose: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ presentation, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const viewerRef = useRef<HTMLDivElement>(null);

    const slides = presentation.content_json.slides;
    const totalSlides = slides.length;

    const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await presentationService.savePresentation(presentation);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Error saving presentation:', error);
            alert('Erro ao salvar apresentação. Verifique sua conexão.');
        } finally {
            setIsSaving(false);
        }
    };
    // ... rest of the component state ...
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const toggleFullscreen = () => {
        if (!viewerRef.current) return;
        if (!document.fullscreenElement) {
            viewerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const getThemeBackground = () => {
        switch (presentation.theme) {
            case 'kids-colorful': return 'bg-amber-50';
            case 'institutional': return 'bg-slate-100';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className={`fixed inset-0 z-[120] flex flex-col ${getThemeBackground()} animate-in fade-in duration-500`}>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <PresentationIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{presentation.title}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            {presentation.grade} • {presentation.discipline} • {presentation.theme.replace('-', ' ')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleFullscreen} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all text-gray-600">
                        <Maximize2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isSaved}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-lg ${isSaved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                            } disabled:opacity-70`}
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isSaved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? 'Salvando...' : isSaved ? 'Salvo!' : 'Salvar'}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-xs font-black uppercase text-gray-600 transition-all">
                        <Edit3 className="h-4 w-4" />
                        Editar
                    </button>
                    <button
                        onClick={() => exportJSONToPPTX(presentation, `Slides_${presentation.title.replace(/ /g, '_')}`)}
                        className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-lg shadow-amber-500/20"
                    >
                        <Download className="h-4 w-4" />
                        PPTX
                    </button>
                    <button onClick={onClose} className="p-3 bg-rose-100 hover:bg-rose-200 rounded-2xl transition-all text-rose-600 ml-4">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div ref={viewerRef} className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-hidden">
                <div className="relative aspect-video w-full max-w-[1200px] bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-white/50 ring-1 ring-black/5">
                    {/* Slide Area */}
                    <div className="flex-1 relative overflow-hidden">
                        {slides.map((slide, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${idx === currentSlide ? 'opacity-100 translate-x-0 scale-100' : idx < currentSlide ? 'opacity-0 -translate-x-full scale-95' : 'opacity-0 translate-x-full scale-105'}`}
                            >
                                <PresentationSlide slide={slide} theme={presentation.theme} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Overlays */}
                    <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/5 to-transparent">
                        <button onClick={prevSlide} disabled={currentSlide === 0} className="p-4 bg-white/90 backdrop-blur shadow-lg rounded-full disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronLeft className="h-8 w-8 text-primary" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/5 to-transparent">
                        <button onClick={nextSlide} disabled={currentSlide === totalSlides - 1} className="p-4 bg-white/90 backdrop-blur shadow-lg rounded-full disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronRight className="h-8 w-8 text-primary" />
                        </button>
                    </div>

                    {/* Progress Bar & Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-primary shadow-sm shadow-primary/30' : 'w-2 bg-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Slide {currentSlide + 1} de {totalSlides}
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual Toast - Branding */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-white/50 pointer-events-none">
                <span className="text-xs font-black text-primary uppercase tracking-tight">PlanejaEdu AI</span>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic leading-none">High Fidelity Slideshow</span>
            </div>
        </div>
    );
};
