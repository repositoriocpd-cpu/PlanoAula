import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import type { Presentation, PresentationTheme, Slide } from '../types/presentation';
import { withRetry } from './aiUtils';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY || '');

export const presentationService = {
    async generatePresentation(params: {
        title: string,
        grade: string,
        discipline: string,
        theme: PresentationTheme,
        duration: 5 | 10 | 15,
        baseContext: string
    }): Promise<Presentation['content_json']> {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `Você é um gerador de apresentações didáticas premium para professores.
        Gere uma apresentação em formato JSON seguindo EXATAMENTE este modelo:
        {
          "title": "Título da apresentação",
          "audience": "Série/Ano",
          "theme": "${params.theme}",
          "slides": [
            {
              "type": "title",
              "headline": "Título principal",
              "subheadline": "Subtítulo engajador"
            },
            {
              "type": "image_caption",
              "headline": "Visão Visual",
              "caption": "Explicação curta sobre a imagem",
              "image_url": "PLACEHOLDER"
            },
            {
              "type": "two_columns",
              "headline": "Comparativo",
              "column_left": ["Ponto A", "Ponto B"],
              "column_right": ["Ponto C", "Ponto D"]
            },
            {
              "type": "bullets",
              "headline": "Conceitos Chave",
              "bullets": ["Explicação 1", "Explicação 2"]
            }
          ]
        }
        
        Regras de Ouro:
        1. Quantidade: EXATAMENTE entre 6 e 9 slides.
        2. Diversidade: Use obrigatoriamente slides de "image_caption" e "two_columns" para quebrar a monotonia de texto.
        3. Imagens: No slide "image_caption", deixe "image_url" como "PLACEHOLDER". Eu usarei o "headline" para buscar a imagem.
        4. Estrutura: Comece com "title" e termine com "summary" (atividade/revisão).
        5. Conteúdo: Texto curto e impactante. Máximo 5 bullets por slide.
        6. Retorne APENAS o JSON.`;

        const userPrompt = `Gere uma apresentação sobre "${params.title}" para a turma "${params.grade}" na disciplina de "${params.discipline}".
        Duração estimada: ${params.duration} minutos. 
        Contexto base: ${params.baseContext}`;

        try {
            const result = await withRetry(() => model.generateContent([systemPrompt, userPrompt]));
            const response = await result.response;
            const text = response.text();

            // Improved extraction: find the first { and the last }
            const startIdx = text.indexOf('{');
            const endIdx = text.lastIndexOf('}');

            if (startIdx === -1 || endIdx === -1) {
                console.error('No JSON object found in response:', text);
                throw new Error('Ocorreu um erro no formato da resposta da IA. Tente novamente.');
            }

            const jsonStr = text.substring(startIdx, endIdx + 1);
            let content;
            try {
                content = JSON.parse(jsonStr);
            } catch (pErr) {
                console.error('JSON parse error after extraction. Raw text:', text);
                throw new Error('A resposta da IA está corrompida. Tente gerar novamente.');
            }

            // Validation logic
            if (!content.slides || !Array.isArray(content.slides)) {
                console.error('Missing slides array in content:', content);
                throw new Error('A IA não gerou os slides corretamente.');
            }

            if (content.slides.length > 9) {
                content.slides = content.slides.slice(0, 9);
            }

            const hasSummary = content.slides.some((s: Slide) => s.type === 'summary');
            if (!hasSummary && content.slides.length < 9) {
                content.slides.push({
                    type: 'summary',
                    headline: 'Resumo e Atividade',
                    bullets: ['Revisão dos pontos principais', 'Atividade prática em sala', 'Dúvidas e discussões']
                });
            } else if (!hasSummary && content.slides.length === 9) {
                content.slides[8] = {
                    type: 'summary',
                    headline: 'Resumo e Atividade',
                    bullets: ['Revisão dos pontos principais', 'Atividade prática em sala', 'Dúvidas e discussões']
                };
            }

            return content;
        } catch (error) {
            console.error('Error generating presentation:', error);
            throw error;
        }
    },

    async savePresentation(presentation: Presentation) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('ai_presentations')
            .insert({
                user_id: session.user.id,
                title: presentation.title,
                grade: presentation.grade,
                discipline: presentation.discipline,
                theme: presentation.theme,
                content_json: presentation.content_json,
                duration_minutes: presentation.duration_minutes
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserPresentations() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];

        const { data, error } = await supabase
            .from('ai_presentations')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
