import { ArrowLeft, BookOpen, CheckCircle2, Info, Lightbulb, Target, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BNCCInfo() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "O que é a BNCC?",
            content: "A Base Nacional Comum Curricular é o documento que determina os direitos de aprendizagem de todo aluno cursando a Educação Básica no Brasil. A Base possui 10 Competências Gerais que operam como um 'fio condutor'.",
            foundation: [
                "Valorizar o conhecimento",
                "Exercitar o pensamento científico, crítico e criativo",
                "Construir e valorizar o uso de um repertório cultural",
                "Desenvolver a comunicação",
                "Adotar e compreender uma cultura digital",
                "Atuar em prol de um trabalho e projeto de vida",
                "Desenvolver técnicas de argumentação"
            ]
        },
        {
            title: "Direitos de Aprendizagem (Educação Infantil)",
            content: "As habilidades e direitos previstos para as crianças na Educação Infantil são:",
            items: ["Conviver", "Brincar", "Participar", "Explorar", "Expressar", "Conhecer-se"]
        },
        {
            title: "Os 3 Pilares da Educação Infantil",
            items: [
                "Direitos de aprendizagem e desenvolvimento",
                "Objetivos de aprendizagem e desenvolvimento",
                "Campos de experiência"
            ]
        },
        {
            title: "Os 5 Campos de Experiência",
            items: [
                "O eu, o outro e o nós",
                "Corpo, gestos e movimentos",
                "Traços, sons, cores e formas",
                "Escuta, fala, pensamento e imaginação",
                "Espaço, tempo, quantidades, relações e transformações"
            ]
        },
        {
            title: "As 10 Competências Gerais",
            items: [
                "Conhecimento",
                "Pensamento científico, crítico e criativo",
                "Repertório cultural",
                "Comunicação",
                "Cultura digital",
                "Trabalho e projeto de vida",
                "Argumentação",
                "Autoconhecimento e autocuidado",
                "Empatia e cooperação",
                "Responsabilidade e cidadania"
            ]
        },
        {
            title: "Áreas do Conhecimento",
            content: "No Ensino Fundamental, a BNCC é dividida em áreas que organizam os componentes curriculares:",
            items: [
                "Linguagens",
                "Matemática",
                "Ciências da Natureza",
                "Ciências Humanas",
                "Ensino Religioso"
            ]
        }
    ];

    const codeStructure = [
        { label: "Etapa", code: "EF", desc: "Ensino Fundamental" },
        { label: "Ano/Bloco", code: "67", desc: "6º e 7º anos" },
        { label: "Componente", code: "EF", desc: "Educação Física" },
        { label: "Sequencial", code: "01", desc: "Posição da habilidade" }
    ];

    const componentsMap = [
        { key: "AR", val: "Arte" },
        { key: "CI", val: "Ciências" },
        { key: "EF", val: "Educação Física" },
        { key: "ER", val: "Ensino Religioso" },
        { key: "GE", val: "Geografia" },
        { key: "HI", val: "História" },
        { key: "LI", val: "Língua Inglesa" },
        { key: "LP", val: "Língua Portuguesa" },
        { key: "MA", val: "Matemática" }
    ];

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/library')}
                className="flex items-center text-primary hover:text-blue-700 transition-colors mb-6 group w-fit"
            >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Voltar para Biblioteca</span>
            </button>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-[32px] p-8 md:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="text-xs font-bold tracking-wider uppercase">Guia Informativo</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">O QUE É BNCC?</h1>
                    <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                        Entenda os fundamentos, competências e objetivos de aprendizagem que norteiam a educação brasileira.
                    </p>
                </div>
            </div>

            <div className="space-y-8 pb-10">
                {/* Intro FAQ Style */}
                <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 shrink-0">
                            <Lightbulb className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Base Nacional Comum Curricular</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                A BNCC é um documento de caráter normativo que define o conjunto orgânico e progressivo de aprendizagens essenciais que todos os alunos devem desenvolver ao longo das etapas e modalidades da Educação Básica.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center">
                                        <Target className="h-4 w-4 mr-2 text-primary" />
                                        Foco Principal
                                    </h4>
                                    <p className="text-xs text-gray-500">Desenvolvimento de competências e compromisso com a educação integral.</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center">
                                        <Info className="h-4 w-4 mr-2 text-primary" />
                                        Regulamentação
                                    </h4>
                                    <p className="text-xs text-gray-500">Regulamentada pela Lei nº 13.415/2017, estabelecendo diretrizes nacionais.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Entendendo os Códigos Section */}
                <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-10 -mt-10 blur-2xl" />

                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-1.5 h-6 bg-secondary rounded-full mr-3" />
                        Como ler os códigos da BNCC?
                    </h2>

                    <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Cada habilidade é identificada por um código alfanumérico. Veja como decifrá-lo usando o exemplo <span className="font-bold text-primary">EF67EF01</span>:
                    </p>

                    {/* Visual Code Breakdown */}
                    <div className="flex flex-wrap justify-center gap-4 mb-10 relative">
                        {codeStructure.map((part, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 tabular-nums tracking-widest">{part.label}</div>
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-2xl font-black text-gray-800 shadow-inner group-hover:border-primary/30 transition-colors">
                                    {part.code}
                                </div>
                                <div className="mt-3 text-[10px] font-medium text-gray-500 text-center max-w-[80px] leading-tight">{part.desc}</div>
                                {i < codeStructure.length - 1 && (
                                    <div className="hidden md:flex absolute mt-11 items-center" style={{ marginLeft: `${(i + 1) * 88 - 44}px` }}>
                                        <div className="w-6 h-[1px] bg-gray-200 border-t border-dashed border-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm mb-4">Anos e Blocos de Anos</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                                    <span className="font-bold text-gray-700">15</span>
                                    <span className="text-gray-500 italic">1º ao 5º ano (LP/Arte)</span>
                                </div>
                                <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                                    <span className="font-bold text-gray-700">12</span>
                                    <span className="text-gray-500 italic">1º e 2º anos (LP/EF)</span>
                                </div>
                                <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                                    <span className="font-bold text-gray-700">67</span>
                                    <span className="text-gray-500 italic">6º e 7º anos (LP/EF)</span>
                                </div>
                                <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                                    <span className="font-bold text-gray-700">01 a 09</span>
                                    <span className="text-gray-500 italic">Anos específicos</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-sm mb-4">Componentes Curriculares</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {componentsMap.map(c => (
                                    <div key={c.key} className="flex items-center gap-2 text-[10px] p-1.5 bg-gray-50 rounded-md border border-gray-100">
                                        <span className="font-black text-secondary">{c.key}</span>
                                        <span className="text-gray-500 truncate">{c.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Sections */}
                <div className="grid gap-6 md:grid-cols-2">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:border-primary/20 transition-all hover:shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-1.5 h-6 bg-primary rounded-full mr-3" />
                                {section.title}
                            </h3>
                            {section.content && (
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {section.content}
                                </p>
                            )}
                            {section.items && (
                                <ul className="space-y-2">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-700">
                                            <CheckCircle2 className="h-4 w-4 text-secondary mr-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {section.foundation && (
                                <ul className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                                    {section.foundation.map((item, i) => (
                                        <li key={i} className="flex items-center text-xs text-gray-500">
                                            <div className="w-1 h-1 bg-gray-300 rounded-full mr-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center p-8 bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 italic mb-4">
                        "A educação é o processo de tornar-se humano através do aprendizado."
                    </p>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-xs text-gray-400">Fonte: MEC / BNCC 2024</p>
                        <a
                            href="https://basenacionalcomum.mec.gov.br/abase/#estrutura"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm transition-all hover:shadow-md"
                        >
                            Ver Estrutura Oficial no Portal do MEC <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
