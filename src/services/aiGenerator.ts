import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LessonPlanFormData, LessonPlan } from '../types/lesson';
import type { AnnualPlanFormData, AnnualPlan } from '../types/annualPlan';
import type { SequenceFormData, DidacticSequence } from '../types/sequence';
import type { AssessmentFormData, Assessment } from '../types/assessment';
import type { ReportFormData, Report } from '../types/report';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;

const getGenAI = () => {
  if (!API_KEY) {
    throw new Error('API Key for Google AI is missing. Please set VITE_GOOGLE_AI_KEY in .env.local');
  }
  return new GoogleGenerativeAI(API_KEY);
};

export async function generateLessonPlan(data: LessonPlanFormData): Promise<LessonPlan> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = `
    Como um especialista pedagógico, crie um Plano de Aula EXCELENTE e completo, estritamente alinhado à Base Nacional Comum Curricular (BNCC).
    Referência Oficial: http://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal.pdf

    Dados do Plano:
    - Tema: ${data.theme}
    - Disciplina: ${data.discipline}
    - Série/Ano: ${data.grade}
    - Duração: ${data.duration}
    - Contexto: ${data.context || 'Ensino Fundamental Regular'}

    Regras OBRIGATÓRIAS:
    1. Cite os Códigos Alfanuméricos da BNCC reais e corretos para a série e disciplina (ex: EF01LP01).
    2. A metodologia deve ser detalhada e ativa.
    3. A avaliação deve ser coerente com os objetivos.
    4. Gere APENAS o JSON no formato abaixo, sem texto adicional.

    Schema do JSON:
    {
      "title": "Título Criativo",
      "content": {
        "foundation": "Fundamentação teórica breve",
        "generalObjective": "Objetivo geral da aula",
        "specificObjectives": ["Objetivo Específico 1", "Objetivo Específico 2"],
        "content": ["Tópico 1", "Tópico 2"],
        "methodology": "Passo a passo da metodologia (Início, Desenvolvimento, Fechamento)...",
        "resources": ["Recurso 1", "Recurso 2"],
        "evaluation": "Como será a avaliação",
        "bnccSkills": ["EFXX... - Descrição"],
        "adaptations": "Adaptações para inclusão",
        "homework": "Sugestão de atividade"
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const json = JSON.parse(cleanText);

    return {
      id: crypto.randomUUID(),
      title: json.title,
      discipline: data.discipline,
      grade: data.grade,
      theme: data.theme,
      duration: data.duration,
      context: data.context,
      createdAt: new Date().toISOString(),
      content: json.content
    };
  } catch (error) {
    console.error('Error generating plan:', error);
    throw error;
  }
}

export async function generateAnnualPlan(data: AnnualPlanFormData): Promise<AnnualPlan> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const isInfantil = data.grade === 'Educação Infantil';

  const prompt = isInfantil ? `
    Crie um Planejamento Anual para Educação Infantil (BNCC) estritamente alinhado à BNCC.
    Disciplina/Contexto: ${data.discipline}
    Série/Ano: ${data.grade}

    O planejamento deve ser estruturado por Campos de Experiências.
    Considere os 5 campos: 
    1. O EU, O OUTRO E O NÓS
    2. CORPO, GESTOS E MOVIMENTOS
    3. TRAÇOS, SONS, CORES E FORMAS
    4. ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
    5. ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES

    Retorne EXATAMENTE o seguinte JSON:
    {
      "generalObjective": "Objetivo geral para o ano",
      "experienceFields": [
        {
          "fieldName": "Nome do Campo",
          "objectives": ["Objetivo de aprendizagem 1", "Objetivo 2"],
          "themes": ["Eixo Temático/Conteúdo 1", "2"],
          "methodology": "Descrição da metodologia para este campo"
        }
      ],
      "learningRights": ["Conviver", "Brincar", "Participar", "Explorar", "Expressar-se", "Conhecer-se"],
      "materials": ["Material 1", "Material 2"],
      "evaluation": "Como será a avaliação na Educação Infantil (foco em acompanhamento e portfólio)"
    }
  ` : `
    Crie um Planejamento Anual alinhado à BNCC para:
    Disciplina: ${data.discipline}
    Série/Ano: ${data.grade}

    O planejamento deve ser dividido em 4 bimestres.
    Retorne EXATAMENTE o seguinte JSON:
    {
      "bimesters": [
        {
          "name": "1º Bimestre",
          "themes": ["Tema 1", "Tema 2"],
          "objectives": ["Objetivo 1"],
          "bnccSkills": ["EFXX..."],
          "methodologies": ["Metodologia 1"],
          "evaluation": "Forma de avaliação"
        },
        ... (para 2º, 3º e 4º bimestres)
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleanText);

    return {
      id: crypto.randomUUID(),
      discipline: data.discipline,
      grade: data.grade,
      createdAt: new Date().toISOString(),
      planType: isInfantil ? 'infantil' : 'fundamental',
      bimesters: isInfantil ? undefined : json.bimesters,
      infantilContent: isInfantil ? json : undefined
    };
  } catch (error) {
    console.error('Error generating annual plan:', error);
    throw error;
  }
}

export async function generateDidacticSequence(data: SequenceFormData): Promise<DidacticSequence> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = `
    Crie uma Sequência Didática alinhada à BNCC sobre:
    Tema: ${data.theme}
    Disciplina: ${data.discipline}
    Série: ${data.grade}
    Duração: ${data.numClasses} aulas

    Referência BNCC: http://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal.pdf

    Retorne EXATAMENTE o seguinte JSON:
    {
      "objectives": ["Objetivo 1", "Objetivo 2"],
      "bnccSkills": ["EFXX..."],
      "classes": [
         { 
           "classNumber": 1, 
           "topic": "Tópico da aula", 
           "activities": ["Atividade 1"], 
           "resources": ["Recurso 1"] 
         }
      ],
      "finalEvaluation": "Proposta de avaliação final"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleanText);

    return {
      id: crypto.randomUUID(),
      theme: data.theme,
      numClasses: data.numClasses,
      createdAt: new Date().toISOString(),
      objectives: json.objectives,
      bnccSkills: json.bnccSkills,
      classes: json.classes,
      finalEvaluation: json.finalEvaluation
    };
  } catch (error) {
    console.error('Error generating sequence:', error);
    throw error;
  }
}

export async function generateAssessment(data: AssessmentFormData): Promise<Assessment> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = `
    Crie uma ${data.type} alinhada à BNCC para:
    Disciplina: ${data.discipline}
    Série: ${data.grade}
    Conteúdo: ${data.content}

    ${data.type === 'Rubrica' ?
      `Retorne um JSON com:
       {
         "title": "Título da Rubrica",
         "rubric": [
           { "criteria": "Critério 1", "levels": [{ "level": "Excelente", "description": "..." }, { "level": "Bom", "description": "..." }] }
         ]
       }`
      :
      `Retorne um JSON com:
       {
         "title": "Título da Avaliação",
         "questions": [
           { 
             "id": "1", 
             "text": "Enunciado da questão", 
             "type": "multiple_choice", 
             "options": ["A) ...", "B) ..."], 
             "correctAnswer": "A" 
           },
           {
             "id": "2",
             "text": "Questão dissertativa...",
             "type": "essay"
           }
         ]
       }`
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleanText);

    return {
      id: crypto.randomUUID(),
      title: json.title,
      discipline: data.discipline,
      grade: data.grade,
      type: data.type,
      content: data.content,
      createdAt: new Date().toISOString(),
      questions: json.questions,
      rubric: json.rubric
    };
  } catch (error) {
    console.error('Error generating assessment:', error);
    throw error;
  }
}

export async function generateReport(data: ReportFormData): Promise<Report> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = `
    Crie um Relatório Individual de Desenvolvimento (Parecer Descritivo) para:
    Aluno(a): ${data.studentName}
    Série: ${data.grade}
    Período: ${data.period}
    Características/Observações: ${data.characteristics}

    O relatório deve ser formal, acolhedor e focado no desenvolvimento do aluno, abordando aspectos cognitivos, sociais e emocionais.
    Não use tópicos, mas sim parágrafos bem construídos.

    Retorne apenas o texto do relatório.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      id: crypto.randomUUID(),
      studentName: data.studentName,
      grade: data.grade,
      period: data.period,
      createdAt: new Date().toISOString(),
      content: text
    };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}
