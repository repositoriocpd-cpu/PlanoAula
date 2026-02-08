import React from 'react';
import { Bell, User } from 'lucide-react';

export function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Bem-vindo, Professor(a)
                </h2>
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Bell className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        P
                    </div>
                    <span className="text-sm font-medium text-gray-700">Professor Exemplo</span>
                </div>
            </div>
        </header>
    );
}
