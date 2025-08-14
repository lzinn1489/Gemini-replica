# Overview

This is a full-stack chat application built with React, Express, and TypeScript. The application provides a conversational AI interface where users can create multiple conversations, send messages, and receive AI-powered responses. The system features a clean, modern UI with sidebar navigation for conversation management and a responsive chat interface.

# User Preferences

Preferred communication style: Simple, everyday language.
Database preference: SQLite only (no PostgreSQL).

# Recent Changes (August 2025)

## Migration to Replit Environment
- Successfully migrated from Replit Agent to standard Replit environment
- Fixed duplicate function exports in not-found.tsx
- Added navigation buttons to login/auth page in loading states and 404 page
- Confirmed SQLite database configuration is working correctly
- All dependencies installed and application running successfully

## Google Gemini Integration (August 14, 2025)
- Integrated Google Gemini 2.0 Flash API for intelligent chat responses
- Implemented conversation context awareness (last 10 messages)
- All responses configured for Portuguese Brazilian language
- Fixed ES modules compatibility issues (replaced require with fetch API)
- Added proper error handling for API failures

## UI/UX Improvements
- Enhanced authentication page animations with staggered entry effects
- Corrected login/register button icons (LogIn for login, UserPlus for register)
- Added modern CSS animations including glow, float, scale-in, and slide effects
- Improved button interactions with shine effects and enhanced hover states
- Added animation delays for sequential component reveals
- Replaced Bot icon with Brain icon for more modern appearance
- Added "Fazer Login" and "Criar Conta" buttons on main screen for quick access
- Complete Portuguese Brazilian translation implemented across entire interface
- Removed generic "assistente para apresentações" text as requested

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Development server uses Vite middleware for hot reload
- **Error Handling**: Centralized error handling middleware with status codes

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration System**: Drizzle Kit for schema migrations
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema**: Shared TypeScript schema definitions between client and server

## Database Schema Design
- **Conversations Table**: Stores conversation metadata with auto-generated UUIDs, titles, and timestamps
- **Messages Table**: Stores individual messages with conversation references, content, role (user/assistant), optional image URLs, and timestamps
- **Users Table**: Basic user management with username/password authentication (prepared but not fully implemented)

## Authentication and Authorization
- **Current State**: Basic user schema prepared but authentication not fully implemented
- **Session Management**: Express session middleware with PostgreSQL session store (connect-pg-simple)
- **Future Implementation**: Username/password authentication with session-based auth

## API Structure
- **Conversation Management**: 
  - GET /api/conversations - List all conversations
  - POST /api/conversations - Create new conversation
  - DELETE /api/conversations/:id - Delete conversation
- **Message Management**:
  - GET /api/conversations/:id/messages - Get messages for conversation
  - POST /api/conversations/:id/messages - Send message and get AI response
- **Error Handling**: Consistent JSON error responses with appropriate HTTP status codes

## UI/UX Design Patterns
- **Component Architecture**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with sidebar that adapts to screen size
- **Theme System**: Dark/light mode support with CSS custom properties
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Proper loading indicators and optimistic updates

# External Dependencies

## AI Integration
- **Google Generative AI**: Uses @google/genai package for AI-powered chat responses
- **API Communication**: RESTful API calls between frontend and backend for AI interactions

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Connection**: Uses @neondatabase/serverless driver for database connectivity

## Development Tools
- **Replit Integration**: Custom plugins for development environment
- **Error Overlay**: Runtime error modal for development debugging
- **Build Pipeline**: ESBuild for production server bundling, Vite for client bundling

## UI Dependencies
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants
- **Tailwind Merge**: Utility for merging Tailwind classes without conflicts

## Utility Libraries
- **Zod**: Schema validation for type-safe data handling
- **Date-fns**: Date manipulation and formatting
- **Nanoid**: Unique ID generation for various purposes
- **CLSX**: Conditional CSS class utility