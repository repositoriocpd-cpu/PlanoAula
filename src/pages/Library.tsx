import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Video, Globe, Image as ImageIcon, ExternalLink, X, BookOpen, ChevronRight } from 'lucide-react';
import { MOCK_RESOURCES } from '../types/library';
import type { Resource } from '../types/library';

export function Library() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const filteredResources = useMemo(() => {
        return MOCK_RESOURCES.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDiscipline = selectedDiscipline ? resource.discipline === selectedDiscipline : true;
            const matchesType = selectedType ? resource.type === selectedType : true;

            return matchesSearch && matchesDiscipline && matchesType;
        });
    }, [searchTerm, selectedDiscipline, selectedType]);

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'PDF': return <FileText className="h-6 w-6 text-red-500" />;
            case 'Vídeo': return <Video className="h-6 w-6 text-blue-500" />;
            case 'Site': return <Globe className="h-6 w-6 text-green-500" />;
            case 'Imagem': return <ImageIcon className="h-6 w-6 text-purple-500" />;
            default: return <FileText className="h-6 w-6" />;
        }
    };



    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDiscipline('');
        setSelectedType('');
    };

    const hasActiveFilters = searchTerm || selectedDiscipline || selectedType;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Recursos</h1>
                <p className="text-gray-500">Materiais de apoio, atividades e referências alinhadas à BNCC.</p>
            </div>

            {/* Nova Banner "O QUE É BNCC?" */}
            <div
                onClick={() => navigate('/library/bncc-info')}
                className="mb-8 bg-gradient-to-r from-primary to-secondary rounded-[24px] p-6 text-white cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden active:scale-[0.98]"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight mb-0.5">O QUE É BNCC?</h2>
                            <p className="text-white/80 text-xs font-medium">Tudo o que você precisa saber sobre a Base Nacional Comum Curricular</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 group-hover:bg-white text-white group-hover:text-primary transition-all">
                        Explorar <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 space-y-4 md:space-y-0 md:flex md:space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar por título ou tag..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex space-x-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white min-w-[180px]"
                            value={selectedDiscipline}
                            onChange={(e) => setSelectedDiscipline(e.target.value)}
                        >
                            <option value="">Todas Disciplinas</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Português">Português</option>
                            <option value="História">História</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Ciências">Ciências</option>
                            <option value="Pedagogia">Pedagogia</option>
                            <option value="Informática Educativa/ Educação Digital">Informática Educativa/ Educação Digital</option>
                            <option value="Cultura Étnico racial">Cultura Étnico racial</option>
                        </select>
                    </div>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">Todos Tipos</option>
                        <option value="PDF">PDF</option>
                        <option value="Vídeo">Vídeo</option>
                        <option value="Site">Site</option>
                        <option value="Imagem">Imagem</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100"
                            title="Limpar Filtros"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                        {filteredResources.map(resource => {
                            const isComingSoon = resource.title.includes('(Em Construção)');
                            const displayTitle = resource.title.replace('(Em Construção)', '').trim();

                            return (
                                <div
                                    key={resource.id}
                                    className={`
                                        group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full
                                        ${isComingSoon
                                            ? 'border-gray-100 opacity-90 hover:border-gray-200'
                                            : 'border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        {isComingSoon ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                                Em Breve
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 shadow-sm animate-pulse-slow">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                                                Disponível
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col h-full">
                                        {/* Icon Header */}
                                        <div className="mb-5">
                                            <div className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                                                ${isComingSoon ? 'bg-gray-50' : 'bg-blue-50 group-hover:bg-blue-100'}
                                            `}>
                                                {getIcon(resource.type)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4 flex-1">
                                            <h3
                                                className={`text-lg font-bold leading-tight mb-2 ${isComingSoon ? 'text-gray-500' : 'text-gray-900 group-hover:text-blue-700 transition-colors'}`}
                                                style={{ fontFamily: "'Alexandria', sans-serif" }}
                                            >
                                                {displayTitle}
                                            </h3>

                                            <div className="flex flex-wrap gap-y-1 text-sm text-gray-500 items-center">
                                                <span className="font-medium text-gray-700">{resource.discipline}</span>
                                                <span className="mx-2">•</span>
                                                <span>{resource.grade}</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {resource.tags.slice(0, 3).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Footer */}
                                        <div className="mt-auto pt-4 border-t border-gray-50">
                                            {isComingSoon ? (
                                                <button
                                                    disabled
                                                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 text-gray-400 text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    Indisponível no Momento
                                                </button>
                                            ) : (
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                                >
                                                    Acessar Material
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p className="text-lg font-medium">Nenhum recurso encontrado.</p>
                        <p className="text-sm mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-primary hover:underline text-sm"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
