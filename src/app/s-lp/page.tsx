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
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

export default function ConfirmedLP() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string>('Encontrar receitas saborosas e fáceis');
  const [missedFood, setMissedFood] = useState<string>('Pizza e queijos derretidos');

  useEffect(() => {
    const session = getOrCreateSession('confirmed');
    if (session && session.answers) {
      if (session.answers.q3_conf) setDifficulty(session.answers.q3_conf);
      if (session.answers.q5_conf) setMissedFood(session.answers.q5_conf);
    }
  }, []);

  const handleCheckout = () => {
    trackInitiateCheckout(false);
    router.push('/checkout');
  };

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between">
        
        {/* Barra de Progresso Concluída */}
        <div className="sticky top-0 bg-white z-40 border-b border-gray-100 shrink-0">
          <div className="px-6 py-3 flex items-center justify-between bg-[#E8F5E9]/50">
            <span className="text-[10px] font-black text-[#2E7D32] uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              Relatório Personalizado
            </span>
            <span className="text-[10px] font-bold text-gray-500">Código: #LC-CONF</span>
          </div>
          <div className="w-full bg-gray-100 h-1">
            <div className="bg-[#2E7D32] h-full w-full" />
          </div>
          <div className="px-6 py-2 bg-[#2E7D32] text-white text-center text-xs font-bold tracking-wide">
            ✓ Seu resultado está pronto (100% Analisado)
          </div>
        </div>

        {/* Corpo Principal */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* BLOCO 1 - RESULTADO PERSONALIZADO (Acima da dobra) */}
          <section className="space-y-6 pt-2">
            <div className="bg-[#F7F7F7] border border-gray-200 rounded-2xl p-5 space-y-3.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Seu diagnóstico</span>
              
              <div className="space-y-3 text-sm text-gray-800 font-semibold leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <p>Sua maior dificuldade hoje no dia a dia é:<br />
                    <span className="text-gray-900 font-black">👉 {difficulty}</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <p>O alimento que você mais sente falta de comer é:<br />
                    <span className="text-gray-900 font-black">👉 {missedFood}</span>
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 font-medium leading-relaxed border-t border-gray-200 pt-3">
                A boa notícia é que você não precisa conviver com comida sem graça nem gastar uma fortuna em produtos industrializados para viver bem sem lactose.
              </p>
            </div>

            {/* Headline e Subheadline */}
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-black text-gray-950 leading-tight tracking-tight">
                Volte a Comer Pratos Deliciosos Sem Medo do Desconforto Após as Refeições 🍽️
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Descubra mais de 200 receitas práticas e substituições inteligentes que ajudam pessoas intolerantes à lactose a ter mais variedade nas refeições sem abrir mão do sabor.
              </p>
            </div>

            {/* CTA 1 */}
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5 group"
              >
                <span>QUERO MEU ACESSO AGORA</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
              
              <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-bold">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> 7 Dias de Garantia</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra Segura</span>
              </div>
            </div>
          </section>

          {/* BLOCO 2 — AUMENTO DA DOR */}
          <section className="bg-red-50/50 border border-red-100 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-red-950">Você provavelmente já passou por isso:</h3>
            
            <div className="space-y-3">
              {[
                'Abriu mão de comidas que ama;',
                'Gastou mais com produtos industrializados;',
                'Não soube o que preparar no dia a dia;',
                'Ficou com receio de comer fora.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-red-900 font-semibold">
                  <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-red-950 font-bold border-t border-red-200/50 pt-3">
              Mas viver sem lactose não precisa significar viver sem prazer na alimentação.
            </p>
          </section>

          {/* BLOCO 3 — APRESENTAÇÃO DA SOLUÇÃO */}
          <section className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full uppercase tracking-wider">A Solução Definitiva</span>
              <h2 className="text-xl font-black text-gray-950 pt-2">Método Viver Sem Lactose</h2>
              <p className="text-xs text-gray-400 font-semibold">Um programa digital criado para ajudar você a:</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Substituições Práticas', text: 'Substitua laticínios sem alterar o sabor.' },
                { title: 'Refeições Saborosas', text: 'Comidas cremosas e bem temperadas.' },
                { title: 'Planejamento 30 dias', text: 'Rotina organizada sem estresse.' },
                { title: 'Mais Segurança', text: 'Liberdade para comer sem medo.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#F7F7F7] border border-gray-100 rounded-2xl p-4 space-y-1">
                  <h4 className="text-xs font-black text-gray-900">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold leading-normal">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BLOCO 4 — O QUE VOCÊ RECEBE */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-gray-950 text-center">O que está incluído no seu plano:</h3>
            
            <div className="space-y-3">
              {/* Produto Principal */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-[#2E7D32]" />
                  <h4 className="font-extrabold text-gray-900 text-sm">+200 Receitas Sem Lactose</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold pl-7.5">
                  Cafés da manhã, almoços, jantares, sobremesas, bolos, lanches e bebidas. Receitas testadas e aprovadas para levar sabor à sua mesa.
                </p>
              </div>

              {/* Bônus 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[8px] font-black px-2 py-0.5 rounded-bl uppercase">Grátis</div>
                <div className="flex items-center gap-2.5">
                  <Apple className="w-5 h-5 text-[#2E7D32]" />
                  <h4 className="font-extrabold text-gray-900 text-sm">Bônus #1: Guia de Substituições Inteligentes</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold pl-7.5">
                  Aprenda o que usar no lugar de leite, queijo, creme de leite e manteiga sem alterar a cremosidade original.
                </p>
              </div>

              {/* Bônus 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[8px] font-black px-2 py-0.5 rounded-bl uppercase">Grátis</div>
                <div className="flex items-center gap-2.5">
                  <Utensils className="w-5 h-5 text-[#2E7D32]" />
                  <h4 className="font-extrabold text-gray-900 text-sm">Bônus #2: Cardápio 30 Dias Sem Lactose</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold pl-7.5">
                  Um plano simples estruturado por semanas para você não precisar pensar no que preparar.
                </p>
              </div>

              {/* Bônus 3 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[8px] font-black px-2 py-0.5 rounded-bl uppercase">Grátis</div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[#2E7D32]" />
                  <h4 className="font-extrabold text-gray-900 text-sm">Bônus #3: Guia de Comer Fora</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold pl-7.5">
                  Saiba como fazer escolhas mais seguras em restaurantes, casamentos e viagens, evitando contaminação.
                </p>
              </div>

              {/* Bônus 4 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[8px] font-black px-2 py-0.5 rounded-bl uppercase">Grátis</div>
                <div className="flex items-center gap-2.5">
                  <ListTodo className="w-5 h-5 text-[#2E7D32]" />
                  <h4 className="font-extrabold text-gray-900 text-sm">Bônus #4: Lista de Compras Prática</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold pl-7.5">
                  Tudo organizado em categorias para facilitar sua ida ao supermercado e economizar dinheiro.
                </p>
              </div>
            </div>
          </section>

          {/* BLOCO 5 — GRÁFICO EM CSS */}
          <section className="bg-gray-50 border border-gray-200 rounded-3xl p-5 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-black text-gray-900 text-sm flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-[#2E7D32]" />
                Comparativo de Custos Mensais 💰
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Por que cozinhar em casa com o Guia compensa?</p>
            </div>

            <div className="space-y-4 pt-2 font-bold">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-700">
                  <span>Opção A: Produtos Industriais "Zero Lactose"</span>
                  <span className="text-red-600">R$ 380/mês</span>
                </div>
                <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden flex items-center relative">
                  <div className="bg-red-500 h-full w-[100%] transition-all" />
                  <span className="absolute left-3 text-[10px] text-white">Preço Abusivo no Mercado ❌</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-700">
                  <span>Opção B: Cozinhar em Casa com o Nosso Guia</span>
                  <span className="text-[#2E7D32]">R$ 110/mês</span>
                </div>
                <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden flex items-center relative">
                  <div className="bg-[#2E7D32] h-full w-[29%] transition-all" />
                  <span className="absolute left-3 text-[10px] text-white">Economia de 71%! ✅</span>
                </div>
              </div>
            </div>
          </section>

          {/* MOCKUP DO PROGRAMA */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
            <Image 
              src="/mockup.jpg" 
              alt="Método Viver Sem Lactose" 
              fill
              className="object-cover"
              sizes="(max-w-md) 100vw, 400px"
              priority
            />
          </div>

          {/* DEPOIMENTOS */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-gray-950 text-center">Depoimentos de alunos:</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Juliana M., 29 anos', image: '/juliana.jpg', text: 'Eu já tinha desistido de comer pizza e doces. Com as receitas do guia, hoje faço substituições incríveis e não sinto nenhuma dor abdominal.' },
                { name: 'Ricardo S., 43 anos', image: '/ricardo.jpg', text: 'Minha maior surpresa foi economizar no mercado. Parar de comprar as coisas zero lactose industriais e começar a cozinhar certo cortou meus gastos pela metade.' },
                { name: 'Clarissa F., 36 anos', image: '/clarissa.jpg', text: 'O cardápio de 30 dias salvou minha rotina. As receitas são rápidas e muito saborosas, não parece em nada comida restritiva.' }
              ].map((dep, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 p-4.5 rounded-2xl space-y-3">
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">"{dep.text}"</p>
                  <div className="flex items-center gap-3 border-t border-gray-200/50 pt-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                      <Image
                        src={dep.image}
                        alt={dep.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-900 leading-none">{dep.name}</p>
                      <p className="text-[9px] text-[#2E7D32] font-bold mt-1">Aluno verificado ✓</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ENTREGA */}
          <section className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#2E7D32]" />
              Como funciona o envio?
            </h3>
            
            <ul className="space-y-2 text-xs text-gray-700 font-semibold leading-relaxed">
              <li>📧 **Acesso enviado por e-mail:** Nada de PDFs pesados que bloqueiam seu celular. O acesso chega em até 60 segundos após a confirmação.</li>
              <li>📱 **Compatibilidade total:** Funciona perfeitamente no celular, computador e tablet. Leia de qualquer lugar.</li>
              <li>♾️ **Acesso vitalício:** O material é seu para sempre. Você pode ver a hora que quiser, quando quiser, sem prazos de validade.</li>
            </ul>
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

          {/* CTA FINAL */}
          <section className="bg-gray-50 border-t border-gray-200/50 p-5 rounded-3xl text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Acesso Imediato</span>
              <h3 className="font-black text-gray-900 text-base">Quero Começar Agora</h3>
              <p className="text-xs text-gray-500 font-semibold">Receber meu acesso imediato por apenas <span className="text-gray-900 font-black">R$ 27,90</span>.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5 group animate-pulse"
            >
              <span>RECEBER MEU ACESSO AGORA</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </section>

        </main>

        {/* Rodapé da LP */}
        <footer className="py-4 px-6 bg-white border-t border-gray-100 text-center shrink-0">
          <p className="text-[9px] text-gray-400 font-medium">
            Termos de Uso | Políticas de Privacidade
          </p>
          <p className="text-[9px] text-gray-400 mt-1 font-medium">
            © 2026 Receitas Sem Lactose. Todos os direitos reservados.
          </p>
        </footer>

      </div>
    </div>
  );
}
