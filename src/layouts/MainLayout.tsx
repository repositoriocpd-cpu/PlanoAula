import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#FDFDFF] overflow-hidden">
            {/* Sidebar (Desktop fix, Mobile drawer) */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 relative">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FDFDFF] p-4 md:p-8 pb-32 md:pb-8">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>

                <BottomNav onMenuClick={() => setIsSidebarOpen(true)} />
            </div>
        </div>
    );
}
