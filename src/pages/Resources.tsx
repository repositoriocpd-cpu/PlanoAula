import { useState } from 'react';
import { 
    Search, 
    Sparkles, 
    FileText, 
    Pencil, 
    ClipboardCheck, 
    Accessibility, 
    Gamepad2, 
    Network, 
    MonitorPlay, 
    UserCheck, 
    ListTodo, 
    Layers, 
    ListChecks, 
    Video 
} from 'lucide-react';

export function Resources() {
    const [searchQuery, setSearchQuery] = useState('');

    const resources = [
        { id: 'planejamento', name: 'PLANEJAMENTO', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { id: 'atividades', name: 'ATIVIDADES', icon: Pencil, color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { id: 'avaliacoes', name: 'AVALIAÇÕES', icon: ClipboardCheck, color: 'text-rose-500', bgColor: 'bg-rose-50' },
        { id: 'inclusao', name: 'INCLUSÃO', icon: Accessibility, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { id: 'jogos', name: 'JOGOS PEDAGÓGICOS', icon: Gamepad2, color: 'text-amber-500', bgColor: 'bg-amber-50' },
        { id: 'mapas', name: 'MAPAS MENTAIS', icon: Network, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
        { id: 'apresentacoes', name: 'APRESENTAÇÕES', icon: MonitorPlay, color: 'text-gray-500', bgColor: 'bg-gray-100' },
        { id: 'pei', name: 'PEI', icon: UserCheck, color: 'text-teal-500', bgColor: 'bg-teal-50' },
        { id: 'tarefas', name: 'TAREFAS ADAPTADAS', icon: ListTodo, color: 'text-orange-500', bgColor: 'bg-orange-50' },
        { id: 'simulados', name: 'SIMULADOS SAEB', icon: Layers, color: 'text-sky-500', bgColor: 'bg-sky-50' },
        { id: 'listas', name: 'LISTAS BNCC', icon: ListChecks, color: 'text-lime-500', bgColor: 'bg-lime-50' },
        { id: 'multimidia', name: 'RECURSOS MULTIMÍDIA', icon: Video, color: 'text-violet-500', bgColor: 'bg-violet-50' },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hub de Recursos</h1>
                <p className="text-gray-500 font-medium mt-1">Gere materiais pedagógicos inteligentes de forma independente.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                
                <div className="flex flex-col items-center max-w-3xl mx-auto relative z-10 text-center">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-black text-gray-900 tracking-widest uppercase">O QUE VOCÊ QUER GERAR HOJE?</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 italic">Digite um tema, assunto ou conteúdo base</p>
                    
                    <div className="w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-300" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium text-lg shadow-inner"
                            placeholder="Ex: Ciclo da Água, Revolução Francesa, Funções de Primeiro Grau..."
                        />
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">Recursos Pedagógicos Inteligentes</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {resources.map((resource) => {
                        const Icon = resource.icon;
                        return (
                            <button
                                key={resource.id}
                                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group active:scale-95"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${resource.bgColor} group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                                    <Icon className={`w-6 h-6 ${resource.color}`} />
                                </div>
                                <span className="text-[11px] font-black text-gray-600 tracking-widest uppercase text-center group-hover:text-primary transition-colors">
                                    {resource.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
