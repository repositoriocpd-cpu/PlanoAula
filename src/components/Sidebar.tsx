import { NavLink } from 'react-router-dom';
import {
    BookOpen,
    Calendar,
    ListOrdered,
    FileCheck,
    BarChart,
    Library,
    LogOut,
    Home,
    Settings
} from 'lucide-react';

const navigation = [
    { name: 'Início', href: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Aulas Diárias', href: '/daily-lessons', icon: BookOpen, color: 'text-purple-500' },
    { name: 'Plano Anual', href: '/annual-plan', icon: Calendar, color: 'text-emerald-500' },
    { name: 'Sequência Didática', href: '/didactic-sequence', icon: ListOrdered, color: 'text-amber-500' },
    { name: 'Avaliações', href: '/assessments', icon: FileCheck, color: 'text-rose-500' },
    { name: 'Relatório', href: '/reports', icon: BarChart, color: 'text-indigo-500' },
    { name: 'Biblioteca', href: '/library', icon: Library, color: 'text-teal-500' },
    { name: 'Configurações', href: '/settings', icon: Settings, color: 'text-slate-500' },
];

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        console.log('Sidebar: handleSignOut triggered');
        try {
            await signOut();
            console.log('Sidebar: signOut successful, navigating to login...');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Sidebar: Error signing out:', error);
            // Even on error, try to redirect if the state might be inconsistent
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-100 h-full shadow-sm z-10">
            <div className="flex flex-col items-center justify-center h-28 border-b border-gray-50/50">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight text-center px-2">
                    PlanejaEdu
                </h1>
                <span className="text-xs font-bold text-gray-400 mt-1 tracking-[0.2em] uppercase">SMEDU</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <ul className="space-y-1.5 px-3">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary/10 text-primary shadow-sm backdrop-blur-md border border-primary/10'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={`mr-3 h-5 w-5 transition-colors duration-300 ${isActive ? 'text-primary' : `${item.color} opacity-70 group-hover:opacity-100`}`} />
                                        <span className="relative">
                                            {item.name}
                                            {isActive && <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full" />}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:via-rose-600 hover:to-pink-600 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sair do Sistema
                </button>
            </div>
        </div>
    );
}
