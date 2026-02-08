import React, { useState, useMemo } from 'react';
import { Search, Filter, FileText, Video, Globe, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { MOCK_RESOURCES } from '../types/library';
import type { Resource } from '../types/library';

export function Library() {
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

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Recursos</h1>
                <p className="text-gray-500">Materiais de apoio, atividades e referências alinhadas à BNCC.</p>
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
                </div>

                <div className="flex space-x-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white"
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
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(resource => (
                            <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        {getIcon(resource.type)}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {resource.type}
                                    </span>
                                </div>

                                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{resource.title}</h3>

                                <div className="text-sm text-gray-600 mb-4 space-y-1">
                                    <p>Disciplina: <span className="font-medium">{resource.discipline}</span></p>
                                    <p>Série: <span className="font-medium">{resource.grade}</span></p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex space-x-1">
                                        {resource.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a href={resource.url} className="text-primary hover:text-blue-700 flex items-center text-sm font-medium">
                                        Acessar <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">Nenhum recurso encontrado.</p>
                        <p className="text-sm">Tente ajustar os filtros ou a busca.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
