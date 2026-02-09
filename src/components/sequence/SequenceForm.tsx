import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ListOrdered, BookOpen, GraduationCap, Type, Hash, Wand2 } from 'lucide-react';
import type { SequenceFormData } from '../../types/sequence';

const schema = z.object({
    discipline: z.string().min(2, 'Disciplina é obrigatória'),
    grade: z.string().min(1, 'Série é obrigatória'),
    theme: z.string().min(3, 'Tema é obrigatório'),
    numClasses: z.coerce.number().min(1, 'Mínimo de 1 aula'),
});

interface SequenceFormProps {
    onSubmit: (data: SequenceFormData) => void;
    isLoading: boolean;
}

export function SequenceForm({ onSubmit, isLoading }: SequenceFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<SequenceFormData>({
        resolver: zodResolver(schema) as any,
    });

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <ListOrdered className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Nova Sequência Didática</h2>
                    <p className="text-sm text-gray-500">Organize suas aulas em uma sequência lógica.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as SequenceFormData))} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disciplina</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            {...register('discipline')}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                        >
                            <option value="">Selecione a disciplina</option>
                            <option value="Língua Portuguesa">Língua Portuguesa</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Ciências">Ciências</option>
                            <option value="História">História</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Arte">Arte</option>
                            <option value="Educação Física">Educação Física</option>
                            <option value="Língua Inglesa">Língua Inglesa</option>
                            <option value="Ensino Religioso">Ensino Religioso</option>
                        </select>
                    </div>
                    {errors.discipline && <p className="text-red-500 text-xs mt-1 ml-1">{errors.discipline.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Série/Ano</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <GraduationCap className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                {...register('grade')}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                            >
                                <option value="">Selecione</option>
                                <option value="Educação Infantil">Educação Infantil</option>
                                <option value="1º Ano">1º Ano</option>
                                <option value="2º Ano">2º Ano</option>
                                <option value="3º Ano">3º Ano</option>
                                <option value="4º Ano">4º Ano</option>
                                <option value="5º Ano">5º Ano</option>
                                <option value="6º Ano">6º Ano</option>
                                <option value="7º Ano">7º Ano</option>
                                <option value="8º Ano">8º Ano</option>
                                <option value="9º Ano">9º Ano</option>
                            </select>
                        </div>
                        {errors.grade && <p className="text-red-500 text-xs mt-1 ml-1">{errors.grade.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Aulas</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Hash className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                {...register('numClasses')}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                                placeholder="Ex: 4"
                                min={1}
                            />
                        </div>
                        {errors.numClasses && <p className="text-red-500 text-xs mt-1 ml-1">{errors.numClasses.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema Central</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Type className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('theme')}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Ex: Revolução Francesa e seus desdobramentos"
                        />
                    </div>
                    {errors.theme && <p className="text-red-500 text-xs mt-1 ml-1">{errors.theme.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            <span className="animate-pulse">Criando Mágica...</span>
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                            GERAR SEQUÊNCIA
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
