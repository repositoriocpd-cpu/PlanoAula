import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, FileText, User, GraduationCap, Calendar, MessageSquare, Wand2 } from 'lucide-react';
import type { ReportFormData } from '../../types/report';

const schema = z.object({
    studentName: z.string().min(2, 'Nome do aluno é obrigatório'),
    grade: z.string().min(1, 'Série é obrigatória'),
    period: z.string().min(1, 'Período é obrigatório'),
    characteristics: z.string().min(10, 'Descreva pelo menos algumas características'),
});

interface ReportFormProps {
    onSubmit: (data: ReportFormData) => void;
    isLoading: boolean;
}

export function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>({
        resolver: zodResolver(schema),
    });

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <FileText className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Novo Relatório Individual</h2>
                    <p className="text-sm text-gray-500">Gere um parecer descritivo detalhado e empático.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as ReportFormData))} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Aluno(a)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('studentName')}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Ex: João Silva"
                        />
                    </div>
                    {errors.studentName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.studentName.message}</p>}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                {...register('period')}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                            >
                                <option value="">Selecione</option>
                                <option value="1º Bimestre">1º Bimestre</option>
                                <option value="2º Bimestre">2º Bimestre</option>
                                <option value="3º Bimestre">3º Bimestre</option>
                                <option value="4º Bimestre">4º Bimestre</option>
                                <option value="1º Semestre">1º Semestre</option>
                                <option value="2º Semestre">2º Semestre</option>
                                <option value="Parecer Final">Parecer Final</option>
                            </select>
                        </div>
                        {errors.period && <p className="text-red-500 text-xs mt-1 ml-1">{errors.period.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Características e Observações</label>
                    <p className="text-xs text-gray-500 mb-2">
                        Cite pontos sobre: participação, interação, dificuldades, avanços, comportamento.
                    </p>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            {...register('characteristics')}
                            rows={5}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                            placeholder="Ex: O aluno é participativo, mas apresenta dificuldade em matemática. Relaciona-se bem com os colegas..."
                        />
                    </div>
                    {errors.characteristics && <p className="text-red-500 text-xs mt-1 ml-1">{errors.characteristics.message}</p>}
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
                            GERAR RELATÓRIO
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
