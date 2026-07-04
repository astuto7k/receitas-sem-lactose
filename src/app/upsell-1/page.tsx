'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSession, trackUpsell1 } from '../../lib/tracking';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  X,
  ShieldCheck,
  FlameKindling
} from 'lucide-react';

export default function Upsell1Page() {
  const router = useRouter();

  useEffect(() => {
    getOrCreateSession();
  }, []);

  const handleAccept = () => {
    trackUpsell1(true);
    router.push('/upsell-2');
  };

  const handleDecline = () => {
    trackUpsell1(false);
    router.push('/upsell-2');
  };

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between p-6">
        
        {/* Top Warning Banner */}
        <header className="space-y-4 text-center shrink-0">
          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-amber-200">
            <Sparkles className="w-3 h-3 fill-amber-700/10" />
            <span>Oferta única e exclusiva</span>
          </div>
          
          <h1 className="text-xl font-black text-gray-900 leading-snug">
            ESPERE! Não feche esta página ainda...
          </h1>
          
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Esta é a única oportunidade de adicionar este material complementar ao seu pedido com 60% de desconto.
          </p>
        </header>

        {/* Content body */}
        <main className="flex-1 flex flex-col justify-center py-6 space-y-6">
          {/* Card Apresentação */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <FlameKindling className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-gray-900 text-base">Receitas Leves para a Rotina</h3>
              <p className="text-xs text-gray-500 font-semibold">Ideias extras para variar o cardápio sem lactose</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Quando você tem mais opções prontas, fica mais fácil manter uma rotina alimentar simples, saborosa e sem depender de produtos caros.
            </p>
          </div>

          {/* Vantagens */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">O que você vai receber:</p>
            <ul className="space-y-2 text-xs text-gray-700 font-medium">
              {[
                'Guia com ingredientes leves e fáceis de encontrar.',
                '35 receitas rápidas e saborosas para o dia a dia.',
                'Combinações práticas para variar o cardápio.',
                'Bebidas e lanches simples para o dia a dia.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Box */}
          <div className="text-center space-y-1">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-[10px] text-gray-400 line-through font-semibold">De R$ 67,00</span>
              <span className="text-xs text-gray-500">Por apenas</span>
              <span className="text-2xl font-black text-gray-900">R$ 27,00</span>
            </div>
            <span className="text-[9px] text-[#2E7D32] font-bold uppercase tracking-wider block">Pagamento único • Sem mensalidades</span>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAccept}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-xl font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sim! Adicionar ao Meu Pedido</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            <button
              onClick={handleDecline}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 font-bold py-2 flex items-center justify-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              Não obrigado, quero recusar essa oferta especial.
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-2 text-center text-[10px] text-gray-400 shrink-0 border-t border-gray-100 flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span>Sua garantia de 7 dias também cobre este material extra.</span>
        </footer>

      </div>
    </div>
  );
}
