import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ListOrdered, FileCheck, BarChart, Library, ArrowRight } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Aulas Diárias',
            description: 'Planeje suas aulas dia a dia com facilidade.',
            icon: BookOpen,
            path: '/daily-lessons',
            color: 'from-pink-500 to-rose-500'
        },
        {
            title: 'Plano Anual',
            description: 'Organize o currículo de todo o ano letivo.',
            icon: Calendar,
            path: '/annual-plan',
            color: 'from-violet-600 to-purple-600'
        },
        {
            title: 'Sequência Didática',
            description: 'Crie sequências de atividades conectadas.',
            icon: ListOrdered,
            path: '/didactic-sequence',
            color: 'from-cyan-500 to-blue-500'
        },
        {
            title: 'Avaliações',
            description: 'Gere avaliações e rubricas alinhadas à BNCC.',
            icon: FileCheck,
            path: '/assessments',
            color: 'from-orange-500 to-amber-500'
        },
        {
            title: 'Relatórios',
            description: 'Pareceres descritivos individuais dos alunos.',
            icon: BarChart,
            path: '/reports',
            color: 'from-emerald-500 to-green-500'
        },
        {
            title: 'Biblioteca',
            description: 'Explore recursos e materiais de apoio.',
            icon: Library,
            path: '/library',
            color: 'from-indigo-500 to-blue-600'
        }
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>

                <div className="z-10 md:w-1/2">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                        Plataforma de Planejamento
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        Transforme seu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Planejamento</span> e seu Futuro
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 max-w-md">
                        Nossas ferramentas de IA foram desenvolvidas para agilizar sua rotina pedagógica, permitindo que você foque no que importa: ensinar.
                    </p>
                    <button
                        onClick={() => navigate('/daily-lessons')}
                        className="bg-primary hover:bg-violet-700 text-white font-medium py-3 px-8 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 flex items-center"
                    >
                        Começar Agora
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>

                <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 relative z-10">
                    {/* Abstract Representation of "Teacher/Future" using shapes/icons since we don't have the image */}
                    <div className="relative w-64 h-64 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
                        <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center opacity-90 backdrop-blur-sm">
                            <BookOpen className="h-24 w-24 text-primary" />
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -bottom-4 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 animate-bounce delay-1000">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <BarChart className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Relatórios</p>
                                    <p className="font-bold text-gray-800">Gerados com IA</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 animate-bounce">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-100 rounded-full">
                                    <FileCheck className="h-6 w-6 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">BNCC</p>
                                    <p className="font-bold text-gray-800">100% Alinhado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Essenciais</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.title}
                            onClick={() => navigate(module.path)}
                            className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-20 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-bl-full transform translate-x-10 -translate-y-10`}></div>

                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                <module.icon className="h-7 w-7 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{module.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {module.description}
                            </p>

                            <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
                                Acessar <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
