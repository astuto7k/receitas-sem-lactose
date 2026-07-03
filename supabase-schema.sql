-- Tabela para armazenar as sessões do quiz e eventos de funil
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    whatsapp TEXT,
    score INTEGER DEFAULT 0 NOT NULL,
    current_step TEXT DEFAULT 'landing' NOT NULL,
    answers JSONB DEFAULT '{}'::jsonb NOT NULL,
    time_spent JSONB DEFAULT '{}'::jsonb NOT NULL, -- Armazena tempo em milissegundos por pergunta/etapa
    checkout_initiated BOOLEAN DEFAULT false NOT NULL,
    order_bump_selected BOOLEAN DEFAULT false NOT NULL,
    purchased BOOLEAN DEFAULT false NOT NULL,
    upsell1_purchased BOOLEAN DEFAULT false NOT NULL,
    upsell2_purchased BOOLEAN DEFAULT false NOT NULL,
    revenue NUMERIC(10, 2) DEFAULT 0.00 NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso públicas (para inserção e atualização pelo cliente do quiz)
CREATE POLICY "Allow public insert" ON quiz_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON quiz_sessions
    FOR UPDATE USING (true);

-- Criar política de leitura (se preferir acesso restrito, mas para simplificar no cliente)
CREATE POLICY "Allow public read" ON quiz_sessions
    FOR SELECT USING (true);

-- Criar índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions (created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_current_step ON quiz_sessions (current_step);
