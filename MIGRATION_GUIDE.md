# 🚀 Guia de Migração: SQLite → Supabase

## 📋 Resumo das Alterações

### ✅ Arquivos Criados:
1. `src/lib/supabase.ts` - Cliente Supabase
2. `src/lib/api.ts` - API service layer
3. `server-supabase.ts` - Backend atualizado para Supabase
4. `src/App-supabase.tsx` - Frontend atualizado para Supabase

### ✅ Arquivos Modificados:
1. `package.json` - Adicionada dependência @supabase/supabase-js
2. `.env.example` - Adicionadas variáveis do Supabase

## 🛠️ Passos para Migração

### 1. Instalar Dependências
```bash
npm install @supabase/supabase-js
```

### 2. Configurar Variáveis de Ambiente
Crie o arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://rwzzfqqapqanjdqgpyef.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iWxD00ZTYSV6ARM9HxC2PA_gKRsakqb
```

### 3. Substituir Arquivos Principais

#### Opção A: Backend + Frontend (Recomendado)
```bash
# Backup dos arquivos atuais
mv server.ts server-sqlite-backup.ts
mv src/App.tsx src/App-sqlite-backup.tsx

# Substituir pelas versões Supabase
mv server-supabase.ts server.ts
mv src/App-supabase.tsx src/App.tsx
```

#### Opção B: Apenas Frontend (Sem Backend)
```bash
# Apenas substituir o frontend
mv src/App.tsx src/App-sqlite-backup.tsx
mv src/App-supabase.tsx src/App.tsx
```

### 4. Atualizar Scripts (se necessário)

Se usar apenas frontend, atualize `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🔧 Principais Diferenças

### Backend (server.ts)
- ✅ Substituição de `better-sqlite3` por cliente Supabase
- ✅ Queries SQL → métodos Supabase (select, insert, update, delete)
- ✅ Tratamento de erros padronizado
- ✅ Seed automático de projetos mantido

### Frontend (App.tsx)
- ✅ Chamadas `fetch('/api/...')` → `projectsAPI.getAll()`, etc.
- ✅ Tratamento de loading states
- ✅ Tratamento de erros melhorado
- ✅ Tipagem TypeScript para dados

### API Layer (src/lib/api.ts)
- ✅ Interface unificada para operações CRUD
- ✅ Tipagem TypeScript completa
- ✅ Geração automática de ticket IDs
- ✅ Tratamento de erros centralizado

## 🚀 Benefícios da Migração

### ✅ Vantagens do Supabase:
- **Database as a Service**: Sem necessidade de gerenciar servidor
- **Real-time**: WebSocket embutido para atualizações em tempo real
- **Authenticação**: Sistema completo de autenticação
- **RLS**: Row Level Security para controle de acesso
- **REST API**: API automática gerada a partir das tabelas
- **Dashboard**: Interface administrativa completa

### ✅ Vantagens Técnicas:
- **Performance**: Queries otimizadas pelo PostgreSQL
- **Escalabilidade**: Infraestrutura gerenciada
- **Backup**: Automático e gerenciado
- **Segurança**: Criptografia e controle de acesso

## 🧪 Testes

### 1. Testar Conexão
```javascript
// No console do navegador
import { supabase } from './src/lib/supabase.js';
supabase.from('projects').select('*').then(console.log);
```

### 2. Testar API
```javascript
// Testar projects API
import { projectsAPI } from './src/lib/api.js';
projectsAPI.getAll().then(console.log);
```

## 🔍 Troubleshooting

### Erros Comuns:

1. **CORS**: Configure no dashboard Supabase
2. **RLS**: Verifique políticas de acesso nas tabelas
3. **Variáveis de Ambiente**: Confirme `.env` está configurado
4. **Tipos TypeScript**: Execute `npm install` para atualizar tipos

### Comandos Úteis:
```bash
# Verificar tipos
npm run lint

# Limpar cache
npm run clean

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximos Passos

1. **Testar funcionalidades básicas** (CRUD de projetos)
2. **Testar formulário de solicitação**
3. **Verificar envio de e-mails** (ainda via backend)
4. **Configurar Real-time** (opcional)
5. **Implementar Auth** (opcional)

## 🎉 Migração Concluída!

Após seguir estes passos, sua aplicação estará usando Supabase com:
- ✅ Performance melhorada
- ✅ Escalabilidade garantida  
- ✅ Manutenção simplificada
- ✅ Recursos modernos (real-time, auth, etc.)

---

**Suporte**: Em caso de dúvidas, consulte a [documentação do Supabase](https://supabase.com/docs) ou entre em contato com a equipe NIT.
