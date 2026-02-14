# Scrum App API

NestJS-based backend API for the Scrum Management Platform. Provides comprehensive REST APIs for retrospectives, user management, and authentication with Google OAuth integration.

## Key Features

- **Authentication**: Google OAuth 2.0 + JWT tokens with guest user support
- **Retrospectives**: Complete CRUD operations for boards, columns, cards, and voting system
- **User Management**: User profiles and team management
- **Database**: PostgreSQL with TypeORM for type-safe database operations
- **Swagger Documentation**: Interactive API documentation at `/api/docs`
- **Validation**: Comprehensive input validation with class-validator
- **Security**: JWT authentication, CORS protection, input sanitization

## API Modules

### Authentication Module (`/auth`)
- Google OAuth integration
- Guest user creation
- JWT token management
- User session handling

### User Module (`/users`)
- User profile management
- User lookup and updates
- Account deletion

### Retrospective Module (`/retro-*`)
- **Boards**: Create and manage retrospective sessions
- **Columns**: Organize feedback categories
- **Cards**: Individual feedback items with voting
- **Voting System**: Democratic prioritization of feedback
- **Blur Mode**: Blur card content to prevent bias during writing phase

## Setup and Configuration

For detailed setup instructions including prerequisites and environment setup, please refer to the [main README](../README.md) in the root directory.

Quick reference for development:

### Project setup

⚠️ **Important**: Run the installation command from the root of the repository:

```bash
# Go to the root directory of the repository
cd ../

# Install dependencies for all projects
yarn install
```

### Environment Setup

Copy the environment file and configure variables:

```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=scrum_user
DATABASE_PASSWORD=scrum_password
DATABASE_NAME=scrum-app

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## API Documentation

Once the server is running, access the interactive Swagger documentation at:
```
http://localhost:3001/api/docs
```

This provides complete documentation for all endpoints including:
- Authentication flows
- Retrospective CRUD operations
- Request/response schemas
- Error handling examples

## Database Setup

The application uses PostgreSQL with TypeORM. See the [main README](../README.md) for database setup instructions.

For development, TypeORM will auto-sync entity changes. For production, use proper migrations.

## Available Endpoints

### Authentication (`/auth`)
- `POST /auth/guest` - Create guest user session
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle OAuth callback
- `GET /auth/me` - Get current user info (requires JWT)

### Users (`/users`)
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user account

### Retrospective Boards (`/retro-boards`)
- `POST /retro-boards` - Create new board
- `GET /retro-boards` - List all active boards
- `GET /retro-boards/my-boards` - List user's boards
- `GET /retro-boards/:id` - Get board with columns and cards
- `PUT /retro-boards/:id` - Update board (creator only)
- `DELETE /retro-boards/:id` - Delete board (creator only)
- `PUT /retro-boards/:id/archive` - Archive board

### Retrospective Columns (`/retro-columns`)
- `POST /retro-columns/board/:boardId` - Create column
- `GET /retro-columns/board/:boardId` - List board columns
- `GET /retro-columns/:id` - Get column details
- `PUT /retro-columns/:id` - Update column
- `DELETE /retro-columns/:id` - Delete column
- `PUT /retro-columns/board/:boardId/reorder` - Reorder columns

### Retrospective Cards (`/retro-cards`)
- `POST /retro-cards/column/:columnId` - Create card
- `GET /retro-cards/column/:columnId` - List column cards
- `GET /retro-cards/board/:boardId` - List board cards (sorted by votes)
- `GET /retro-cards/:id` - Get card details
- `PUT /retro-cards/:id` - Update card
- `DELETE /retro-cards/:id` - Delete card
- `POST /retro-cards/:id/vote` - Vote on card
- `DELETE /retro-cards/:id/vote` - Remove vote

## Authentication

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

Get a token by:
1. **Google OAuth**: `GET /auth/google` → redirects to Google → callback provides token
2. **Guest Mode**: `POST /auth/guest` with `{ name: "Guest Name" }`

## Business Rules

### Retrospective Permissions
- **Board Creator**: Can edit, delete, archive boards and manage columns
- **Any User**: Can create cards, vote (within limits), view active boards
- **Anonymous Cards**: Only allowed if board has `allowAnonymous: true`

### Voting System
- One vote per user per card
- Respects `maxVotesPerUser` limit set on board
- Voting must be enabled on the board
- Automatic vote count synchronization

### Default Board Structure
When creating a board, three default columns are automatically created:
1. "What went well?" (O que foi bem?)
2. "What can be improved?" (O que pode melhorar?)  
3. "Actions for next sprint" (Ações para próxima sprint)

### Blur Mode
- **Purpose**: Prevents bias during the card writing phase by blurring card content
- **Activation**: Can be toggled by board creators at any time
- **Behavior**: When enabled, card content appears blurred to all users
- **Reveal**: Content becomes visible on hover for easy reading when needed
- **Use Case**: Ideal for ensuring unbiased feedback collection before group discussion

## Error Handling

The API returns structured error responses:

```json
{
  "statusCode": 400,
  "message": "You have reached the maximum number of votes (3)",
  "error": "Bad Request"
}
```

Common error codes:
- `400` - Bad Request (validation errors, business rule violations)
- `401` - Unauthorized (missing or invalid JWT token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)

## Development

### Hot Reload
The development server supports hot reload for immediate feedback:
```bash
yarn run start:dev
```

### Database Sync
In development mode, TypeORM automatically syncs entity changes to the database. For production, use proper migrations.

### Debugging
- API runs on `http://localhost:3001`
- Swagger docs available at `http://localhost:3001/api/docs`
- Database logs are shown in console during development

## Deployment

### Docker Support
The project includes Docker configuration. See `docker-compose.yml` in the root directory.

### Production Considerations
- Set `NODE_ENV=production`
- Use proper PostgreSQL instance (not Docker in production)
- Configure secure `JWT_SECRET`
- Set up proper CORS origins
- Enable HTTPS for OAuth callbacks
- Use environment-specific database credentials

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file in the repository root for contribution guidelines.

## Support

For API-specific questions:
- Check the Swagger documentation at `/api/docs`
- Review this README and the module-specific documentation
- Create issues in the [GitHub repository](https://github.com/llinq/scrum-app)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
