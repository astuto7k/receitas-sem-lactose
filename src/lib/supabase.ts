import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se as credenciais reais do Supabase estão configuradas
export const isSupabaseConfigured =
  supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '';

// Interface para simular respostas do Supabase
interface MockResponse<T> {
  data: T | null;
  error: Error | null;
}

// Simulador de banco de dados baseado em LocalStorage para quando o Supabase não estiver configurado
class MockSupabaseClient {
  private getStorage(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('mock_supabase_quiz_sessions');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler mock db:', e);
      return [];
    }
  }

  private saveStorage(data: any[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('mock_supabase_quiz_sessions', JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no mock db:', e);
    }
  }

  from(table: string) {
    if (table !== 'quiz_sessions') {
      throw new Error(`Tabela mock "${table}" não suportada.`);
    }

    const self = this;

    return {
      async insert(record: any): Promise<MockResponse<any[]>> {
        const currentData = self.getStorage();
        // Evitar duplicados se já existir ID
        const index = currentData.findIndex((item) => item.id === record.id);
        const newRecord = { 
          ...record, 
          created_at: record.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString() 
        };
        
        if (index > -1) {
          currentData[index] = newRecord;
        } else {
          currentData.push(newRecord);
        }
        
        self.saveStorage(currentData);
        return { data: [newRecord], error: null };
      },

      async update(record: any) {
        return {
          eq(field: string, value: any): Promise<MockResponse<any[]>> {
            const currentData = self.getStorage();
            const index = currentData.findIndex((item) => item[field] === value);
            if (index > -1) {
              const updatedRecord = { 
                ...currentData[index], 
                ...record, 
                updated_at: new Date().toISOString() 
              };
              currentData[index] = updatedRecord;
              self.saveStorage(currentData);
              return Promise.resolve({ data: [updatedRecord], error: null });
            }
            return Promise.resolve({ data: null, error: new Error('Registro não encontrado') });
          }
        };
      },

      select(columns: string = '*') {
        const allData = self.getStorage();
        
        // Retorna um builder encadeável simples para filtros de data
        return {
          data: allData,
          error: null,
          // Implementa encadeamentos simples para simular filtros de data
          gte(field: string, value: any) {
            this.data = this.data.filter((item) => {
              if (!item[field]) return false;
              return new Date(item[field]) >= new Date(value);
            });
            return this;
          },
          lte(field: string, value: any) {
            this.data = this.data.filter((item) => {
              if (!item[field]) return false;
              return new Date(item[field]) <= new Date(value);
            });
            return this;
          },
          order(field: string, options?: { ascending: boolean }) {
            const asc = options?.ascending !== false;
            this.data.sort((a, b) => {
              const valA = a[field];
              const valB = b[field];
              if (!valA) return 1;
              if (!valB) return -1;
              return asc 
                ? new Date(valA).getTime() - new Date(valB).getTime()
                : new Date(valB).getTime() - new Date(valA).getTime();
            });
            return this;
          },
          // Permitir await direto no objeto retornado
          then(resolve: any) {
            resolve({ data: this.data, error: null });
          }
        };
      }
    };
  }
}

// Exporta o cliente correto com base nas configurações
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase não configurado. Utilizando armazenamento local simulado (MockSupabaseClient) para analíticos e dados.'
  );
}
