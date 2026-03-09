<div align="center">
<img width="1200" height="475" alt="Portal NIT" src="./nit - tema (1).png" />
</div>

# Portal NIT - Nordeste Locações

Portal do Núcleo de Inteligência e Tecnologia (NIT) da Nordeste Locações para centralização de demandas, automações e inovação tecnológica.

## 🚀 Sobre o Projeto

O Portal NIT é a plataforma oficial do Núcleo de Inteligência e Tecnologia da Nordeste Locações, desenvolvida para:

- **Centralizar demandas** de projetos tecnológicos
- **Automatizar processos** operacionais
- **Gerenciar solicitações** de forma organizada
- **Promover inovação** contínua na empresa

## 🎯 Funcionalidades

### 📋 Solicitação de Projetos
- Formulário completo para demandas tecnológicas
- Categorização por tipo e impacto
- Geração automática de tickets (NIT-YYYY-XXX)
- Notificação por e-mail para stakeholders

### 🏢 Gestão de Projetos
- Painel administrativo para gerenciamento
- Visualização de projetos desenvolvidos
- Interface responsiva e moderna
- Sistema de autenticação seguro

### 📊 Dashboard
- Visualização de projetos em destaque
- Métricas de impacto e eficiência
- Interface intuitiva para navegação

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite (better-sqlite3)
- **Estilização**: TailwindCSS
- **Animações**: Motion.dev
- **Ícones**: Lucide React
- **Build Tool**: Vite

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone [URL-DO-REPOSITORIO]
   cd portal-nit---nordeste-locações
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações de e-mail.

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run preview` - Preview do build
- `npm run clean` - Limpa o diretório dist
- `npm run lint` - Verificação de tipos TypeScript

## 📁 Estrutura do Projeto

```
portal-nit---nordeste-locações/
├── src/                    # Código fonte React
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Ponto de entrada
├── server.ts               # Servidor backend
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração do Vite
├── tsconfig.json          # Configuração TypeScript
├── .env.example           # Exemplo de variáveis de ambiente
└── README.md              # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# Configuração de E-mail
EMAIL_USER="seu-email@nordesteloc.com.br"
EMAIL_PASS="sua-senha-de-app"
```

### Banco de Dados

O sistema utiliza SQLite com o arquivo `nit_portal.db` criado automaticamente na primeira execução.

## 🎨 Tema e Identidade Visual

O portal utiliza a identidade visual da Nordeste Locações:

- **Cor primária**: Vermelho NIT (#E31E24)
- **Cor secundária**: Cinza escuro (#1F2937)
- **Fontes**: Sistema de fontes sans-serif
- **Design**: Moderno e responsivo

## 📧 Funcionalidades de E-mail

O sistema envia notificações automáticas para:
- Solicitante do projeto
- Equipe NIT 
- Stakeholders relevantes

## 🔐 Acesso Administrativo

O painel administrativo pode ser acessado clicando 3 vezes no logo "NIT" na navegação e utilizando a senha `201823`.

## 🤝 Contribuição

Este é um projeto interno da Nordeste Locações. Para sugestões ou melhorias, entre em contato com a equipe NIT.

## 📞 Suporte

- **Equipe NIT**: nit@nordesteloc.com.br


## 📄 Licença

Projeto desenvolvido internamente para Nordeste Locações © 2026

---

**Desenvolvido com ❤️ pelo Núcleo de Inteligência e Tecnologia**
