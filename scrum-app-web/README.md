# Scrum App Web

Next.js frontend application with React 19 for the Scrum management system.

## Features

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + TypeScript + Tailwind CSS
- **Authentication**: Custom system with login and guest access support
- **State**: Context API for authentication management
- **HTTP Client**: Axios with interceptors for token handling
- **Forms**: React Hook Form + Zod for validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js Pages (App Router)
│   ├── dashboard/          # Main logged area
│   ├── login/              # Login page
│   └── layout.tsx          # Main layout
├── components/             # Reusable components
│   ├── Button.tsx          # Button component
│   ├── Card.tsx            # Card components
│   ├── Header.tsx          # Application header
│   ├── Input.tsx           # Custom input
│   └── LoginForm.tsx       # Login form
├── lib/                    # Utilities and configurations
│   └── auth-context.tsx    # Authentication context
├── services/               # API services
│   ├── api.ts              # Base HTTP client
│   └── auth.ts             # Authentication services
└── types/                  # TypeScript definitions
    └── auth.ts             # Authentication related types
```

## Features

### Authentication
- Email/password login
- Guest access (name only)
- Route protection with middleware
- Logout with token cleanup
- Session persistence via cookies

### Dashboard
- Logged area with user information
- Statistics cards
- Current sprint and progress
- Recent activities
- Header with user information and logout

### Retrospectives
- **Boards**: Creation and management of retrospective sessions
- **Columns**: Organization of feedback categories
- **Cards**: Individual feedback items with voting system
- **Blur Mode**: 
  - Automatically blurs card content
  - Prevents bias during writing phase
  - Content becomes visible on hover
  - Can be enabled/disabled by board creator
  - Ideal for unbiased feedback collection
- **Voting**: Democratic feedback prioritization system
- **Anonymous Mode**: Allows honest feedback through anonymous participation

### UI/UX
- Responsive design with Tailwind CSS
- Reusable components
- Loading states
- Error handling
- Visual indicators for guest users

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

## Configuration

1. **Install dependencies**:
   
   ⚠️ **Important**: Run the installation command from the root of the repository:
   
   ```bash
   # Go to the root directory of the repository
   cd ../
   
   # Install dependencies for all projects
   yarn install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit the `.env.local` file with the settings:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run in development**:
   ```bash
   yarn dev
   ```

4. **Build for production**:
   ```bash
   yarn build
   yarn start
   ```

## API Integration

The application is configured to integrate with the `scrum-app-api` API running on port 3001.

### Used endpoints:
- `POST /auth/guest` - Create guest user
- `GET /auth/google` - Start Google authentication
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user

### Authentication
- **Google OAuth**: Secure login with Google account via "Continue with Google" button
- **Guest Access**: Quick login with name only
- **JWT Tokens**: Stored in cookies with 24-hour expiration
- **Interceptors**: Axios automatically adds token to headers
- **Redirect**: Automatic redirect to login on token expiration
- **Middleware**: Route protection and authentication-based redirection

## Available Scripts

- `yarn dev` - Run in development mode
- `yarn build` - Build for production
- `yarn start` - Run production version
- `yarn lint` - Run linter

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- Lucide React
- js-cookie

## Authentication Flow

1. **User accesses the application**
2. **Middleware checks for valid token**
3. **If not authenticated**: redirects to `/login`
4. **On login screen**: user can choose between:
   - **Google OAuth**: Login with Google account
   - **Guest Access**: Login with name only
5. **Google Authentication**:
   - Redirect to Google OAuth
   - Callback at `/login/callback` with token
   - Automatic token processing
6. **After authentication**: redirects to `/dashboard`
7. **Token is persisted**: in cookies to maintain session between reloads
8. **Expiration**: Tokens have 24-hour duration