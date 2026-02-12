import { useEffect, useState } from 'react';
import { X, Share, Download } from 'lucide-react';

export function InstallBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
        const isAndroid = /android/.test(userAgent);

        if (isIos) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://');

        // Check dismissal persistence
        const lastDismissed = localStorage.getItem('pwa-banner-dismissed');
        const sessionDismissed = sessionStorage.getItem('pwa-banner-session-dismissed');
        const isDismissed = lastDismissed === 'true' || sessionDismissed === 'true';

        // Listen for internal prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (!isStandalone && !isDismissed) {
                setIsVisible(true);
            }
        };

        // Listen for service worker updates
        const updateHandler = () => {
            setIsUpdate(true);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('sw-update-available', updateHandler);

        // Fallback for iOS detection after a delay, only if not standalone and not dismissed
        if (isIos && !isStandalone && !isDismissed) {
            const timer = setTimeout(() => setIsVisible(true), 4000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('beforeinstallprompt', handler);
                window.removeEventListener('sw-update-available', updateHandler);
            };
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('sw-update-available', updateHandler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isUpdate) {
            // Service worker controllerchange will handle the reload
            window.location.reload();
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsVisible(false);
            }
            setDeferredPrompt(null);
        } else if (platform === 'android') {
            alert('Para instalar: Clique nos 3 pontinhos do Chrome e selecione "Instalar Aplicativo"');
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Persist dismissal for the current session to avoid annoying the user
        sessionStorage.setItem('pwa-banner-session-dismissed', 'true');
        // If it's a fixed dismissal (e.g. they really don't want it), we could use localStorage
        // For now, session storage is safer to ensure they see updates in new sessions
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[9999] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] p-4 flex items-center gap-4 relative overflow-hidden">
                {/* Visual Polish */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />

                {/* App Icon with Ring */}
                <div className="relative">
                    <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-primary via-secondary to-amber-400 shadow-lg">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
                            <img src="/pwa-icon.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-extrabold text-sm tracking-tight leading-4">PlanejaEdu App</h3>
                    <p className="text-gray-500 text-[11px] font-medium leading-3 mt-1 line-clamp-2">
                        {isUpdate
                            ? "Nova versão disponível!"
                            : platform === 'ios'
                                ? "Compartilhar > Tela de Início"
                                : "Instale para acesso instantâneo"}
                    </p>
                </div>

                {/* Action Area */}
                <div className="flex items-center gap-1">
                    {platform === 'ios' && !isUpdate ? (
                        <div className="flex flex-col items-center justify-center bg-primary/5 p-2 rounded-2xl text-primary">
                            <Share size={20} className="animate-bounce" />
                        </div>
                    ) : (
                        <button
                            onClick={handleInstallClick}
                            className="bg-gray-900 text-white px-4 py-2.5 rounded-2xl font-black text-xs hover:bg-black active:scale-90 transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                        >
                            <Download size={14} /> {isUpdate ? "Atualizar" : "Instalar"}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss();
                        }}
                        className="relative z-10 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
