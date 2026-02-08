import React from 'react';

interface FormattedTextProps {
    text: string | string[];
    className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
    if (!text) return null;

    // Handle array of strings (simple list)
    if (Array.isArray(text)) {
        return (
            <ul className={`list-disc pl-5 space-y-1 ${className}`}>
                {text.map((item, idx) => (
                    <li key={idx}><FormattedContent text={item} /></li>
                ))}
            </ul>
        );
    }

    // Handle string content
    const lines = text.split('\n');

    return (
        <div className={className}>
            {lines.map((line, i) => (
                <div key={i} className={`${line.trim() === '' ? 'h-4' : 'mb-1'}`}>
                    <FormattedContent text={line} />
                </div>
            ))}
        </div>
    );
};

const FormattedContent = ({ text }: { text: string }) => {
    // Split by **bold** markers
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </>
    );
};
