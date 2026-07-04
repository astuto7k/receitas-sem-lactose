'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSession, trackInitiateCheckout } from '../../lib/tracking';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  TrendingDown, 
  Clock,
  BookOpen,
  Apple,
  Utensils,
  MapPin,
  ListTodo,
  Shield,
  HelpCircle,
  Mail,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Heart
} from 'lucide-react';
import Image from 'next/image';

export default function ConfirmedLP() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string>('Encontrar receitas saborosas e fáceis');
  const [missedFood, setMissedFood] = useState<string>('Pizza e queijos derretidos');

  // Timer regressivo
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const session = getOrCreateSession('confirmed');
    if (session && session.answers) {
      if (session.answers.q3_conf) setDifficulty(session.answers.q3_conf);
      if (session.answers.q5_conf) setMissedFood(session.answers.q5_conf);
    }

    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prev => prev - 1);
      } else if (minutes > 0) {
        setMinutes(prev => prev - 1);
        setSeconds(59);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const handleCheckout = () => {
    trackInitiateCheckout(false);
    router.push('/checkout');
  };

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 w-full bg-[#FAF6F1] text-[#3A2817] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-[#F0E8DC] flex flex-col justify-between">
        
        {/* Barra estilo portal de notícia vermelho no topo */}
        <div className="bg-[#B91C1C] text-white py-2 px-4 text-center font-extrabold text-[9px] uppercase tracking-widest shrink-0">
          🚨 Plantão de Saúde: Casos de intolerância alimentar crescem 34% no Brasil
        </div>

        {/* Portal Header */}
        <header className="border-b border-[#F0E8DC] bg-white shrink-0">
          <div className="px-4 py-1.5 bg-[#FAF6F1]/50 border-b border-[#F0E8DC]/50 flex items-center justify-center gap-4 text-[9px] font-bold text-gray-500 overflow-x-auto whitespace-nowrap">
            <span className="text-[#2E7D32]">saude.com</span>
            <span>digestão</span>
            <span>nutrição</span>
            <span>receitas</span>
            <span>estilo de vida</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="font-serif font-black text-xl tracking-tight text-[#2D1810]">
              portal<span className="text-[#2E7D32]">saúde</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Diagnóstico Oficial</span>
            </div>
          </div>
        </header>

        {/* Corpo Principal da LP */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* Hero de alerta com diagnóstico */}
          <section className="bg-red-50/70 border border-red-150 rounded-2xl p-5 space-y-4 text-center">
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              ⚠️ Atenção: Diagnóstico Concluído
            </span>
            <h1 className="text-xl font-black text-[#2D1810] leading-tight">
              INTOLERÂNCIA CONFIRMADA: SEU INTESTINO ESTÁ EM RISCO
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Cruzando os dados de seus sintomas com o seu perfil, identificamos que a maior agressão no seu dia a dia decorre da dificuldade em: <br />
              <span className="text-gray-900 font-extrabold">👉 "{difficulty}"</span> <br />
              E o alimento que mais provoca atrofia digestiva é: <br />
              <span className="text-gray-900 font-extrabold">👉 "{missedFood}"</span>.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs flex flex-col justify-center">
                <span className="text-red-600 font-black text-xs">CRÍTICO</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">Nível de Risco</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs flex flex-col justify-center">
                <span className="text-gray-900 font-black text-xs">30 dias</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">Para Regenerar</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs flex flex-col justify-center">
                <span className="text-gray-900 font-black text-xs">14.892</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">Já Usaram</span>
              </div>
            </div>
          </section>

          {/* Seção DOR */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[#2D1810] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Você provavelmente está vivendo isso hoje:
            </h2>
            <div className="space-y-3">
              {[
                'Evita comer o que ama com receio de estufamento e pontadas na barriga.',
                'Gasta 3x mais comprando produtos com o rótulo "Zero Lactose" no mercado.',
                'Tem medo de aceitar convites de jantares ou almoçar fora com amigos.',
                'Não sabe o que cozinhar no dia a dia para substituir leite, queijo ou manteiga.',
                'Sente cansaço e fadiga após as refeições devido ao intestino sobrecarregado.',
                'Depende de enzimas lactase artificiais caras que perdem o efeito rápido.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#3A2817] font-semibold leading-relaxed">
                  <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção AGRAVAMENTO / STAKES */}
          <section className="bg-red-50/40 border border-red-100/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Consequências Críticas</span>
            </div>
            <h2 className="text-sm font-black text-[#2D1810]">
              E se você não fizer nada nos próximos 30 dias?
            </h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Consumir lactose ou produtos errados sob inflamação ativa atrofia as vilosidades do intestino, gerando:
            </p>
            <div className="space-y-3">
              {[
                'Danos à mucosa intestinal, reduzindo a capacidade do corpo de absorver vitaminas (Cálcio, B12, Ferro).',
                'Sensibilidade digestiva em cascata, passando a reagir mal a outros alimentos como glúten e frutose.',
                'Aumento do estufamento abdominal diário (disbiose), pois bactérias ruins fermentam a lactose residual.',
                'Gastos pesados com exames, farmácia e consultas paliativas sem resolver a raiz.',
                'Piora drástica da imunidade, já que 80% das células imunes estão localizadas no intestino.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-red-900 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-red-150 pt-3 text-center">
              <p className="text-xs font-extrabold text-[#2D1810]">
                Os próximos 30 dias vão decidir o futuro da sua saúde digestiva.
              </p>
            </div>
          </section>

          {/* Apresentação do Produto */}
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[9px] font-black text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                ✨ A solução definitiva para o seu caso
              </span>
              <h2 className="text-lg font-black text-gray-900 pt-3">Método Viver Sem Lactose</h2>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold px-4">
                Um guia passo a passo completo digital, focado na substituição inteligente e na regeneração da barreira digestiva em 30 dias.
              </p>
            </div>

            {/* Imagem do Mockup do Produto */}
            <div className="my-6 flex justify-center">
              <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-xl border border-gray-150 bg-gray-50">
                <Image 
                  src="/mockup.jpg" 
                  alt="Mockup Guia Viver Sem Lactose" 
                  fill
                  sizes="224px"
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="bg-[#FAF6F1] border border-[#F0E8DC] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                  <BookOpen className="w-4 h-4 text-[#2E7D32]" />
                  <span>Guia Principal (+200 Receitas Sem Lactose)</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed pl-6">
                  Cafés da manhã, almoços, sobremesas e lanches rápidos. Receitas 100% testadas com ingredientes baratos que você já tem em casa.
                </p>
              </div>

              <div className="bg-[#FAF6F1] border border-[#F0E8DC] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                  <Apple className="w-4 h-4 text-[#2E7D32]" />
                  <span>Bônus #1: Guia de Substituições Inteligentes</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed pl-6">
                  Aprenda a reproduzir leites vegetais cremosos, queijos derretidos e manteigas idênticas ao original.
                </p>
              </div>

              <div className="bg-[#FAF6F1] border border-[#F0E8DC] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                  <Utensils className="w-4 h-4 text-[#2E7D32]" />
                  <span>Bônus #2: Cardápio 30 Dias Sem Lactose</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed pl-6">
                  Rotina alimentar estruturada dia a dia para cicatrizar as paredes intestinais inflamadas.
                </p>
              </div>

              <div className="bg-[#FAF6F1] border border-[#F0E8DC] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  <span>Bônus #3: Guia de Comer Fora</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed pl-6">
                  Checklist prático de segurança para restaurantes, lanchonetes e viagens sem sustos.
                </p>
              </div>
            </div>
          </section>

          {/* Gráfico Comparativo em CSS */}
          <section className="bg-gray-50 border border-gray-200 rounded-3xl p-5 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-black text-gray-900 text-sm flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-[#2E7D32]" />
                Comparativo de Custos Mensais 💰
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Por que cozinhar em casa com o Guia compensa?</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Comer fora / Produtos Especiais</span>
                  <span>R$ 380,00/mês</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden flex items-center">
                  <div className="bg-red-500 h-full w-[90%] transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Enzimas Lactase em Farmácia</span>
                  <span>R$ 160,00/mês</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden flex items-center">
                  <div className="bg-amber-500 h-full w-[55%] transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#2E7D32]">
                  <span>Ingredientes do Nosso Guia</span>
                  <span>R$ 45,00/mês</span>
                </div>
                <div className="w-full bg-[#E8F5E9] h-4 rounded-full overflow-hidden flex items-center border border-[#2E7D32]/20">
                  <div className="bg-[#2E7D32] h-full w-[15%] transition-all" />
                </div>
              </div>
            </div>
          </section>

          {/* Depoimentos reais */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[#2D1810] text-center uppercase tracking-wider">
              Veja quem já está vivendo sem lactose:
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  name: 'Juliana Mendes, 29',
                  img: '/juliana.jpg',
                  text: 'Em 2 semanas seguindo as receitas e o cardápio de desinflamação, minha barriga desinchou completamente. Voltei a ter prazer em comer sem medo de passar mal.'
                },
                {
                  name: 'Ricardo Santos, 43',
                  img: '/ricardo.jpg',
                  text: 'O guia de substituições mudou minha rotina. O queijo vegetal caseiro fica idêntico ao tradicional e é muito barato. Recomendo para todos.'
                },
                {
                  name: 'Clarissa Faria, 36',
                  img: '/clarissa.jpg',
                  text: 'Achei que comer saudável sem lactose custaria uma fortuna, mas o guia ensina a economizar muito no mercado. Minha digestão hoje é 100% leve.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#F0E8DC] p-4 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.img} alt={item.name} fill sizes="40px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                      <span className="text-[9px] text-[#2E7D32] font-black uppercase tracking-wider">Aluno Verificado ✓</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold italic">
                    "{item.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Seção VALUE STACK */}
          <section className="bg-[#2E7D32]/5 border border-[#2E7D32]/25 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest text-center border-b border-[#2E7D32]/10 pb-2">
              Tudo o que você leva ao entrar hoje:
            </h2>
            
            <div className="space-y-3 text-xs font-semibold text-gray-700">
              <div className="flex justify-between items-center">
                <span>Guia Principal (+200 Receitas):</span>
                <span className="text-red-500 font-bold line-through">R$ 97,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bônus #1 (Guia de Substituições):</span>
                <span className="text-red-500 font-bold line-through">R$ 47,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bônus #2 (Cardápio 30 Dias):</span>
                <span className="text-red-500 font-bold line-through">R$ 67,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bônus #3 (Guia de Comer Fora):</span>
                <span className="text-red-500 font-bold line-through">R$ 37,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bônus #4 (Lista de Compras Prática):</span>
                <span className="text-red-500 font-bold line-through">R$ 27,00</span>
              </div>
              
              <div className="border-t border-dashed border-[#2E7D32]/25 pt-3.5 space-y-2">
                <div className="flex justify-between items-center font-bold text-gray-700">
                  <span>Valor total se comprado separado:</span>
                  <span className="text-red-600 font-extrabold line-through">R$ 275,00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-[#2E7D32]">
                  <span>Desconto Quiz (90% OFF):</span>
                  <span>- R$ 247,10</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-black text-gray-900">Método Completo hoje:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#2E7D32]">R$ 27,90</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Countdown Regressivo */}
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2.5">
            <p className="text-[10px] text-amber-800 font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
              Oferta Especial Reservada Por:
            </p>
            <div className="flex justify-center gap-1">
              <span className="bg-white text-gray-900 font-black text-lg px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">{formatTime(minutes, seconds).split(':')[0]}</span>
              <span className="font-black text-lg text-amber-700 self-center">:</span>
              <span className="bg-white text-gray-900 font-black text-lg px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">{formatTime(minutes, seconds).split(':')[1]}</span>
            </div>
          </section>

          {/* GARANTIA */}
          <section className="bg-[#E8F5E9]/50 border border-[#2E7D32]/25 rounded-3xl p-5 text-center space-y-2.5">
            <Shield className="w-8 h-8 text-[#2E7D32] mx-auto" />
            <h3 className="font-black text-gray-900 text-sm">Garantia Risco Zero de 7 dias</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Você terá 7 dias para conhecer o material. Se por qualquer motivo não gostar ou achar que não é para você, poderá solicitar o reembolso integral dentro do prazo previsto.
            </p>
          </section>

          {/* FAQ */}
          <section className="space-y-3">
            <h3 className="text-sm font-black text-gray-900 text-center">Dúvidas Frequentes:</h3>
            
            <div className="space-y-3">
              {[
                { q: 'Como recebo o material?', a: 'Imediatamente após a confirmação do pagamento, enviamos as credenciais de acesso no seu e-mail cadastrado.' },
                { q: 'Funciona mesmo no celular?', a: 'Sim! O layout é 100% responsivo e otimizado para celulares, facilitando a consulta rápida na cozinha.' },
                { q: 'Preciso de conhecimento culinário?', a: 'Não. Todas as receitas foram criadas para iniciantes, com instruções passo a passo simples e ingredientes acessíveis.' },
                { q: 'O acesso expira?', a: 'Não. O seu acesso é permanente e vitalício, permitindo que você consulte o método quando quiser.' }
              ].map((faq, idx) => (
                <div key={idx} className="space-y-1 border-b border-gray-100 pb-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-semibold pl-5">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA FINAL COM ANIMAÇÃO */}
          <section className="bg-gray-50 border-t border-gray-200/50 p-5 rounded-3xl text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] text-[#2E7D32] font-black uppercase tracking-widest">Acesso Imediato</span>
              <h3 className="font-black text-gray-900 text-base">Quero Começar Agora</h3>
              <p className="text-xs text-gray-500 font-semibold">Receber meu acesso imediato por apenas <span className="text-gray-900 font-black">R$ 27,90</span>.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5 group animate-pulse"
            >
              <span>RECEBER MEU ACESSO AGORA</span>
              <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
            
            <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-bold">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> 7 Dias de Garantia</span>
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra Segura</span>
            </div>
          </section>

        </main>

        {/* Rodapé do Portal */}
        <footer className="py-6 px-6 bg-white border-t border-[#F0E8DC] text-center shrink-0 space-y-2">
          <p className="text-[9px] text-gray-400 leading-normal font-semibold">
            Este site representa a análise do Método Viver Sem Lactose e não substitui o diagnóstico médico especializado.
          </p>
          <p className="text-[9px] text-gray-400 font-medium">
            © 2026 Portal Saúde • LactoClean. Todos os direitos reservados.
          </p>
        </footer>

      </div>
    </div>
  );
}
