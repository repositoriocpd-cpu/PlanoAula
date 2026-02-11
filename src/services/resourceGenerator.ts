import { getAIProvider } from './ai/aiProvider';
import type { ResourceType } from '../types/resources';

// Removed direct GenAI setup

export async function generatePedagogicalResource(type: ResourceType, context: any | string): Promise<any> {


    const contextStr = JSON.stringify(context);

    let prompt = '';

    switch (type) {
        case 'planejamento':
            prompt = `Com base no conteúdo abaixo, crie um Planejamento Resumido e direto ao ponto, ideal para uma consulta rápida do professor. 
            FOCO: Objetivos principais, cronograma sugerido e ações imediatas.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'atividades':
            prompt = `Com base no conteúdo abaixo, gere 5 atividades práticas e criativas para os alunos. 
            Para cada atividade inclua: Nome, Descrição, Passo a passo e Material necessário.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'avaliacoes':
            prompt = `Crie uma avaliação completa sobre o tema abaixo. 
            Inclua: 
            1. 5 questões objetivas (múltipla escolha com 4 opções).
            2. 3 questões discursivas.
            3. Gabarito detalhado ao final.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'inclusao':
            prompt = `Crie adaptações pedagógicas específicas para o conteúdo abaixo, focando em:
            1. TEA (Autismo)
            2. TDAH
            3. Deficiência Visual
            4. Deficiência Auditiva
            5. Deficiência Intelectual
            As adaptações devem ser práticas e fáceis de aplicar em sala de aula regular.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'jogos':
            prompt = `Crie um Jogo Pedagógico inovador baseado no tema abaixo. 
            Inclua: Nome do jogo, Objetivo, Materiais, Regras e Como aplicar.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'mapas_mentais':
            prompt = `Crie um Mapa Mental visual e hierárquico sobre o tema abaixo focado em visualização técnica (estilo Boardmix).
            ESTRUTURA: Use EXATAMENTE a hierarquia de Markdown com #, ##, ### para níveis de profundidade (mínimo 3 níveis).
            Exemplo:
            # Tema Central
            ## Tópico 1
            ### Subtópico 1.1
            ### Subtópico 1.2
            ## Tópico 2
            
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'apresentacoes':
            prompt = `Crie uma apresentação de slides de ALTO IMPACTO visual (estilo Gamma.app) sobre o tema abaixo.
            REGRAS CRÍTICAS: 
            1. Use o delimitador " ---SPLIT--- " para separar os slides.
            2. NÃO inclua o texto "Slide X" no conteúdo final.
            3. Para cada slide, siga este formato rigoroso:
            
            [TÍTULO DO SLIDE]
            [KEYWORD: 3 a 5 palavras em inglês para busca de imagem, ex: futuristic classroom]
            [CONTEÚDO: 3 a 5 tópicos curtos e poderosos]
            
            ESTRUTURA: 1 Slide de Capa, 6 de Desenvolvimento Profundo, 1 de Conclusão.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'pei':
            prompt = `Gere um modelo de PEI (Plano Educacional Individualizado) baseado no tema abaixo. 
            Inclua: Perfil do aluno (espaço para preencher), Objetivos adaptados, Estratégias metodológicas e Critérios de avaliação.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'tarefas_adaptadas':
            prompt = `Crie tarefas adaptadas em 3 níveis de dificuldade (Básico, Intermediário, Avançado) baseadas no conteúdo abaixo. 
            Gere pelo menos 2 tarefas por nível.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'simulado_saeb':
            prompt = `Gere um simulado estilo SAEB com 10 questões de múltipla escolha baseadas no conteúdo abaixo. 
            ESTRUTURA OBRIGATÓRIA:
            1. As questões devem seguir os descritores do SAEB e a matriz de referência.
            2. Cada questão deve ter 4 alternativas (A, B, C, D).
            3. Inclua o gabarito comentado ao final.
            4. Formate de maneira clara e legível.
            
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'listas_bncc':
            prompt = `Gere uma lista de exercícios estritamente alinhados às habilidades da BNCC mencionadas no conteúdo abaixo. 
            Para cada exercício, indique qual código de habilidade (ex: EF01LP01) ele contempla.
            CONTEÚDO BASE: ${contextStr}`;
            break;
        case 'recursos_multimidia':
            prompt = `Sugira recursos multimídia para enriquecer a aula baseada no tema abaixo. 
            Inclua: 
            1. 3 Vídeos educativos ( YouTube/Canais).
            2. 2 Sites interativos ou jogos online.
            3. 2 Aplicativos ou ferramentas digitais.
            Para cada item, dê uma breve descrição de como usar.
            CONTEÚDO BASE: ${contextStr}`;
            break;
    }

    prompt += `\n\nResponda em PORTUGUÊS BRASIL de forma EXCELENTE e bem formatada em Markdown.`;

    try {
        const aiProvider = getAIProvider();
        const responseText = await aiProvider.generateContent(prompt);
        return responseText;
    } catch (error) {
        console.error('Erro na geração do recurso:', error);
        throw error;
    }
}
