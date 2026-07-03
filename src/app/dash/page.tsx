'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { QuizSession } from '../../lib/tracking';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Lock,
  ArrowRight,
  Database,
  RefreshCw,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Novo filtro por perfil
  const [profileFilter, setProfileFilter] = useState<'all' | 'confirmed' | 'suspect'>('all');

  // Carregar dados de autenticação
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('dash_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_DASH_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dash_authenticated', 'true');
      }
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('quiz_sessions').select('*');
      
      const now = new Date();
      if (filterType === 'today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        query = query.gte('created_at', startOfToday);
      } else if (filterType === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', sevenDaysAgo);
      } else if (filterType === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', thirtyDaysAgo);
      } else if (filterType === 'custom' && startDate) {
        query = query.gte('created_at', new Date(startDate).toISOString());
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query = query.lte('created_at', end.toISOString());
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar dados:', error);
      } else {
        setSessions(data || []);
      }
    } catch (e) {
      console.error('Erro de conexão:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, filterType, startDate, endDate]);

  // Função para popular dados de simulação otimizado para o novo fluxo Sim/Não
  const seedDemoData = () => {
    if (typeof window === 'undefined') return;
    
    const demoSessions: any[] = [];
    const now = Date.now();
    
    // Gerar 200 visitas simuladas distribuídas nos últimos 30 dias
    for (let i = 0; i < 200; i++) {
      const id = 'demo-session-' + i;
      const createdTime = now - Math.random() * 30 * 24 * 60 * 60 * 1000;
      const created_at = new Date(createdTime).toISOString();
      
      let current_step = 'landing';
      let answers: any = {};
      let time_spent: any = {};
      let score = 0;
      let checkout_initiated = false;
      let order_bump_selected = false;
      let purchased = false;
      let upsell1_purchased = false;
      let upsell2_purchased = false;
      let revenue = 0;
      let whatsapp = undefined;
      
      // Decidir perfil (Sim/Não)
      const profile = Math.random() > 0.5 ? 'confirmed' : 'suspect';

      const rand = Math.random();

      if (rand > 0.05) { // 95% iniciam o quiz (Q1 Split)
        current_step = 'q1_split';
        answers.q1_diagnostico = profile === 'confirmed' ? 'Sim, já tenho certeza' : 'Não, apenas suspeito pelos sintomas';
        time_spent.q1_split = Math.round(1500 + Math.random() * 3000);
        
        if (rand > 0.15) { // Q2
          current_step = 'quiz';
          if (profile === 'confirmed') {
            answers.q2_conf = ['Há menos de 6 meses', 'Entre 6 meses e 2 anos', 'Há mais de 2 anos'][Math.floor(Math.random() * 3)];
            time_spent.q2_conf = Math.round(2000 + Math.random() * 4000);
            score += 3;
          } else {
            answers.q2_susp = ['Quase todos os dias', 'Algumas vezes por semana', 'Raramente'][Math.floor(Math.random() * 3)];
            time_spent.q2_susp = Math.round(2500 + Math.random() * 4000);
            score += answers.q2_susp === 'Quase todos os dias' ? 5 : 3;
          }
          
          if (rand > 0.30) { // Q3
            if (profile === 'confirmed') {
              answers.q3_conf = ['Encontrar receitas saborosas', 'Comer fora de casa', 'Substituir leite', 'Preço zero lactose'][Math.floor(Math.random() * 4)];
              time_spent.q3_conf = Math.round(3000 + Math.random() * 5000);
              score += 4;
            } else {
              answers.q3_susp = ['Sim, percebo claramente', 'Às vezes noto uma relação', 'Nunca parei para analisar'][Math.floor(Math.random() * 3)];
              time_spent.q3_susp = Math.round(2000 + Math.random() * 4000);
              score += answers.q3_susp === 'Sim, percebo claramente' ? 5 : 3;
            }
            
            if (rand > 0.42) { // Q4
              if (profile === 'confirmed') {
                answers.q4_conf = ['Gases e inchaço', 'Dor de barriga', 'Diarreia', 'Refluxo'][Math.floor(Math.random() * 4)];
                time_spent.q4_conf = Math.round(2000 + Math.random() * 4000);
                score += 4;
              } else {
                answers.q4_susp = ['Sim, frequentemente', 'Às vezes', 'Raramente ou nenhum desses'][Math.floor(Math.random() * 3)];
                time_spent.q4_susp = Math.round(2000 + Math.random() * 4500);
                score += answers.q4_susp === 'Sim, frequentemente' ? 5 : 3;
              }
              
              if (rand > 0.52) { // Q5
                if (profile === 'confirmed') {
                  answers.q5_conf = ['Pizza e queijos', 'Sobremesas cremosas', 'Bolos', 'Molhos'][Math.floor(Math.random() * 4)];
                  time_spent.q5_conf = Math.round(2500 + Math.random() * 4000);
                  score += 3;
                } else {
                  answers.q5_susp = ['Pizza e queijos', 'Sobremesas e doces', 'Pães', 'Leite com café'][Math.floor(Math.random() * 4)];
                  time_spent.q5_susp = Math.round(2000 + Math.random() * 4000);
                  score += 3;
                }
                
                if (rand > 0.62) { // Q6
                  if (profile === 'confirmed') {
                    answers.q6_conf = ['Café da manhã', 'Almoço', 'Lanches', 'Sobremesas'][Math.floor(Math.random() * 4)];
                    time_spent.q6_conf = Math.round(2000 + Math.random() * 3500);
                    score += 3;
                  } else {
                    answers.q6_susp = ['Menos de 6 meses', 'Entre 6 meses e 2 anos', 'Mais de 2 anos'][Math.floor(Math.random() * 3)];
                    time_spent.q6_susp = Math.round(2000 + Math.random() * 3500);
                    score += answers.q6_susp === 'Mais de 2 anos' ? 5 : 3;
                  }
                  
                  if (rand > 0.70) { // Q7
                    if (profile === 'confirmed') {
                      answers.q7_conf = ['Com certeza', 'Sim, seria útil', 'Talvez'][Math.floor(Math.random() * 3)];
                      time_spent.q7_conf = Math.round(1500 + Math.random() * 3000);
                      score += 5;
                    } else {
                      answers.q7_susp = ['Não sabia', 'Sim, já ouvi falar', 'Nunca ouvi falar'][Math.floor(Math.random() * 3)];
                      time_spent.q7_susp = Math.round(1500 + Math.random() * 3000);
                      score += 5;
                    }
                    
                    if (rand > 0.75) { // Lead
                      current_step = 'lead';
                      if (Math.random() > 0.25) { // 75% deixam whats
                        whatsapp = `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                      }
                      
                      if (rand > 0.80) { // Offer / Result
                        current_step = 'offer';
                        
                        if (rand > 0.88) { // Checkout
                          current_step = 'checkout';
                          checkout_initiated = true;
                          order_bump_selected = Math.random() > 0.65; // 35% selecionam bump
                          
                          if (rand > 0.94) { // Purchase
                            current_step = 'thank-you';
                            purchased = true;
                            revenue = 27.90 + (order_bump_selected ? 9.90 : 0);
                            
                            if (Math.random() > 0.75) { 
                              upsell1_purchased = true;
                              revenue += 27.00;
                            }
                            if (Math.random() > 0.85) { 
                              upsell2_purchased = true;
                              revenue += 37.00;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      demoSessions.push({
        id,
        created_at,
        updated_at: created_at,
        whatsapp,
        score,
        current_step,
        profile,
        answers,
        time_spent,
        checkout_initiated,
        order_bump_selected,
        purchased,
        upsell1_purchased,
        upsell2_purchased,
        revenue
      });
    }

    localStorage.setItem('mock_supabase_quiz_sessions', JSON.stringify(demoSessions));
    alert('Dados de simulação gerados com sucesso no LocalStorage! O painel será atualizado.');
    fetchSessions();
  };

  const clearLocalData = () => {
    if (confirm('Deseja realmente limpar todos os dados do painel simulado?')) {
      localStorage.removeItem('mock_supabase_quiz_sessions');
      fetchSessions();
    }
  };

  const exportToCSV = () => {
    if (sessions.length === 0) return;
    
    const headers = ['ID', 'Criado Em', 'Perfil', 'Etapa Atual', 'WhatsApp', 'Pontuação', 'Abriu Checkout', 'Order Bump?', 'Comprou?', 'Receita Total'];
    const rows = sessions.map(s => [
      s.id,
      s.created_at,
      s.profile || 'Desconhecido',
      s.current_step,
      s.whatsapp || '',
      s.score,
      s.checkout_initiated ? 'Sim' : 'Não',
      s.order_bump_selected ? 'Sim' : 'Não',
      s.purchased ? 'Sim' : 'Não',
      s.revenue.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quiz_sem_lactose_analiticos_${filterType}_${profileFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CALCULAR MÉTRICAS DO FUNIL FILTRADAS
  const getFunnelMetrics = () => {
    // Filtrar sessões pelo perfil
    const filteredSessions = sessions.filter(s => 
      profileFilter === 'all' || s.profile === profileFilter
    );

    const total = filteredSessions.length;
    if (total === 0) {
      return {
        visitas: 0,
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
        q6: 0,
        q7: 0,
        lead: 0,
        resultado: 0,
        checkout: 0,
        compra: 0,
        completionRate: 0,
        checkoutCTR: 0,
        revenue: 0,
        avgTimes: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0 },
        biggestDropStep: 'Nenhum',
        biggestDropRate: 0
      };
    }

    const visitas = total;

    // Pergunta 1 (Split): Qualquer um que saiu da landing
    const q1 = filteredSessions.filter(s => s.current_step !== 'landing').length;
    
    // Pergunta 2: Tem resposta Q1 ou passou do split
    const q2 = filteredSessions.filter(s => 
      s.answers?.q1_diagnostico || !['landing', 'q1_split', 'q1'].includes(s.current_step)
    ).length;
    
    // Pergunta 3: Respondeu Q2
    const q3 = filteredSessions.filter(s => 
      s.answers?.q2_conf || s.answers?.q2_susp || s.answers?.q2
    ).length;
    
    // Pergunta 4: Respondeu Q3
    const q4 = filteredSessions.filter(s => 
      s.answers?.q3_conf || s.answers?.q3_susp || s.answers?.q3
    ).length;
    
    // Pergunta 5: Respondeu Q4
    const q5 = filteredSessions.filter(s => 
      s.answers?.q4_conf || s.answers?.q4_susp || s.answers?.q4
    ).length;

    // Pergunta 6: Respondeu Q5
    const q6 = filteredSessions.filter(s => 
      s.answers?.q5_conf || s.answers?.q5_susp || s.answers?.q5
    ).length;

    // Pergunta 7: Respondeu Q6
    const q7 = filteredSessions.filter(s => 
      s.answers?.q6_conf || s.answers?.q6_susp
    ).length;

    // Lead Capture: Respondeu Q7 ou passou para lead/processing/offer...
    const lead = filteredSessions.filter(s => 
      s.answers?.q7_conf || s.answers?.q7_susp || 
      ['lead', 'processing', 'offer', 'checkout', 'thank-you', 'purchased'].includes(s.current_step)
    ).length;

    // Resultado: Chegou na oferta
    const resultado = filteredSessions.filter(s => 
      ['offer', 'checkout', 'thank-you', 'purchased'].includes(s.current_step)
    ).length;

    // Checkout
    const checkout = filteredSessions.filter(s => 
      s.checkout_initiated || ['checkout', 'thank-you', 'purchased'].includes(s.current_step)
    ).length;

    // Compra
    const compra = filteredSessions.filter(s => s.purchased).length;

    // Taxa de conclusão
    const completionRate = q1 > 0 ? (resultado / q1) * 100 : 0;

    // CTR do Botão de Oferta
    const checkoutCTR = resultado > 0 ? (checkout / resultado) * 100 : 0;

    // Receita
    const revenue = filteredSessions.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

    // Calcular tempos médios de resposta por pergunta (em segundos)
    const getAvgTimeForStep = (stepNames: string[]) => {
      const stepTimes = filteredSessions
        .flatMap(s => stepNames.map(name => s.time_spent?.[name]))
        .filter(t => t !== undefined && t > 0) as number[];
      if (stepTimes.length === 0) return 0;
      const sum = stepTimes.reduce((acc, curr) => acc + curr, 0);
      return (sum / stepTimes.length) / 1000;
    };

    const avgTimes = {
      q1: getAvgTimeForStep(['q1_split', 'q1']),
      q2: getAvgTimeForStep(['q2_conf', 'q2_susp', 'q2']),
      q3: getAvgTimeForStep(['q3_conf', 'q3_susp', 'q3']),
      q4: getAvgTimeForStep(['q4_conf', 'q4_susp', 'q4']),
      q5: getAvgTimeForStep(['q5_conf', 'q5_susp', 'q5']),
      q6: getAvgTimeForStep(['q6_conf', 'q6_susp']),
      q7: getAvgTimeForStep(['q7_conf', 'q7_susp'])
    };

    // CALCULAR MAIOR PONTO DE ABANDONO DO FUNIL
    const funnelSteps = [
      { name: 'Início do Quiz', count: visitas, nextCount: q1 },
      { name: 'Pergunta 1 (Split)', count: q1, nextCount: q2 },
      { name: 'Pergunta 2', count: q2, nextCount: q3 },
      { name: 'Pergunta 3', count: q3, nextCount: q4 },
      { name: 'Pergunta 4', count: q4, nextCount: q5 },
      { name: 'Pergunta 5', count: q5, nextCount: q6 },
      { name: 'Pergunta 6', count: q6, nextCount: q7 },
      { name: 'Pergunta 7', count: q7, nextCount: lead },
      { name: 'Captura Lead', count: lead, nextCount: resultado },
      { name: 'Resultado/Oferta', count: resultado, nextCount: checkout },
      { name: 'Checkout', count: checkout, nextCount: compra }
    ];

    let biggestDropStep = 'Nenhum';
    let biggestDropRate = 0;

    funnelSteps.forEach(step => {
      if (step.count > 0) {
        const dropRate = ((step.count - step.nextCount) / step.count) * 100;
        if (dropRate > biggestDropRate) {
          biggestDropRate = dropRate;
          biggestDropStep = step.name;
        }
      }
    });

    return {
      visitas,
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
      lead,
      resultado,
      checkout,
      compra,
      completionRate,
      checkoutCTR,
      revenue,
      avgTimes,
      biggestDropStep,
      biggestDropRate
    };
  };

  const metrics = getFunnelMetrics();

  const getDropRate = (prev: number, curr: number) => {
    if (prev === 0) return 0;
    return ((prev - curr) / prev) * 100;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto shadow">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Acesso Restrito</h1>
            <p className="text-xs text-gray-400">Insira a senha administrativa para acessar o dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              placeholder="Senha de Acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
            />
            {loginError && <p className="text-xs text-red-500 font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5">
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // leads filtrados
  const leadSessions = sessions.filter(s => 
    s.whatsapp && (profileFilter === 'all' || s.profile === profileFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2E7D32]" />
            <h1 className="text-xl font-black tracking-tight text-gray-900">Painel de Conversão</h1>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-extrabold uppercase">Multi-Funil</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Seletor de Período */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1">
              {(['today', '7days', '30days', 'custom'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs capitalize transition ${
                    filterType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {type === 'today' ? 'Hoje' : type === '7days' ? '7 dias' : type === '30days' ? '30 dias' : 'Personalizado'}
                </button>
              ))}
            </div>

            {/* Ações */}
            <button onClick={exportToCSV} disabled={sessions.length === 0} className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition ${
              sessions.length > 0 ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
            }`}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button onClick={seedDemoData} className="p-2 bg-[#2E7D32]/10 text-[#2E7D32] hover:bg-[#2E7D32]/20 rounded-lg font-bold text-xs flex items-center gap-1.5 transition">
              <Database className="w-4 h-4" />
              <span>Simular Vendas</span>
            </button>
            
            <button onClick={clearLocalData} className="p-2 hover:bg-red-50 text-red-500 rounded-lg border border-transparent hover:border-red-200 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Inputs Período Personalizado */}
      {filterType === 'custom' && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]" />
            <span className="text-gray-400 text-xs">até</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]" />
          </div>
        </div>
      )}

      {/* Abas de Filtro de Perfil (Sim/Não) */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-6xl mx-auto flex border-b border-transparent">
          {[
            { id: 'all', label: 'Todos os Perfis' },
            { id: 'confirmed', label: 'Confirmados (/s)' },
            { id: 'suspect', label: 'Suspeitos (/n)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setProfileFilter(tab.id as any)}
              className={`py-3.5 px-5 font-bold text-xs border-b-2 transition -mb-px ${
                profileFilter === tab.id 
                  ? 'border-[#2E7D32] text-[#2E7D32]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto p-6 space-y-6 flex-1">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E7D32] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Metricas principais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visitantes</span>
                  <p className="text-2xl font-black text-gray-900">{metrics.visitas}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conclusão Quiz</span>
                  <p className="text-2xl font-black text-gray-900">{metrics.completionRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{metrics.resultado} na oferta</p>
                </div>
                <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compras</span>
                  <p className="text-2xl font-black text-gray-900">{metrics.compra}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Conversão: {(metrics.visitas > 0 ? (metrics.compra / metrics.visitas) * 100 : 0).toFixed(1)}%</p>
                </div>
                <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Faturamento</span>
                  <p className="text-2xl font-black text-gray-900">R$ {metrics.revenue.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Ticket Médio: R$ {metrics.compra > 0 ? (metrics.revenue / metrics.compra).toFixed(2) : '0,00'}</p>
                </div>
                <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Maior Abandono */}
            {metrics.biggestDropRate > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-800 text-sm">Maior ponto de abandono</h3>
                  <p className="text-xs text-amber-700 leading-relaxed font-semibold">
                    Cerca de <span className="font-extrabold text-amber-950">{metrics.biggestDropRate.toFixed(0)}%</span> abandonam na etapa <span className="underline">{metrics.biggestDropStep}</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Funil Visual e Mapa de Calor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Funil */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 space-y-6">
                <h3 className="font-black text-gray-900 text-base">Funil de Vendas Visual ({profileFilter === 'all' ? 'Todos os Perfis' : profileFilter === 'confirmed' ? 'Confirmados' : 'Suspeitos'})</h3>
                
                <div className="space-y-3.5">
                  {[
                    { label: 'Visitas', count: metrics.visitas, prev: 0 },
                    { label: 'Pergunta 1 (Split)', count: metrics.q1, prev: metrics.visitas },
                    { label: 'Pergunta 2', count: metrics.q2, prev: metrics.q1 },
                    { label: 'Pergunta 3', count: metrics.q3, prev: metrics.q2 },
                    { label: 'Pergunta 4', count: metrics.q4, prev: metrics.q3 },
                    { label: 'Pergunta 5', count: metrics.q5, prev: metrics.q4 },
                    { label: 'Pergunta 6', count: metrics.q6, prev: metrics.q5 },
                    { label: 'Pergunta 7', count: metrics.q7, prev: metrics.q6 },
                    { label: 'Captura Lead', count: metrics.lead, prev: metrics.q7 },
                    { label: 'Resultado', count: metrics.resultado, prev: metrics.lead },
                    { label: 'Checkout', count: metrics.checkout, prev: metrics.resultado },
                    { label: 'Compra', count: metrics.compra, prev: metrics.checkout }
                  ].map((step, idx) => {
                    const widthPct = metrics.visitas > 0 ? (step.count / metrics.visitas) * 100 : 0;
                    const dropRate = step.prev > 0 ? getDropRate(step.prev, step.count) : 0;

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-gray-100 text-gray-500 text-[10px] font-extrabold flex items-center justify-center">{idx + 1}</span>
                            {step.label}
                          </span>
                          <div className="space-x-3 text-right">
                            <span>{step.count} usuários</span>
                            {idx > 0 && <span className="text-red-500">-{dropRate.toFixed(0)}% drop</span>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-50 h-7 rounded-lg overflow-hidden border border-gray-100 flex items-center relative">
                          <div className="bg-[#2E7D32]/10 border-r-2 border-[#2E7D32] h-full transition-all duration-300" style={{ width: `${widthPct}%` }} />
                          <span className="absolute left-3 text-[10px] font-black text-[#2E7D32]">{widthPct.toFixed(1)}% do total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mapa de Calor */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="font-black text-gray-900 text-base">Tempo Médio de Resposta</h3>
                
                <div className="space-y-5">
                  {[
                    { label: 'Pergunta 1 (Split)', time: metrics.avgTimes.q1 },
                    { label: 'Pergunta 2', time: metrics.avgTimes.q2 },
                    { label: 'Pergunta 3', time: metrics.avgTimes.q3 },
                    { label: 'Pergunta 4', time: metrics.avgTimes.q4 },
                    { label: 'Pergunta 5', time: metrics.avgTimes.q5 },
                    { label: 'Pergunta 6', time: metrics.avgTimes.q6 },
                    { label: 'Pergunta 7', time: metrics.avgTimes.q7 }
                  ].map((step, idx) => {
                    const isRed = step.time >= 6;
                    const isAmber = step.time >= 4 && step.time < 6;
                    const colorClass = isRed ? 'bg-red-50 text-red-700 border-red-200' : isAmber ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    const barColor = isRed ? 'bg-red-500' : isAmber ? 'bg-amber-500' : 'bg-emerald-500';
                    const timeBarWidth = Math.min((step.time / 15) * 100, 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{step.label}</span>
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-black ${colorClass}`}>{step.time.toFixed(1)}s</span>
                        </div>
                        <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100 flex items-center">
                          <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${timeBarWidth}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex items-start gap-2 text-xs text-gray-500">
                  <AlertCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <p className="leading-normal font-semibold">Os tempos de resposta acima mostram onde os usuários gastaram mais tempo refletindo ou selecionando opções.</p>
                </div>
              </div>
            </div>

            {/* Tabela de Leads */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-base">Leads (WhatsApp)</h3>
                <div className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{leadSessions.length} Leads</span>
                </div>
              </div>

              {leadSessions.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400 font-semibold">Nenhum WhatsApp capturado neste período.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                        <th className="py-4 px-6">Data</th>
                        <th className="py-4 px-6">Perfil</th>
                        <th className="py-4 px-6">WhatsApp</th>
                        <th className="py-4 px-6">Pontos</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Receita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {leadSessions.map((session, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 font-medium">
                          <td className="py-4 px-6 whitespace-nowrap">{new Date(session.created_at).toLocaleString('pt-BR')}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              session.profile === 'confirmed' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {session.profile === 'confirmed' ? 'Confirmado (/s)' : 'Suspeito (/n)'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-900">{session.whatsapp}</td>
                          <td className="py-4 px-6 font-bold">{session.score} pts</td>
                          <td className="py-4 px-6">
                            {session.purchased ? (
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100 text-[10px] font-black uppercase">Comprou</span>
                            ) : session.checkout_initiated ? (
                              <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded border border-amber-100 text-[10px] font-black uppercase">Abandono Checkout</span>
                            ) : (
                              <span className="bg-gray-50 text-gray-400 px-2.5 py-1 rounded border border-gray-100 text-[10px] font-black uppercase">Abandono Quiz</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-gray-900">R$ {session.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
}
