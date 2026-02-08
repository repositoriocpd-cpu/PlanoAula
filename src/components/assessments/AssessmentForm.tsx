import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import type { AssessmentFormData, AssessmentType } from '../../types/assessment';

const schema = z.object({
    discipline: z.string().min(2, 'Disciplina é obrigatória'),
    grade: z.string().min(1, 'Série é obrigatória'),
    content: z.string().min(3, 'Conteúdo é obrigatório'),
    type: z.enum(['Prova', 'Atividade', 'Rubrica', 'Diagnóstica']),
});

interface AssessmentFormProps {
    onSubmit: (data: AssessmentFormData) => void;
    isLoading: boolean;
}

export function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<AssessmentFormData>({
        resolver: zodResolver(schema),
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Nova Avaliação</h2>
            <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as AssessmentFormData))} className="space-y-4">
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Avaliação</label>
                    <select
                        {...register('type')}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                    >
                        <option value="Prova">Prova</option>
                        <option value="Atividade">Atividade</option>
                        <option value="Rubrica">Rubrica</option>
                        <option value="Diagnóstica">Diagnóstica</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo/Tópicos</label>
                    <textarea
                        {...register('content')}
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                        placeholder="Ex: Sistema Solar, Movimentos da Terra..."
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Gerando Avaliação...
                        </>
                    ) : (
                        'GERAR AVALIAÇÃO'
                    )}
                </button>
            </form>
        </div>
    );
}
