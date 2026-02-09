import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Menu } from 'lucide-react';

interface BottomNavProps {
    onMenuClick: () => void;
}

export function BottomNav({ onMenuClick }: BottomNavProps) {
    const navItems = [
        { name: 'Início', href: '/', icon: Home },
        { name: 'Aulas', href: '/daily-lessons', icon: BookOpen },
        { name: 'Anual', href: '/annual-plan', icon: Calendar },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-gray-100 px-6 py-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 transition-all duration-300 ${isActive
                                ? 'text-primary scale-110'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                                {isActive && (
                                    <div className="w-1 h-1 bg-primary rounded-full absolute -bottom-2" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
                </button>
            </div>
        </nav>
    );
}
