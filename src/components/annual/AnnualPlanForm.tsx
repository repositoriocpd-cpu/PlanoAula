import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import type { AnnualPlanFormData } from '../../types/annualPlan';

const schema = z.object({
    discipline: z.string().min(2, 'Disciplina é obrigatória'),
    grade: z.string().min(1, 'Série é obrigatória'),
});

interface AnnualPlanFormProps {
    onSubmit: (data: AnnualPlanFormData) => void;
    isLoading: boolean;
}

export function AnnualPlanForm({ onSubmit, isLoading }: AnnualPlanFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<AnnualPlanFormData>({
        resolver: zodResolver(schema),
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Novo Plano Anual</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                    <select
                        {...register('discipline')}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
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
                    {errors.discipline && <p className="text-red-500 text-xs mt-1">{errors.discipline.message}</p>}
                </div>

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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Gerando Planejamento...
                        </>
                    ) : (
                        'GERAR PLANO ANUAL'
                    )}
                </button>
            </form>
        </div>
    );
}
