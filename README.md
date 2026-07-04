# Receitas Sem Lactose

Funil low ticket em Next.js para o produto **Metodo Viver Sem Lactose**.

## Rotas principais

- `/` - quiz principal.
- `/s` - entrada direta para quem ja sabe que precisa evitar lactose.
- `/n` - entrada direta para quem ainda suspeita.
- `/s-lp` - oferta para perfil confirmado.
- `/n-lp` - oferta para perfil suspeita.
- `/checkout` - ponte para checkout externo ou WhatsApp.
- `/dash` - painel local de metricas do funil.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CHECKOUT_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Use `NEXT_PUBLIC_WHATSAPP_NUMBER` para a oferta X1 modelada: a pessoa recebe o livro no WhatsApp, testa e paga R$ 10,00 se gostar. Use `NEXT_PUBLIC_CHECKOUT_URL` apenas se quiser trocar para checkout real. Se os dois forem preenchidos, o WhatsApp tem prioridade.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Checklist antes de subir trafego

- Pixel real configurado em `NEXT_PUBLIC_META_PIXEL_ID`.
- WhatsApp configurado para a oferta de R$ 10,00 apos teste, ou checkout real configurado se mudar o mecanismo.
- UTMs aplicadas nos anuncios: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- Supabase configurado se quiser medir abandono e leads fora do navegador local.
- Criativo e copy sem promessa de diagnostico, cura ou resultado medico.
- WhatsApp com resposta rapida pronta para objeções: preço, acesso, garantia e ingredientes.
