import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BookOpen,
    Calendar,
    ListOrdered,
    FileCheck,
    BarChart,
    Library,
    LogOut,
    Home
} from 'lucide-react';

const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Aulas Diárias', href: '/daily-lessons', icon: BookOpen },
    { name: 'Plano Anual', href: '/annual-plan', icon: Calendar },
    { name: 'Sequência Didática', href: '/didactic-sequence', icon: ListOrdered },
    { name: 'Avaliações', href: '/assessments', icon: FileCheck },
    { name: 'Relatório', href: '/reports', icon: BarChart },
    { name: 'Biblioteca', href: '/library', icon: Library },
];

export function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-100 h-full shadow-sm z-10">
            <div className="flex items-center justify-center h-20">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight">Plano Pronto.</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-4">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:pl-5'
                                    }`
                                }
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${item.name === 'Início' ? '' : ''}`} />
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-6 border-t border-gray-100">
                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5">
                    <LogOut className="mr-2 h-5 w-5" />
                    Sair
                </button>
            </div>
        </div>
    );
}
