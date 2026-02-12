import React from 'react';
import type { Slide, PresentationTheme } from '../../types/presentation';
import { Presentation as PresentationIcon, CheckCircle } from 'lucide-react';

interface PresentationSlideProps {
    slide: Slide;
    theme: PresentationTheme;
}

export const PresentationSlide: React.FC<PresentationSlideProps> = ({ slide, theme }) => {
    const getThemeClasses = () => {
        switch (theme) {
            case 'kids-colorful':
                return {
                    container: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
                    headline: 'font-["Outfit"] text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] to-[#F59E0B] drop-shadow-sm',
                    bullet: 'bg-white/80 backdrop-blur-sm border-[#FCD34B] text-[#92400E] shadow-sm hover:scale-[1.02] transition-transform',
                    icon: 'text-[#F59E0B]',
                    accent: 'bg-[#F59E0B]/10 rounded-full'
                };
            case 'institutional':
                return {
                    container: 'bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] text-[#0F172A] border-[#E2E8F0]',
                    headline: 'font-["Inter"] text-4xl font-extrabold text-[#1E3A8A] tracking-tight border-b-4 border-[#1E3A8A] pb-2',
                    bullet: 'bg-white shadow-sm border-[#E2E8F0] text-[#334155] border-l-4 border-l-[#1E3A8A]',
                    icon: 'text-[#2563EB]',
                    accent: 'bg-[#1E3A8A] text-white'
                };
            default: // clean-modern
                return {
                    container: 'bg-white text-slate-800 border-gray-100',
                    headline: 'font-["Inter"] text-5xl font-black text-slate-900 tracking-tighter',
                    bullet: 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:shadow-lg transition-all',
                    icon: 'text-primary',
                    accent: 'bg-primary/5'
                };
        }
    };

    const classes = getThemeClasses();

    const renderTextWithBold = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-black text-inherit">{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    const renderContent = () => {
        switch (slide.type) {
            case 'title':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                        <div className={`p-8 rounded-[40px] ${classes.container} border-4 shadow-2xl relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <PresentationIcon className={`h-20 w-20 ${classes.icon} relative z-10`} />
                        </div>
                        <div className="space-y-4">
                            <h1 className={classes.headline}>{renderTextWithBold(slide.headline)}</h1>
                            <div className="h-1.5 w-24 bg-current mx-auto rounded-full opacity-20" />
                            <p className="text-2xl font-medium opacity-60 tracking-wide max-w-2xl">{renderTextWithBold(slide.subheadline || '')}</p>
                        </div>
                    </div>
                );
            case 'bullets':
                return (
                    <div className="flex flex-col h-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h2 className={classes.headline}>{renderTextWithBold(slide.headline)}</h2>
                        <div className="grid grid-cols-1 gap-4 flex-1">
                            {slide.bullets?.map((bullet, idx) => (
                                <div key={idx} className={`flex items-start gap-5 p-6 rounded-[32px] border-2 ${classes.bullet} animate-in slide-in-from-left duration-500`} style={{ animationDelay: `${idx * 150}ms` }}>
                                    <div className={`mt-1.5 h-3 w-3 rounded-full ${classes.icon} bg-current shadow-lg shadow-current/20`} />
                                    <p className="text-xl font-bold leading-relaxed">{renderTextWithBold(bullet || '')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'image_caption':
                return (
                    <div className="grid grid-cols-2 h-full gap-12 items-center animate-in fade-in duration-700">
                        <div className="space-y-8 text-left">
                            <h2 className={classes.headline}>{renderTextWithBold(slide.headline)}</h2>
                            <div className={`p-8 rounded-[40px] ${classes.bullet} border-2 shadow-inner`}>
                                <p className="text-2xl font-medium leading-relaxed italic opacity-80 decoration-primary/30">
                                    "{renderTextWithBold(slide.caption || slide.subheadline || '')}"
                                </p>
                            </div>
                        </div>
                        <div className="h-full relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-[50px] blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />
                            <div className="h-full w-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative">
                                <img
                                    src={slide.image_url && slide.image_url !== 'PLACEHOLDER' ? slide.image_url : `https://pollinations.ai/p/${encodeURIComponent(slide.headline + ' education photorealistic')}?width=800&height=600&nologo=true`}
                                    alt={slide.headline}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        </div>
                    </div>
                );
            case 'two_columns':
                return (
                    <div className="flex flex-col h-full space-y-10 animate-in fade-in duration-700">
                        <h2 className={classes.headline}>{renderTextWithBold(slide.headline)}</h2>
                        <div className="grid grid-cols-2 gap-8 flex-1">
                            <div className={`p-8 rounded-[40px] border-2 ${classes.bullet} flex flex-col`}>
                                <ul className="space-y-6">
                                    {slide.column_left?.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 items-start text-lg font-bold">
                                            <CheckCircle className={`h-6 w-6 ${classes.icon} shrink-0`} />
                                            {renderTextWithBold(item || '')}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`p-8 rounded-[40px] border-2 ${classes.bullet} flex flex-col`}>
                                <ul className="space-y-6">
                                    {slide.column_right?.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 items-start text-lg font-bold">
                                            <div className={`mt-2 h-2 w-2 rounded-full ${classes.icon} bg-current shrink-0`} />
                                            {renderTextWithBold(item || '')}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'summary':
                return (
                    <div className="flex flex-col h-full items-center justify-center space-y-10 text-center max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
                        <div className={`p-8 rounded-full ${classes.accent} mb-4 shadow-xl`}>
                            <CheckCircle className={`h-24 w-24 ${classes.icon}`} />
                        </div>
                        <h2 className={`${classes.headline} border-none`}>{renderTextWithBold(slide.headline)}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {slide.bullets?.map((bullet, idx) => (
                                <div key={idx} className={`p-6 rounded-[28px] border-2 ${classes.bullet} font-bold text-lg shadow-sm hover:translate-y-[-4px] transition-all`}>
                                    {renderTextWithBold(bullet || '')}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30">
                        <PresentationIcon className="h-24 w-24" />
                        <p className="text-xl font-black uppercase tracking-widest">Slide em Construção</p>
                    </div>
                );
        }
    };

    return (
        <div className={`w-full h-full p-12 transition-all duration-500 overflow-hidden`}>
            {renderContent()}
        </div>
    );
};
