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

## Key Features

### Authentication
- Google OAuth login via backend integration
- Guest access with name-only registration
- Route protection with Next.js middleware
- Session persistence via secure cookies
- Automatic token refresh and cleanup

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
- Responsive design with Tailwind CSS (mobile-first approach)
- Dark mode support with automatic theme detection
- Reusable component library
- Loading states and skeleton screens
- Comprehensive error handling
- Visual indicators for guest users

## Setup and Configuration

For detailed setup instructions, please refer to the [main README](../README.md) in the root directory.

Quick reference for development:

1. **Install dependencies** (from repository root):
   ```bash
   yarn install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
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

The application integrates with the `scrum-app-api` backend running on port 3001.

### Key Endpoints Used:
- `POST /auth/guest` - Create guest user
- `GET /auth/google` - Start Google authentication
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user
- `/retro-*` - Retrospective board management

### Authentication Flow
1. User accesses the application
2. Middleware checks for valid JWT token in cookies
3. If not authenticated, redirects to `/login`
4. User can choose Google OAuth or Guest access
5. After successful authentication, redirects to dashboard
6. Token is stored in secure HTTPOnly cookies (24-hour expiration)
7. Axios interceptors automatically attach token to API requests

## Available Scripts

- `yarn dev` - Run in development mode with hot reload
- `yarn build` - Build for production
- `yarn start` - Run production build
- `yarn lint` - Run ESLint checks

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

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file in the repository root for contribution guidelines.