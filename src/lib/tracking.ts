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
  // Facebook / UTM tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
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
    console.log(`[Meta Pixel Event] ${eventName}`, data || '');
    
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
      if (initialProfile && parsed.profile !== initialProfile) {
        parsed.profile = initialProfile;
        parsed.updated_at = new Date().toISOString();
        saveSessionLocally(parsed);
        syncSessionWithDatabase(parsed);
      }
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

  // Capturar parâmetros UTM / Facebook da URL
  let utms: Record<string, string> = {};
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    keys.forEach(k => {
      const val = searchParams.get(k);
      if (val) utms[k] = val;
    });
  } catch (urlErr) {
    console.error('Erro ao ler parâmetros da URL:', urlErr);
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
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_content: utms.utm_content,
    utm_term: utms.utm_term,
    fbclid: utms.fbclid,
  };

  saveSessionLocally(newSession);
  syncSessionWithDatabase(newSession);
  
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
  
  const prevStep = session.current_step;
  session.time_spent[prevStep] = (session.time_spent[prevStep] || 0) + timeSpentInCurrentStep;
  
  session.current_step = nextStep;
  session.updated_at = new Date().toISOString();

  if (answersToMerge) {
    session.answers = { ...session.answers, ...answersToMerge };
  }

  if (calculatedScoreDelta !== undefined) {
    session.score += calculatedScoreDelta;
  }

  stepStartTime = now;

  saveSessionLocally(session);
  syncSessionWithDatabase(session);

  if (nextStep === 'q1_split' || nextStep === 'q1') {
    trackPixel('ViewContent', { content_name: 'Quiz Sem Lactose - Iniciado' });
  } else if (nextStep === 'result' || nextStep === 'offer') {
    trackPixel('ViewContent', { content_name: 'Quiz Sem Lactose - Oferta Exibida', value: 10.00, currency: 'BRL' });
  }

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

  const price = 10.00 + (orderBumpSelected ? 9.90 : 0);

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
  
  const mainPrice = 10.00;
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
      content_name: 'Upsell 1 - Receitas Leves Sem Lactose',
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
