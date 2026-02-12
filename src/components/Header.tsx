import { Menu, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, profile } = useAuth();

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Professor(a)';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="md:hidden">
                    <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">PlanejaEdu</h1>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Olá, <span className="text-primary">{profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-sm text-gray-500">Bem-vindo ao PlanejaEdu AI</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                    <div className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        {profile?.full_name ? (
                            <span className="text-primary font-black text-sm md:text-base">{initial}</span>
                        ) : (
                            <User className="h-5 w-5 text-primary/60" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
