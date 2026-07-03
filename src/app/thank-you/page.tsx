'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSession, trackFinishFunnel, QuizSession } from '../../lib/tracking';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Mail, 
  Download, 
  HelpCircle, 
  ArrowLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYouPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    const activeSession = trackFinishFunnel();
    setSession(activeSession);

    // Disparar confetes
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2E7D32', '#66BB6A', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2E7D32', '#66BB6A', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#2E7D32] rounded-full animate-spin" />
      </div>
    );
  }

  const itemsBought = [
    { name: 'Guia +200 Receitas Sem Lactose', price: 27.90, bought: true },
    { name: 'Guia Sobremesas Sem Lactose', price: 9.90, bought: session.order_bump_selected },
    { name: 'Receitas Anti-inflamatórias', price: 27.00, bought: session.upsell1_purchased },
    { name: 'Plano Alimentar Intestino Sensível', price: 37.00, bought: session.upsell2_purchased },
  ].filter(item => item.bought);

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between p-6">
        
        {/* Top Success Area */}
        <header className="space-y-4 text-center shrink-0">
          <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-10 h-10 fill-[#2E7D32]/10" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 leading-snug">
              Compra Aprovada!
            </h1>
            <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-wider">Acesso liberado imediatamente</p>
          </div>
        </header>

        {/* Purchase Summary */}
        <main className="flex-1 flex flex-col justify-center py-6 space-y-6">
          <div className="bg-[#E8F5E9]/50 border border-[#2E7D32]/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2E7D32]/10">
              <Mail className="w-5 h-5 text-[#2E7D32]" />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Enviamos seus dados de acesso</p>
                <p className="text-[10px] text-gray-500">Verifique sua caixa de entrada e spam</p>
              </div>
            </div>

            {/* Itens do pedido */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Resumo do Pedido:</p>
              <div className="space-y-2">
                {itemsBought.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-gray-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      {item.name}
                    </span>
                    <span className="font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#2E7D32]/10 pt-2.5 flex justify-between font-black text-gray-900 text-sm">
                <span>Total Pago:</span>
                <span>R$ {session.revenue.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Dicas de Acesso */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
              Como acessar os materiais?
            </h4>
            <ol className="list-decimal list-inside text-[11px] text-gray-600 space-y-1.5 pl-1 leading-relaxed font-medium">
              <li>Acesse seu aplicativo de e-mail (o mesmo usado no checkout).</li>
              <li>Procure pela mensagem com o assunto: <strong>"Seu Acesso: Receitas Sem Lactose"</strong>.</li>
              <li>Clique no link enviado para fazer o download direto dos PDFs no seu celular ou computador.</li>
            </ol>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-xl font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Voltar ao Início</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-2 text-center text-[10px] text-gray-400 shrink-0 border-t border-gray-100 pt-4">
          <p className="font-semibold">Precisa de suporte? contato@receitassemlactose.com</p>
        </footer>

      </div>
    </div>
  );
}
