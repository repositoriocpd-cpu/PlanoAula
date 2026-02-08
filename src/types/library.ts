export interface Resource {
    id: string;
    title: string;
    type: 'PDF' | 'Vídeo' | 'Site' | 'Imagem';
    discipline: string;
    grade: string;
    url: string;
    tags: string[];
}

export const MOCK_RESOURCES: Resource[] = [
    {
        id: '1',
        title: 'BNCC na Prática - Guia Completo',
        type: 'PDF',
        discipline: 'Pedagogia',
        grade: 'Todos',
        url: '#',
        tags: ['BNCC', 'Guia', 'Formação']
    },
    {
        id: '2',
        title: 'Jogos Matemáticos para o 1º Ano',
        type: 'PDF',
        discipline: 'Matemática',
        grade: '1º Ano',
        url: '#',
        tags: ['Jogos', 'Matemática', 'Lúdico']
    },
    {
        id: '3',
        title: 'A Revolução Francesa - Documentário',
        type: 'Vídeo',
        discipline: 'História',
        grade: '8º Ano',
        url: '#',
        tags: ['História', 'Vídeo', 'Revolução']
    },
    {
        id: '4',
        title: 'Experiências de Ciências - Sistema Solar',
        type: 'Site',
        discipline: 'Ciências',
        grade: '3º Ano',
        url: '#',
        tags: ['Ciências', 'Astronomia', 'Experiências']
    },
    {
        id: '5',
        title: 'Mapas Mentais de Geografia',
        type: 'Imagem',
        discipline: 'Geografia',
        grade: '6º Ano',
        url: '#',
        tags: ['Geografia', 'Mapas', 'Resumo']
    },
];
