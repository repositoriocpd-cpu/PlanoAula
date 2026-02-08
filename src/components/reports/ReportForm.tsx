import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
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
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Novo Relatório Individual</h2>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados para gerar um parecer descritivo.</p>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as ReportFormData))} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Aluno(a)</label>
                    <input
                        {...register('studentName')}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                        placeholder="Ex: João Silva"
                    />
                    {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Série/Ano</label>
                        <select
                            {...register('grade')}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
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
                        {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <select
                            {...register('period')}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
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
                        {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Características e Observações</label>
                    <p className="text-xs text-gray-500 mb-2">
                        Cite pontos sobre: participação, interação, dificuldades, avanços, comportamento.
                    </p>
                    <textarea
                        {...register('characteristics')}
                        rows={5}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                        placeholder="Ex: O aluno é participativo, mas apresenta dificuldade em matemática. Relaciona-se bem com os colegas..."
                    />
                    {errors.characteristics && <p className="text-red-500 text-xs mt-1">{errors.characteristics.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Gerando Relatório...
                        </>
                    ) : (
                        'GERAR RELATÓRIO'
                    )}
                </button>
            </form>
        </div>
    );
}
