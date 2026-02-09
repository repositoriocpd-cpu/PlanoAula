import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ListOrdered, FileCheck, BarChart, Library, ArrowRight, ChevronRight } from 'lucide-react';

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
        <div className="space-y-10">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[40px] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 z-0 group-hover:bg-primary/10 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -ml-20 -mb-20 z-0 group-hover:bg-secondary/10 transition-colors duration-1000" />

                <div className="z-10 md:w-3/5 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/5 text-primary text-xs font-black mb-6 border border-primary/5">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        NOVA INTELIGÊNCIA PEDAGÓGICA
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                        Seu Tempo é <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-secondary animate-gradient-x">Precioso</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg mb-10 max-w-lg leading-relaxed">
                        Esqueça a burocracia. Use nossa IA para criar planos de aula, avaliações e relatórios em segundos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => navigate('/daily-lessons')}
                            className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                            Criar Agora
                            <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/library')}
                            className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-10 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 active:scale-95"
                        >
                            Explorar BNCC
                        </button>
                    </div>
                </div>

                <div className="md:w-2/5 flex justify-center mt-12 md:mt-0 relative z-10 scale-90 md:scale-100">
                    <div className="relative w-72 h-72">
                        {/* Animated Ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />

                        <div className="absolute inset-4 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl p-1">
                            <div className="w-full h-full bg-white/95 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BookOpen className="h-28 w-28 text-primary opacity-90" />
                            </div>
                        </div>

                        {/* Floating Cards - Improved for Mobile */}
                        <div className="absolute -bottom-6 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white animate-float">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
                                    <BarChart className="h-5 w-5 text-white" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IA Reports</p>
                                    <p className="font-extrabold text-gray-900">Pareceres</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-6 -right-12 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white animate-float-delayed">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20">
                                    <FileCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BNCC 2026</p>
                                    <p className="font-extrabold text-gray-900">Alinhado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <div>
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Ferramentas Mágicas</h2>
                        <p className="text-gray-500 font-medium">Selecione o que deseja construir hoje</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.title}
                            onClick={() => navigate(module.path)}
                            className="group bg-white rounded-[32px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-24 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 rounded-bl-full transform translate-x-10 -translate-y-10`} />

                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6 shadow-xl shadow-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                <module.icon className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors">{module.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {module.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 group-hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                                    Abrir Módulo <ArrowRight className="h-3 w-3" />
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Add ChevronRight to imports at top (I'll do this in a single edit if possible or second call)
import { ChevronRight as ChevronRightIcon } from 'lucide-react';
    );
}
