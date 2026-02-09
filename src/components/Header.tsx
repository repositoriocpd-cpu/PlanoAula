import { Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
    const { user, profile } = useAuth();

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Professor(a)';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Bem-vindo, {displayName.split(' ')[0]}
                </h2>
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Bell className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold border border-purple-200">
                        {initial}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">{displayName}</span>
                </div>
            </div>
        </header>
    );
}
