# Scrum Management Platform

A comprehensive full-stack web application designed to facilitate and streamline Scrum ceremonies and team collaboration. Built with modern technologies to provide an intuitive experience for agile teams.

## Overview

This platform provides essential tools for Scrum teams to conduct their ceremonies effectively, including retrospectives, planning poker sessions, team management, and roadmap visualization. The application supports both authenticated users (via Google OAuth) and guest participants, making it flexible for different team structures and workflows.

## Tech Stack

- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Google OAuth 2.0 + JWT tokens
- **Styling**: Tailwind CSS
- **Validation**: Zod + React Hook Form

## Key Features

### 🔄 Scrum Ceremonies
- **Retrospectives**: Interactive boards for team reflection and improvement planning
- **Planning Poker**: Estimation sessions for story pointing and effort planning
- **Roadmap Management**: Visual timeline and milestone tracking

### 👥 Team & Room Management
- **Team Creation**: Organize users into dedicated teams
- **Room-based Sessions**: Create dedicated spaces for each ceremony
- **Invite System**: Generate shareable links for team and room invitations

### 🔐 Flexible Access Control
- **Google OAuth Authentication**: Secure single sign-on with Google accounts
- **Guest Mode**: Allow participation without account creation (name-only access)
- **JWT Token Management**: Secure session handling with 24-hour token expiration
- **Role-based Permissions**: Different access levels for team members
- **Persistent Sessions**: Cookie-based authentication for seamless user experience

### 📋 Retrospective Features
- **Complete CRUD Operations**: Full management of boards, columns, and cards
- **Voting System**: Vote on cards with configurable limits per user
- **Anonymous Mode**: Enable honest feedback through anonymous participation
- **Card Visibility Controls**: Show/hide cards during different phases
- **Customizable Boards**: Configure column names and ordering to match team preferences
- **Interactive Cards**: Create, edit, and organize feedback cards with voting
- **Board Archiving**: Archive completed retrospectives for historical reference
- **Real-time Updates**: Live synchronization of votes and card changes
- **Permission Controls**: Creator-based permissions for board management
- **Swagger Documentation**: Complete API documentation available at `/api`

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Automatic theme detection and switching
- **Loading States**: Smooth transitions and feedback during operations
- **Error Handling**: Comprehensive error management and user feedback

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Google OAuth 2.0 credentials

### 🐳 Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd scrum-app

# Start the application with Docker Compose
docker-compose up -d
```

### 🚀 Manual Setup

#### Backend Setup (API)

1. **Navigate to API directory**:
   ```bash
   cd scrum-app-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=scrum_app

   # JWT Configuration
   JWT_SECRET=your-secret-key-here

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the API server**:
   ```bash
   npm run start:dev
   ```

#### Frontend Setup (Web)

1. **Navigate to web directory**:
   ```bash
   cd scrum-app-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (development)
   - Your production callback URL
6. Copy Client ID and Client Secret to your `.env.local`

### 📊 Database Setup

The application uses PostgreSQL with TypeORM. The database schema will be automatically created when you first run the application.

Default database configuration:
- Host: `localhost`
- Port: `5432`
- Database: `scrum_app`
- Username: `postgres`
- Password: `postgres`

### 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api (Swagger)

## Architecture

### 📁 Project Structure

```
scrum-app/
├── scrum-app-api/              # NestJS Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── user/           # User management
│   │   │   ├── retro/          # Retrospective features
│   │   │   └── rooms/          # Room management
│   │   ├── common/
│   │   │   ├── guards/         # Auth guards (JWT, Google)
│   │   │   ├── decorators/     # Custom decorators
│   │   │   └── filters/        # Exception filters
│   │   ├── shared/
│   │   │   ├── database/       # Database configuration
│   │   │   └── config/         # App configuration
│   │   └── main.ts
│   └── package.json
├── scrum-app-web/              # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── login/         # Authentication pages
│   │   │   └── layout.tsx
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/              # Utilities and contexts
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript definitions
│   └── package.json
├── docker-compose.yml         # Docker orchestration
└── README.md
```

### 🔗 API Endpoints

#### Authentication
- `POST /auth/guest` - Create guest user
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user info (protected)

#### Users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user account

#### Retro Boards
- `POST /retro-boards` - Create new retrospective board
- `GET /retro-boards` - List all active boards
- `GET /retro-boards/my-boards` - List user's boards
- `GET /retro-boards/:id` - Get board by ID with columns and cards
- `PUT /retro-boards/:id` - Update board (creator only)
- `DELETE /retro-boards/:id` - Delete board (creator only)
- `PUT /retro-boards/:id/archive` - Archive board (creator only)

#### Retro Columns
- `POST /retro-columns/board/:boardId` - Create column in board
- `GET /retro-columns/board/:boardId` - List board columns
- `GET /retro-columns/:id` - Get column by ID
- `PUT /retro-columns/:id` - Update column
- `DELETE /retro-columns/:id` - Delete column
- `PUT /retro-columns/board/:boardId/reorder` - Reorder board columns

#### Retro Cards
- `POST /retro-cards/column/:columnId` - Create card in column
- `GET /retro-cards/column/:columnId` - List column cards
- `GET /retro-cards/board/:boardId` - List board cards (sorted by votes)
- `GET /retro-cards/:id` - Get card by ID
- `PUT /retro-cards/:id` - Update card
- `DELETE /retro-cards/:id` - Delete card
- `POST /retro-cards/:id/vote` - Vote on card
- `DELETE /retro-cards/:id/vote` - Remove vote from card

### 🔐 Authentication Flow

1. **Google OAuth**: User clicks "Continue with Google"
2. **Redirect**: User is redirected to Google OAuth consent screen
3. **Callback**: Google redirects back with authorization code
4. **Token Exchange**: Backend exchanges code for user profile
5. **User Creation**: Create or update user in database
6. **JWT Generation**: Generate JWT token for session
7. **Frontend Redirect**: Redirect to dashboard with token
8. **Session Management**: Token stored in cookies for persistence

### 🎯 Security Features

- **JWT Tokens**: 24-hour expiration with automatic refresh
- **CORS Protection**: Configured for frontend domain
- **Input Validation**: Comprehensive validation with class-validator
- **SQL Injection Protection**: TypeORM with parameterized queries
- **Environment Variables**: Sensitive data in environment files
- **Cookie Security**: HTTPOnly cookies for token storage

## Development

### 🛠️ Available Scripts

#### Backend (scrum-app-api)
```bash
npm run start:dev    # Start development server with hot reload
npm run build        # Build for production
npm run start:prod   # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

#### Frontend (scrum-app-web)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### 🔧 Development Tools

- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint integration)
- **Swagger**: API documentation at `/api`
- **Hot Reload**: Automatic server restart on changes

### 🐛 Debugging

- Backend API runs on port `3001`
- Frontend dev server runs on port `3000`
- Database runs on port `5432`
- Check browser console for frontend errors
- Check terminal for backend logs

## Deployment

### 🐳 Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 📦 Production Build

1. **Build Backend**:
   ```bash
   cd scrum-app-api
   npm run build
   npm run start:prod
   ```

2. **Build Frontend**:
   ```bash
   cd scrum-app-web
   npm run build
   npm run start
   ```

### 🌍 Environment Variables

Ensure all environment variables are properly set for production:

- Update `FRONTEND_URL` to your production domain
- Update `GOOGLE_CALLBACK_URL` to your production callback
- Use secure `JWT_SECRET` in production
- Configure production database credentials

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check existing documentation
- Review the API documentation at `/api`
