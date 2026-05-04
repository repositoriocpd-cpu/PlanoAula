import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    BookOpen,
    Calendar,
    ListOrdered,
    FileCheck,
    BarChart,
    Library,
    LogOut,
    Home,
    Settings,
    X,
    Layers,
    ChevronRight
} from 'lucide-react';

const navigation = [
    { name: 'Início', href: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Aulas Diárias', href: '/daily-lessons', icon: BookOpen, color: 'text-purple-500' },
    { name: 'Plano Anual', href: '/annual-plan', icon: Calendar, color: 'text-emerald-500' },
    { name: 'Sequência Didática', href: '/didactic-sequence', icon: ListOrdered, color: 'text-amber-500' },
    { name: 'Avaliações', href: '/assessments', icon: FileCheck, color: 'text-rose-500' },
    { name: 'Relatório', href: '/reports', icon: BarChart, color: 'text-indigo-500' },
    { name: 'Recursos', href: '/resources', icon: Layers, color: 'text-violet-500' },
    { name: 'Biblioteca', href: '/library', icon: Library, color: 'text-teal-500' },
    { name: 'Configurações', href: '/settings', icon: Settings, color: 'text-slate-500' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (error) {
            navigate('/login', { replace: true });
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-100 h-full shadow-2xl z-[200] 
                transition-transform duration-500 ease-in-out md:static md:translate-x-0 md:shadow-sm
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-28 px-8 border-b border-gray-50/50">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
                                PlanejaEdu
                            </h1>
                            <span className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">Gestão Pedagógica</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-8 custom-scrollbar">
                        <ul className="space-y-2 px-4">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center px-5 py-3.5 text-sm font-bold rounded-[20px] transition-all duration-300 group ${isActive
                                                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon className={`mr-4 h-5 w-5 transition-transform duration-300 ${isActive ? 'text-white' : `${item.color} group-hover:scale-110`}`} />
                                                <span className="flex-1">{item.name}</span>
                                                {isActive && <ChevronRight size={14} className="opacity-60" />}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center justify-center w-full px-5 py-4 text-sm font-black text-white bg-gray-900 hover:bg-black rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-rose-500" />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
