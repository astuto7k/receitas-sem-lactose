'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getOrCreateSession, 
  trackStepTransition, 
  trackProfileSelection,
  QuizSession 
} from '../lib/tracking';
import { 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Clock,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Option {
  text: string;
  score: number;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: Option[];
}

// Perguntas para quem já tem diagnóstico (Sim - Confirmed)
const QUESTIONS_CONFIRMED: Question[] = [
  {
    id: 'q2_conf',
    title: 'Há quanto tempo você descobriu ou convive com a intolerância à lactose?',
    options: [
      { text: 'Há menos de 6 meses', score: 2 },
      { text: 'Entre 6 meses e 2 anos', score: 3 },
      { text: 'Há mais de 2 anos', score: 4 }
    ]
  },
  {
    id: 'q3_conf',
    title: 'Qual é a sua maior dificuldade no dia a dia com a intolerância?',
    options: [
      { text: 'Encontrar receitas saborosas e fáceis', score: 4 },
      { text: 'Comer fora de casa sem passar mal', score: 3 },
      { text: 'Substituir o leite e derivados sem perder o sabor', score: 4 },
      { text: 'O preço alto de produtos "zero lactose"', score: 2 }
    ]
  },
  {
    id: 'q4_conf',
    title: 'Quando você consome lactose por acidente, quais sintomas mais te incomodam?',
    options: [
      { text: 'Gases e inchaço abdominal', score: 4 },
      { text: 'Dor de barriga e cólicas', score: 4 },
      { text: 'Diarreia ou intestino solto', score: 4 },
      { text: 'Náusea e refluxo', score: 3 }
    ]
  },
  {
    id: 'q5_conf',
    title: 'Qual destes alimentos você mais sente falta de consumir sem preocupação?',
    options: [
      { text: 'Pizza e queijos derretidos', score: 3 },
      { text: 'Sobremesas cremosas (pudim, sorvete, doces)', score: 3 },
      { text: 'Bolos e pães recheados', score: 3 },
      { text: 'Molhos brancos e massas', score: 2 }
    ]
  },
  {
    id: 'q6_conf',
    title: 'Qual refeição você acha mais difícil preparar sem lactose hoje?',
    options: [
      { text: 'Café da manhã', score: 3 },
      { text: 'Almoço / Jantar', score: 2 },
      { text: 'Lanches práticos', score: 3 },
      { text: 'Sobremesas', score: 4 }
    ]
  },
  {
    id: 'q7_conf',
    title: 'Se existisse um cardápio completo de 30 dias com substituições baratas e receitas deliciosas, isso facilitaria sua rotina?',
    options: [
      { text: 'Com certeza, facilitaria muito', score: 5 },
      { text: 'Sim, seria bastante útil', score: 3 },
      { text: 'Talvez ajudasse', score: 2 }
    ]
  }
];

// Perguntas para quem não tem certeza / suspeita (Não - Suspect)
const QUESTIONS_SUSPECT: Question[] = [
  {
    id: 'q2_susp',
    title: 'Com que frequência você sente a barriga inchada, estufada ou com excesso de gases?',
    options: [
      { text: 'Quase todos os dias', score: 5 },
      { text: 'Algumas vezes por semana', score: 3 },
      { text: 'Raramente', score: 1 }
    ]
  },
  {
    id: 'q3_susp',
    title: 'Você percebe que esses sintomas pioram após consumir leite, queijos, pizza, requeijão ou doces?',
    options: [
      { text: 'Sim, percebo claramente', score: 5 },
      { text: 'Às vezes noto uma relação', score: 3 },
      { text: 'Nunca parei para analisar', score: 2 }
    ]
  },
  {
    id: 'q4_susp',
    title: 'Além de gases e inchaço, você costuma sentir cólicas ou diarreia após comer derivados de leite?',
    options: [
      { text: 'Sim, frequentemente', score: 5 },
      { text: 'Às vezes', score: 3 },
      { text: 'Raramente ou nenhum desses', score: 1 }
    ]
  },
  {
    id: 'q5_susp',
    title: 'Qual alimento com leite você consome com frequência mesmo sabendo que pode te fazer mal?',
    options: [
      { text: 'Pizza e queijos', score: 3 },
      { text: 'Sobremesas e doces', score: 3 },
      { text: 'Pães e bolos', score: 2 },
      { text: 'Leite com café', score: 2 }
    ]
  },
  {
    id: 'q6_susp',
    title: 'Há quanto tempo você convive com esses desconfortos digestivos sem encontrar uma solução definitiva?',
    options: [
      { text: 'Menos de 6 meses', score: 2 },
      { text: 'Entre 6 meses e 2 anos', score: 3 },
      { text: 'Mais de 2 anos', score: 5 }
    ]
  },
  {
    id: 'q7_susp',
    title: 'Você sabia que um teste de eliminação de lactose por 30 dias é a forma mais recomendada para confirmar a intolerância e eliminar os gases?',
    options: [
      { text: 'Não sabia, mas faz todo sentido', score: 5 },
      { text: 'Sim, já ouvi falar', score: 3 },
      { text: 'Nunca ouvi falar', score: 2 }
    ]
  }
];

interface QuizWizardProps {
  initialProfile?: 'confirmed' | 'suspect' | null;
}

export default function QuizWizard({ initialProfile = null }: QuizWizardProps) {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('landing');
  const [profile, setProfile] = useState<'confirmed' | 'suspect' | null>(initialProfile);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  
  // Controle de cliques rápidos / transição de tela
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Controle do banner de recuperação
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(false);
  const [savedStep, setSavedStep] = useState<string>('');
  const [savedProfile, setSavedProfile] = useState<'confirmed' | 'suspect' | null>(null);
  
  // Controle de tela de processamento
  const [processingMsgIndex, setProcessingMsgIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Resetar trava de cliques quando o índice ou passo muda
  useEffect(() => {
    setIsTransitioning(false);
  }, [questionIndex, currentStep]);

  // Inicializar sessão
  useEffect(() => {
    const activeSession = getOrCreateSession(initialProfile || undefined);
    setSession(activeSession);
    
    if (initialProfile) {
      setProfile(initialProfile);
      setCurrentStep('quiz');
      setQuestionIndex(0);
      trackStepTransition('quiz');
    }
  }, [initialProfile]);

  const handleResume = () => {
    if (session && savedStep) {
      setProfile(savedProfile);
      setCurrentStep(savedStep);
      setShowResumeBanner(false);
      
      if (savedStep === 'quiz') {
        const answeredCount = Object.keys(session.answers || {}).length;
        setQuestionIndex(Math.max(0, answeredCount - 1));
      }
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('receitas_sem_lactose_quiz_session');
    }
    const newSession = getOrCreateSession(initialProfile || undefined);
    setSession(newSession);
    setProfile(initialProfile);
    if (initialProfile) {
      setCurrentStep('quiz');
      setQuestionIndex(0);
      trackStepTransition('quiz');
    } else {
      setCurrentStep('landing');
    }
    setShowResumeBanner(false);
  };

  const startQuiz = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const updated = trackStepTransition('q1_split');
    setSession(updated);
    setCurrentStep('q1_split');
  };

  // Trata resposta da pergunta 1 (Divisor de águas) -> Redireciona de fato para /s ou /n!
  const handleSplitAnswer = (isConfirmed: boolean) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const targetRoute = isConfirmed ? '/s' : '/n';
    
    const selectedProfile = isConfirmed ? 'confirmed' : 'suspect';
    trackProfileSelection(selectedProfile);
    
    const answersToMerge = { q1_diagnostico: isConfirmed ? 'Sim, já confirmado' : 'Não, suspeito pelos sintomas' };
    trackStepTransition('quiz', answersToMerge, 0);
    
    router.push(targetRoute);
  };

  // Responder perguntas subsequentes
  const handleAnswerQuestion = (option: Option, questionId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const activeQuestions = profile === 'confirmed' ? QUESTIONS_CONFIRMED : QUESTIONS_SUSPECT;
    const answersToMerge = { [questionId]: option.text };

    // Validar se o índice está dentro dos limites para evitar quebras de DOM no React
    if (questionIndex < activeQuestions.length - 1) {
      const updated = trackStepTransition('quiz', answersToMerge, option.score);
      setSession(updated);
      setQuestionIndex(prev => prev + 1);
    } else {
      const updated = trackStepTransition('processing', answersToMerge, option.score);
      setSession(updated);
      setCurrentStep('processing');
    }
  };

  // Efeito da tela de processamento
  useEffect(() => {
    if (currentStep === 'processing') {
      const messages = [
        'Analisando seus sintomas...',
        'Comparando seus hábitos alimentares...',
        'Preparando seu resultado personalizado...'
      ];

      setProcessingMsgIndex(0);
      setProcessingProgress(0);

      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2.5;
        });
      }, 100);

      const msgInterval = setInterval(() => {
        setProcessingMsgIndex(prev => {
          if (prev < messages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1300);

      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(msgInterval);
        
        // Redireciona diretamente para a landing page final correta (/s-lp ou /n-lp)
        if (profile === 'confirmed') {
          trackStepTransition('offer');
          router.push('/s-lp');
        } else {
          trackStepTransition('offer');
          router.push('/n-lp');
        }
      }, 4200);

      return () => {
        clearInterval(progressInterval);
        clearInterval(msgInterval);
        clearTimeout(timeout);
      };
    }
  }, [currentStep, profile]);

  // Progresso do quiz
  const getProgressPercentage = () => {
    if (currentStep === 'landing') return 0;
    if (currentStep === 'q1_split') return 15;
    if (currentStep === 'quiz') {
      const activeQuestions = profile === 'confirmed' ? QUESTIONS_CONFIRMED : QUESTIONS_SUSPECT;
      const stepsCount = activeQuestions.length;
      return 15 + Math.round((questionIndex / stepsCount) * 75);
    }
    return 100;
  };

  const activeQuestions = profile === 'confirmed' ? QUESTIONS_CONFIRMED : QUESTIONS_SUSPECT;
  const activeQuestion = currentStep === 'quiz' && activeQuestions[questionIndex] ? activeQuestions[questionIndex] : null;

  return (
    <div className="flex-1 w-full flex flex-col justify-start">
      <div className={`w-full max-w-md mx-auto ${currentStep === 'landing' ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between relative`}>

        {/* Cabeçalho */}
        <header className="py-4 px-6 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Diagnóstico Lactose</span>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          {currentStep !== 'landing' && currentStep !== 'processing' && (
            <div className="mt-4 w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-[#2E7D32] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </header>

        {/* Conteúdo Principal */}
        <main className={`flex-1 flex flex-col justify-center p-6 ${currentStep === 'landing' ? 'py-1.5 px-5' : ''}`}>
          <AnimatePresence mode="wait">
            
            {/* TELA INICIAL */}
            {currentStep === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-3 text-center py-1 flex flex-col justify-between h-full"
              >
                {/* Badge de Destaque */}
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
                    <span>🔎 Teste de Sensibilidade à Lactose</span>
                  </div>
                </div>
                
                {/* Título Principal (Headline) */}
                <h1 className="text-[38px] font-extrabold tracking-[-0.03em] text-[#111827] leading-[1.1] max-w-[12ch] mx-auto">
                  Seu corpo pode estar reagindo à lactose e você nem percebeu.
                </h1>
                
                {/* Imagem de Capa do Quiz (Foto - Altura reduzida para h-40 para evitar cortes em telas menores) */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-md">
                  <img 
                    src="/lactose_free_banner.jpg" 
                    alt="Café da manhã saudável sem lactose" 
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Texto de Apoio (Subheadline) */}
                <p className="text-[18px] font-medium leading-[1.5] text-[#4B5563] px-2">
                  Responda algumas perguntas rápidas e descubra se seus sintomas podem estar relacionados à lactose.
                </p>
                
                {/* Grade de Benefícios / Destaques (2 cards verticais com a mesma altura) */}
                <div className="space-y-2 text-left">
                  {/* Card 1 */}
                  <div className="flex flex-col justify-center gap-1 bg-gray-50 border border-gray-100 p-3.5 h-[88px] rounded-[16px] transition hover:bg-gray-100/70">
                    <h3 className="text-[17px] font-bold text-[#111827] flex items-center gap-1.5 leading-none">
                      <span>⏱️</span> 50 segundos
                    </h3>
                    <p className="text-[15px] font-medium text-[#6B7280] leading-tight">
                      Resultado imediato.
                    </p>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="flex flex-col justify-center gap-1 bg-gray-50 border border-gray-100 p-3.5 h-[88px] rounded-[16px] transition hover:bg-gray-100/70">
                    <h3 className="text-[17px] font-bold text-[#111827] flex items-center gap-1.5 leading-none">
                      <span>🥛</span> Sintomas comuns
                    </h3>
                    <p className="text-[15px] font-medium text-[#6B7280] leading-tight">
                      Veja se a lactose pode estar contribuindo para seus desconfortos.
                    </p>
                  </div>
                </div>

                {/* Seção do Botão e Chamada de Ação */}
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    animate={{ scale: [1, 1.015, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    onClick={startQuiz}
                    disabled={isTransitioning}
                    className={`w-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#1B5E20] hover:to-[#0E3A11] text-white h-[68px] rounded-[18px] font-bold text-[22px] tracking-[-0.02em] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${isTransitioning ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <span>Começar Análise Gratuita</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                  
                  {/* Subtext de tempo */}
                  <p className="text-xs text-gray-400 font-semibold">
                    Leva menos de 1 minuto.
                  </p>
                </div>
              </motion.div>
            )}

            {/* PERGUNTA 1: DIVISOR DE ÁGUAS (Split) */}
            {currentStep === 'q1_split' && (
              <motion.div
                key="q1_split"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Passo Inicial 🔍</span>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                    Você já tem confirmado (por médico ou exames) que é intolerante ou alérgico à lactose?
                  </h2>
                </div>

                <div className="space-y-3 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSplitAnswer(true)}
                    disabled={isTransitioning}
                    className={`w-full text-left bg-[#F7F7F7] border border-gray-200 hover:border-[#2E7D32] hover:bg-[#E8F5E9] p-5 rounded-xl font-bold text-gray-800 hover:text-[#2E7D32] transition-all flex items-center justify-between group shadow-sm ${isTransitioning ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <div>
                      <span>Sim, já tenho certeza 👍</span>
                      <p className="text-xs text-gray-500 font-normal mt-1">Já sei que me faz mal ou tenho diagnóstico clínico.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2E7D32]" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSplitAnswer(false)}
                    disabled={isTransitioning}
                    className={`w-full text-left bg-[#F7F7F7] border border-gray-200 hover:border-[#2E7D32] hover:bg-[#E8F5E9] p-5 rounded-xl font-bold text-gray-800 hover:text-[#2E7D32] transition-all flex items-center justify-between group shadow-sm ${isTransitioning ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <div>
                      <span>Não tenho certeza ainda / Apenas suspeito 🤷‍♂️</span>
                      <p className="text-xs text-gray-500 font-normal mt-1">Sinto gases, cólicas e inchaço frequentes ao consumir.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2E7D32]" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* QUESTÕES DO FLUXO SELECIONADO */}
            {activeQuestion && (
              <motion.div
                key={activeQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
                    Pergunta {questionIndex + 2} de {activeQuestions.length + 1}
                  </span>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                    {activeQuestion.title}
                  </h2>
                  {activeQuestion.subtitle && (
                    <p className="text-sm text-gray-500 font-medium">{activeQuestion.subtitle}</p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  {activeQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerQuestion(option, activeQuestion.id)}
                      disabled={isTransitioning}
                      className={`w-full text-left bg-[#F7F7F7] border border-gray-200 hover:border-[#2E7D32] hover:bg-[#E8F5E9] p-4 rounded-xl font-semibold text-gray-800 hover:text-[#2E7D32] transition-all flex items-center justify-between group shadow-sm ${isTransitioning ? 'pointer-events-none opacity-80' : ''}`}
                    >
                      <span>{option.text}</span>
                      <div className="w-6 h-6 rounded-full border border-gray-300 group-hover:border-[#2E7D32] flex items-center justify-center bg-white group-hover:bg-[#2E7D32]/10 transition">
                        <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#2E7D32]" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TELA DE PROCESSAMENTO */}
            {currentStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 border-4 border-gray-100 border-t-[#2E7D32] rounded-full animate-spin mx-auto" />
                
                <div className="space-y-2 h-14 flex items-center justify-center">
                  <motion.p
                    key={processingMsgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-bold text-gray-800"
                  >
                    {[
                      'Analisando seus sintomas...',
                      'Comparando seus hábitos alimentares...',
                      'Preparando seu resultado personalizado...'
                    ][processingMsgIndex]}
                  </motion.p>
                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div 
                    className="bg-[#2E7D32] h-full rounded-full transition-all duration-100"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Processando dados ({Math.round(processingProgress)}%)</p>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Rodapé */}
        {currentStep !== 'landing' && (
          <footer className="py-3 px-6 bg-white border-t border-gray-100 text-center shrink-0">
            <p className="text-[9px] text-gray-400 font-medium">
              © 2026 Receitas Sem Lactose. Todos os direitos reservados.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
