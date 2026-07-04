'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getOrCreateSession,
  trackInitiateCheckout,
  saveSessionLocally,
  syncSessionWithDatabase
} from '../../lib/tracking';
import {
  ShieldCheck,
  Lock,
  MessageCircle,
  CheckCircle,
  ChevronRight,
  Mail,
  User,
  Phone,
  ExternalLink
} from 'lucide-react';

const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || '';
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export default function CheckoutPage() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    getOrCreateSession();
  }, []);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
    const formatted = val
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
    setWhatsapp(formatted);
  };

  const buildCheckoutUrl = () => {
    const url = new URL(checkoutUrl);
    url.searchParams.set('name', name.trim());
    url.searchParams.set('email', email.trim());
    url.searchParams.set('phone', whatsapp.replace(/\D/g, ''));
    return url.toString();
  };

  const buildWhatsAppUrl = () => {
    const message = [
      'Oi! Quero receber o livro Receitas Sem Lactose e testar antes de pagar.',
      '',
      `Nome: ${name.trim()}`,
      `E-mail: ${email.trim()}`,
      `WhatsApp: ${whatsapp}`,
      '',
      'Vim pelo quiz. Entendi que recebo o livro primeiro e pago R$ 10,00 se gostar.'
    ].join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      alert('Preencha nome, e-mail e WhatsApp para continuar.');
      return;
    }

    setIsSubmitting(true);

    const session = trackInitiateCheckout(false);
    session.whatsapp = whatsapp.replace(/\D/g, '');
    session.answers = {
      ...session.answers,
      lead_name: name.trim(),
      lead_email: email.trim(),
      lead_whatsapp: whatsapp.replace(/\D/g, '')
    };
    saveSessionLocally(session);
    syncSessionWithDatabase(session);

    if (whatsappNumber) {
      window.location.href = buildWhatsAppUrl();
      return;
    }

    if (checkoutUrl) {
      window.location.href = buildCheckoutUrl();
      return;
    }

    setIsSubmitting(false);
    alert('Configure NEXT_PUBLIC_CHECKOUT_URL ou NEXT_PUBLIC_WHATSAPP_NUMBER antes de subir tráfego.');
  };

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col justify-start">
      <div className="w-full max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-gray-100 flex flex-col justify-between">
        <header className="py-4 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#2E7D32]" />
            <span className="font-bold text-gray-800 text-sm tracking-tight">Acesso Seguro</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garantia de 7 Dias</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              Falta pouco para receber o Método Viver Sem Lactose
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Confirme seus dados para receber o livro pelo WhatsApp. Você testa as receitas e paga R$ 10,00 apenas se gostar.
            </p>
          </div>

          <div className="bg-[#E8F5E9]/70 border border-[#2E7D32]/20 rounded-2xl p-4 space-y-3">
            {[
              'Guia principal com +200 receitas sem lactose.',
              'Cardápio prático de 30 dias.',
              'Guia de substituições para leite, queijo, creme e manteiga.',
              'Acesso digital e garantia de 7 dias.'
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-gray-700 font-semibold leading-relaxed">
                <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Seus dados</h2>
              <label className="relative block">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
                />
              </label>
              <label className="relative block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
                />
              </label>
              <label className="relative block">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp com DDD"
                  value={whatsapp}
                  onChange={handleWhatsAppChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-gray-800 transition"
                />
              </label>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Método Viver Sem Lactose</span>
                <span>R$ 10,00</span>
              </div>
              <div className="flex justify-between font-extrabold text-gray-900 text-base">
                <span>Total</span>
                <span>R$ 10,00</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 px-6 rounded-xl font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 pointer-events-none' : ''}`}
            >
              {whatsappNumber ? <MessageCircle className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
              <span>{whatsappNumber ? 'Receber pelo WhatsApp' : 'Continuar'}</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed">
              Seus dados são usados apenas para liberar o acesso e prestar suporte sobre esta compra.
            </p>
          </form>
        </main>

        <footer className="py-4 px-6 bg-white border-t border-gray-100 text-center shrink-0">
          <div className="flex justify-center items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span>Ambiente protegido e oferta com garantia de 7 dias</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
