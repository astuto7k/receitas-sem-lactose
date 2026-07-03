'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrCreateSession, trackPurchase, trackPixel } from '../../lib/tracking';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  PlusCircle, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [orderBump, setOrderBump] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  
  // Dados de cartão de mentira
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  useEffect(() => {
    // Carregar sessão
    getOrCreateSession();
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    // Agrupar de 4 em 4
    if (val.length > 0) {
      val = val.match(/.{1,4}/g)?.join(' ') || val;
    }
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setCardCvv(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simular validação simples
    if (!name || !email) {
      alert('Por favor, preencha seu nome e e-mail.');
      return;
    }

    if (paymentMethod === 'card' && (cardNumber.replace(/\s/g, '').length < 16 || !cardExpiry || cardCvv.length < 3)) {
      alert('Por favor, preencha os dados do cartão de crédito fictício.');
      return;
    }

    // Executar a compra principal
    trackPurchase(orderBump);
    
    // Redirecionar para o Upsell 1
    router.push('/upsell-1');
  };

  const totalPrice = 27.90 + (orderBump ? 9.90 : 0);

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between">
        
        {/* Header seguro */}
        <header className="py-4 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#2E7D32]" />
            <span className="font-bold text-gray-800 text-sm tracking-tight">Checkout Seguro</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garantia de 7 Dias</span>
          </div>
        </header>

        {/* Formulário de pagamento */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900 leading-snug">Preencha seus dados para finalizar a compra</h2>
            <p className="text-xs text-gray-500">Você receberá os dados de acesso imediatamente no seu e-mail.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Informações Pessoais */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. Dados Pessoais</h3>
              <div className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
                />
                <input
                  type="email"
                  required
                  placeholder="Seu Melhor E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
                />
              </div>
            </div>

            {/* ORDER BUMP */}
            <div className="bg-[#E8F5E9] border-2 border-dashed border-[#2E7D32] rounded-2xl p-4.5 space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[8px] font-extrabold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>Oferta Especial</span>
              </div>
              
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="order-bump"
                  checked={orderBump}
                  onChange={(e) => setOrderBump(e.target.checked)}
                  className="mt-1.5 w-5 h-5 rounded border-gray-300 text-[#2E7D32] focus:ring-[#2E7D32] cursor-pointer"
                />
                <label htmlFor="order-bump" className="cursor-pointer space-y-1.5 select-none">
                  <span className="font-extrabold text-gray-900 text-sm flex items-center gap-1 leading-none">
                    <PlusCircle className="w-4 h-4 text-[#2E7D32] inline shrink-0" />
                    Adicionar Sobremesas Sem Lactose
                  </span>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    Tenha acesso a 50 receitas extras de sobremesas deliciosas e 100% sem lactose por apenas um pagamento extra único.
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] text-gray-400 line-through">De R$ 29,90</span>
                    <span className="text-xs font-bold text-[#2E7D32]">Por apenas R$ 9,90</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Método de Pagamento</h3>
              
              {/* Botões seletores */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'bg-white border-[#2E7D32] text-[#2E7D32] shadow-sm'
                      : 'bg-[#F7F7F7] border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'pix'
                      ? 'bg-white border-[#2E7D32] text-[#2E7D32] shadow-sm'
                      : 'bg-[#F7F7F7] border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  Pix (Acesso Imediato)
                </button>
              </div>

              {/* Formulários específicos de pagamento */}
              {paymentMethod === 'card' ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2"
                >
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Dados de Cartão de Teste</div>
                  <input
                    type="text"
                    required={paymentMethod === 'card'}
                    placeholder="Número do Cartão"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#2E7D32] text-gray-800 transition"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      placeholder="Validade (MM/AA)"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#2E7D32] text-gray-800 transition"
                    />
                    <input
                      type="password"
                      required={paymentMethod === 'card'}
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#2E7D32] text-gray-800 transition"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-[#E8F5E9] border border-[#66BB6A]/30 p-4 rounded-xl mt-2 text-center space-y-2"
                >
                  <QrCode className="w-10 h-10 text-[#2E7D32] mx-auto" />
                  <p className="font-bold text-gray-800 text-xs">Pague via PIX na próxima tela</p>
                  <p className="text-[10px] text-gray-500">O código de pagamento será gerado assim que você clicar no botão abaixo. A liberação do e-book é instantânea.</p>
                </motion.div>
              )}
            </div>

            {/* Resumo do Pedido e Botão de Finalizar */}
            <div className="space-y-4 pt-2">
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Guia +200 Receitas Sem Lactose</span>
                  <span>R$ 27,90</span>
                </div>
                {orderBump && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sobremesas Sem Lactose (Order Bump)</span>
                    <span>R$ 9,90</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-gray-900 text-base pt-1">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Finalizar Compra</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

          </form>
        </main>

        {/* Footer Seguro */}
        <footer className="py-4 px-6 bg-white border-t border-gray-100 text-center shrink-0">
          <div className="flex justify-center items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span>Conexão criptografada (SSL) de alta segurança</span>
          </div>
          <p className="text-[9px] text-gray-400">
            Seus dados estão protegidos. Nós não compartilhamos suas informações pessoais.
          </p>
        </footer>

      </div>
    </div>
  );
}
