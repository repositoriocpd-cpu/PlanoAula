import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const [installPrompt, setInstallPrompt] = React.useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = React.useState(false);

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setInstallPrompt(null);
            setShowInstallBanner(false);
        });
    };

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
        setShowInstallBanner(false);
    };

    if (!offlineReady && !needRefresh && !showInstallBanner) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom duration-300">

            {/* UPDATE PROMPT */}
            {needRefresh && (
                <div className="bg-white p-4 rounded-xl shadow-2xl border border-purple-100 flex items-center gap-4 max-w-sm">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">Atualização Disponível</h4>
                        <p className="text-xs text-gray-500">Nova versão do sistema detectada.</p>
                    </div>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition"
                    >
                        Atualizar
                    </button>
                    <button
                        onClick={close}
                        className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-600 transition"
                    >
                        Fechar
                    </button>
                </div>
            )}

            {/* OFFLINE READY PROMPT (Optional, keeps user informed) */}
            {offlineReady && (
                <div className="bg-white p-4 rounded-xl shadow-2xl border border-green-100 flex items-center gap-4 max-w-sm">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Download className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">Pronto para uso Offline</h4>
                        <p className="text-xs text-gray-500">O app foi salvo no seu dispositivo.</p>
                    </div>
                    <button onClick={close} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )
            }

            {/* INSTALL PROMPT */}
            {
                showInstallBanner && !needRefresh && (
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm text-white">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Download className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">Instalar PlanejaEdu</h4>
                            <p className="text-xs text-purple-200">Acesse mais rápido direto da sua tela.</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={handleInstallClick}
                                className="px-3 py-1.5 bg-white text-purple-900 text-xs font-bold rounded-lg hover:bg-purple-50 transition"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={close}
                                className="px-3 py-1.5 text-purple-300 text-xs hover:text-white transition"
                            >
                                Depois
                            </button>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
