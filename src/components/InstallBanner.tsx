import React, { useState, useEffect } from 'react';
import { X, Share, ChevronRight, Download, Smartphone } from 'lucide-react';

export function InstallBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIos) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://');

        if (!isStandalone) {
            // Delay banner visibility for better UX
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }

        // Android native prompt listener
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        });

    }, []);

    const handleAndroidInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[9999] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden group">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors duration-700" />

                {/* App Icon */}
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                            <img src="/pwa-icon.png" alt="PlanejaEdu" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-gray-900 font-black text-base leading-tight">Instalar PlanejaEdu</h3>
                    <p className="text-gray-500 text-[13px] leading-snug mt-0.5">
                        {platform === 'ios'
                            ? "Toque em Compartilhar > Adicionar à Tela de Início"
                            : "Acesse mais rápido direto da sua tela inicial"}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {platform === 'android' ? (
                        <button
                            onClick={handleAndroidInstall}
                            className="bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 active:scale-95 transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                        >
                            <Download size={16} /> Instalar
                        </button>
                    ) : platform === 'ios' ? (
                        <div className="bg-gray-100 p-2 rounded-xl text-purple-600 animate-pulse">
                            <Share size={20} />
                        </div>
                    ) : (
                        <Smartphone className="text-gray-300" />
                    )}

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
