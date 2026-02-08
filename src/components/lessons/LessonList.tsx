import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import type { LessonPlan } from '../../types/lesson';

interface LessonListProps {
    plans: LessonPlan[];
    onSelect: (plan: LessonPlan) => void;
}

export function LessonList({ plans, onSelect }: LessonListProps) {
    if (plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Nenhum plano criado ainda.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    onClick={() => onSelect(plan)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary cursor-pointer transition-all hover:shadow-md group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-primary line-clamp-1">{plan.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{plan.discipline} • {plan.grade}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(plan.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {plan.duration}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
