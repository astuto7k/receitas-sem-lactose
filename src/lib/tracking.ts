import { supabase } from './supabase';

export interface QuizSession {
  id: string;
  created_at: string;
  updated_at: string;
  whatsapp?: string;
  score: number;
  current_step: string;
  profile?: 'confirmed' | 'suspect';
  answers: Record<string, any>;
  time_spent: Record<string, number>; // tempo em ms
  checkout_initiated: boolean;
  order_bump_selected: boolean;
  purchased: boolean;
  upsell1_purchased: boolean;
  upsell2_purchased: boolean;
  revenue: number;
}

// Chave para salvar no localStorage
const LOCAL_STORAGE_KEY = 'receitas_sem_lactose_quiz_session';

// Função auxiliar para gerar um UUID v4
function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Disparar eventos do Meta Pixel de forma segura
export function trackPixel(eventName: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Exibir no console para depuração fácil
    console.log(`[Meta Pixel Event] ${eventName}`, data || '');
    
    // Chamar fbq real se existir
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      try {
        if (data) {
          fbq('track', eventName, data);
        } else {
          fbq('track', eventName);
        }
      } catch (err) {
        console.error('Erro ao disparar Meta Pixel:', err);
      }
    }
  }
}

// Inicializar ou recuperar sessão
export function getOrCreateSession(initialProfile?: 'confirmed' | 'suspect'): QuizSession {
  if (typeof window === 'undefined') {
    return {
      id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      score: 0,
      current_step: 'landing',
      profile: initialProfile,
      answers: {},
      time_spent: {},
      checkout_initiated: false,
      order_bump_selected: false,
      purchased: false,
      upsell1_purchased: false,
      upsell2_purchased: false,
      revenue: 0,
    };
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Se um perfil inicial foi passado e não está no cache local, atualiza
      if (initialProfile && parsed.profile !== initialProfile) {
        parsed.profile = initialProfile;
        parsed.updated_at = new Date().toISOString();
        saveSessionLocally(parsed);
        syncSessionWithDatabase(parsed);
      }
      // Garantir campos padrão se carregando dados antigos
      return {
        checkout_initiated: false,
        order_bump_selected: false,
        purchased: false,
        upsell1_purchased: false,
        upsell2_purchased: false,
        revenue: 0,
        ...parsed
      };
    }
  } catch (e) {
    console.error('Erro ao ler sessão do localStorage:', e);
  }

  // Se não existir, criar uma nova
  const newSession: QuizSession = {
    id: generateUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    score: 0,
    current_step: 'landing',
    profile: initialProfile,
    answers: {},
    time_spent: {},
    checkout_initiated: false,
    order_bump_selected: false,
    purchased: false,
    upsell1_purchased: false,
    upsell2_purchased: false,
    revenue: 0,
  };

  saveSessionLocally(newSession);
  syncSessionWithDatabase(newSession);
  
  // Disparar PageView inicial na criação da sessão
  trackPixel('PageView');
  
  return newSession;
}

// Atualizar seleção de perfil explicitamente
export function trackProfileSelection(profile: 'confirmed' | 'suspect') {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.profile = profile;
  session.updated_at = new Date().toISOString();

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  return session;
}

// Salvar sessão localmente
export function saveSessionLocally(session: QuizSession) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Erro ao salvar sessão localmente:', e);
  }
}

// Sincronizar sessão com o banco de dados (Supabase ou mock)
export async function syncSessionWithDatabase(session: QuizSession) {
  try {
    const { error } = await supabase.from('quiz_sessions').insert(session);
    if (error) {
      // Se der erro de chave duplicada (porque já inserimos antes), tentamos dar UPDATE
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update(session)
        .eq('id', session.id);
        
      if (updateError) {
        console.error('Erro ao atualizar sessão no DB:', updateError);
      }
    }
  } catch (e) {
    console.error('Erro de conexão ao sincronizar sessão:', e);
  }
}

// Atualizar etapa atual e cronometrar tempo
let stepStartTime: number = typeof window !== 'undefined' ? Date.now() : 0;

export function trackStepTransition(nextStep: string, answersToMerge?: Record<string, any>, calculatedScoreDelta?: number) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  const now = Date.now();
  const timeSpentInCurrentStep = now - stepStartTime;
  
  // Registrar tempo gasto na etapa anterior
  const prevStep = session.current_step;
  session.time_spent[prevStep] = (session.time_spent[prevStep] || 0) + timeSpentInCurrentStep;
  
  // Atualizar etapa
  session.current_step = nextStep;
  session.updated_at = new Date().toISOString();

  // Mesclar respostas se houver
  if (answersToMerge) {
    session.answers = { ...session.answers, ...answersToMerge };
  }

  // Adicionar pontuação se houver delta
  if (calculatedScoreDelta !== undefined) {
    session.score += calculatedScoreDelta;
  }

  // Resetar cronômetro para a nova etapa
  stepStartTime = now;

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  // Mapear disparos de eventos do Meta Pixel com base nas etapas importantes
  if (nextStep === 'q1') {
    trackPixel('ViewContent', { content_name: 'Quiz Sem Lactose - Iniciado' });
  } else if (nextStep === 'lead') {
    // Chegou na captura de lead
    trackPixel('ViewContent', { content_name: 'Quiz Sem Lactose - Respostas Prontas' });
  } else if (nextStep === 'result' || nextStep === 'offer') {
    // Visualizou o resultado/oferta
    trackPixel('ViewContent', { content_name: 'Quiz Sem Lactose - Oferta Exibida', value: 27.90, currency: 'BRL' });
  }

  return session;
}

// Capturar lead de WhatsApp
export function trackLeadWhatsApp(whatsapp: string) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.whatsapp = whatsapp;
  session.current_step = 'processing'; // transição automática
  session.updated_at = new Date().toISOString();

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  trackPixel('Lead', { content_category: 'Quiz Lead', content_name: 'WhatsApp Capture' });

  return session;
}

// Iniciar Checkout
export function trackInitiateCheckout(orderBumpSelected: boolean = false) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.checkout_initiated = true;
  session.order_bump_selected = orderBumpSelected;
  session.current_step = 'checkout';
  session.updated_at = new Date().toISOString();

  const price = 27.90 + (orderBumpSelected ? 9.90 : 0);

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  trackPixel('InitiateCheckout', {
    value: price,
    currency: 'BRL',
    content_name: 'Guia +200 Receitas Sem Lactose',
    content_ids: ['ebook-principal', ...(orderBumpSelected ? ['order-bump'] : [])]
  });

  return session;
}

// Finalizar Compra Principal (e Order Bump se selecionado)
export function trackPurchase(orderBumpSelected: boolean) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.purchased = true;
  session.order_bump_selected = orderBumpSelected;
  session.current_step = 'purchased';
  
  const mainPrice = 27.90;
  const bumpPrice = orderBumpSelected ? 9.90 : 0;
  session.revenue = mainPrice + bumpPrice;
  session.updated_at = new Date().toISOString();

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  trackPixel('Purchase', {
    value: session.revenue,
    currency: 'BRL',
    content_name: 'Compra Guia Principal',
    content_ids: ['ebook-principal', ...(orderBumpSelected ? ['order-bump'] : [])]
  });

  return session;
}

// Adicionar compra de Upsell 1
export function trackUpsell1(purchased: boolean) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.upsell1_purchased = purchased;
  session.current_step = 'upsell1';
  
  if (purchased) {
    session.revenue += 27.00;
    
    trackPixel('Purchase', {
      value: 27.00,
      currency: 'BRL',
      content_name: 'Upsell 1 - Receitas Anti-inflamatorias',
      content_ids: ['upsell-1']
    });
  }
  
  session.updated_at = new Date().toISOString();
  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  return session;
}

// Adicionar compra de Upsell 2
export function trackUpsell2(purchased: boolean) {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.upsell2_purchased = purchased;
  session.current_step = 'upsell2';
  
  if (purchased) {
    session.revenue += 37.00;
    
    trackPixel('Purchase', {
      value: 37.00,
      currency: 'BRL',
      content_name: 'Upsell 2 - Plano Alimentar Intestino Sensivel',
      content_ids: ['upsell-2']
    });
  }
  
  session.updated_at = new Date().toISOString();
  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  return session;
}

// Finalizar fluxo para página de Agradecimento
export function trackFinishFunnel() {
  const session = getOrCreateSession();
  if (!session.id) return session;

  session.current_step = 'thank-you';
  session.updated_at = new Date().toISOString();

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  return session;
}
