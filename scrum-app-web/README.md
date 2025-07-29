# Scrum App Web

Aplicação frontend em Next.js com React 19 para o sistema de gerenciamento Scrum.

## Características

- **Framework**: Next.js 15 com App Router
- **UI**: React 19 + TypeScript + Tailwind CSS
- **Autenticação**: Sistema customizado com suporte a login e acesso de convidado
- **Estado**: Context API para gerenciamento de autenticação
- **HTTP Client**: Axios com interceptors para tratamento de tokens
- **Formulários**: React Hook Form + Zod para validação
- **Ícones**: Lucide React

## Estrutura do Projeto

```
src/
├── app/                    # Pages do Next.js (App Router)
│   ├── dashboard/         # Área logada principal
│   ├── login/            # Página de login
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizáveis
│   ├── Button.tsx       # Componente de botão
│   ├── Card.tsx         # Componentes de card
│   ├── Header.tsx       # Header da aplicação
│   ├── Input.tsx        # Input customizado
│   └── LoginForm.tsx    # Formulário de login
├── lib/                 # Utilitários e configurações
│   └── auth-context.tsx # Context de autenticação
├── services/           # Serviços de API
│   ├── api.ts         # Cliente HTTP base
│   └── auth.ts        # Serviços de autenticação
└── types/             # Definições TypeScript
    └── auth.ts        # Tipos relacionados à autenticação
```

## Funcionalidades

### Autenticação
- Login com email/senha
- Acesso como convidado (apenas com nome)
- Proteção de rotas com middleware
- Logout com limpeza de tokens
- Persistência de sessão via cookies

### Dashboard
- Área logada com informações do usuário
- Cards de estatísticas
- Sprint atual e progresso
- Atividades recentes
- Header com informações do usuário e logout

### UI/UX
- Design responsivo com Tailwind CSS
- Componentes reutilizáveis
- Loading states
- Tratamento de erros
- Indicadores visuais para usuários convidados

## Configuração

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com as configurações:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Build para produção**:
   ```bash
   npm run build
   npm start
   ```

## Integração com API

A aplicação está configurada para integrar com a API `scrum-app-api` rodando na porta 3001.

### Endpoints utilizados:
- `POST /auth/guest` - Criar usuário convidado
- `GET /auth/google` - Iniciar autenticação com Google
- `GET /auth/google/callback` - Callback do Google OAuth
- `GET /auth/me` - Obter usuário atual

### Autenticação
- **Google OAuth**: Login seguro com conta Google via botão "Continuar com Google"
- **Acesso como Convidado**: Login rápido apenas com nome
- **Tokens JWT**: Armazenados em cookies com expiração de 24 horas
- **Interceptors**: Axios adiciona automaticamente o token nos headers
- **Redirecionamento**: Automático para login em caso de token expirado
- **Middleware**: Proteção de rotas e redirecionamento baseado em autenticação

## Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executa a versão de produção
- `npm run lint` - Executa o linter

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- Lucide React
- js-cookie

## Fluxo de Autenticação

1. **Usuário acessa a aplicação**
2. **Middleware verifica se há token válido**
3. **Se não autenticado**: redireciona para `/login`
4. **Na tela de login**: usuário pode escolher entre:
   - **Google OAuth**: Login com conta Google
   - **Acesso como convidado**: Login apenas com nome
5. **Autenticação Google**:
   - Redirecionamento para Google OAuth
   - Callback em `/login/callback` com token
   - Processamento automático do token
6. **Após autenticação**: redireciona para `/dashboard`
7. **Token é persistido**: em cookies para manter sessão entre reloads
8. **Expiração**: Tokens têm duração de 24 horas

## Próximos Passos

- Implementar páginas de equipes e sprints
- Adicionar funcionalidades de retrospectiva
- Implementar sistema de notificações
- Adicionar testes unitários e de integração
- Configurar CI/CD
