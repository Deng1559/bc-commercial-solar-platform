# BC Commercial Solar Calculator

## Overview

This is a full-stack web application built for calculating commercial solar installations in British Columbia, Canada. The application provides businesses with detailed financial analysis including cost projections, incentive calculations, and ROI estimates for solar energy systems. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database integration through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom commercial solar theme
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas shared between frontend and backend

### Database Design
The application uses a PostgreSQL database with the following main entities:
- **Users**: Authentication and user management
- **Solar Projects**: Business information and project requirements
- **Solar Calculations**: Financial analysis results and projections
- **BC Rate Structure**: British Columbia electricity rate tiers and pricing

## Key Components

### Solar Calculator Engine
Located in both frontend (`client/src/lib/solar-calculations.ts`) and backend (`server/routes.ts`), the calculator performs:
- System sizing based on business requirements
- Annual production estimates using BC solar irradiance data
- Cost calculations with installation type and panel quality factors
- CleanBC Business Program rebate calculations
- Federal investment tax credit calculations (30%)
- Payback period and 25-year ROI analysis
- CO2 offset estimations

### Form System
The calculator form (`client/src/components/calculator-form.tsx`) collects:
- Business information (name, type, contact details)
- Property specifications (address, square footage, roof area)
- Energy usage patterns (monthly consumption, peak demand, rate tier)
- System preferences (size, installation type, panel quality, battery storage)

### Results Display
The results panel (`client/src/components/results-panel.tsx`) presents:
- System specifications and annual production
- Total costs and available incentives
- Net cost after rebates and tax credits
- Annual savings and payback period
- Long-term ROI and environmental impact

### Incentives Information
Dedicated section (`client/src/components/incentives-section.tsx`) explaining:
- CleanBC Business Programs
- Federal solar incentives
- Provincial rebate structures
- Tax credit opportunities

## Data Flow

1. **User Input**: Business completes the comprehensive solar calculator form
2. **Validation**: Zod schemas validate input data on both client and server
3. **Calculation**: Backend processes solar system calculations using BC-specific data
4. **Storage**: Project data and calculation results stored in PostgreSQL
5. **Results**: Financial analysis and projections displayed to user
6. **Follow-up**: Contact information captured for sales team follow-up

## External Dependencies

### UI Components
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe component variant management

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

### Development Tools
- **Replit Integration**: Development environment optimization
- **ESBuild**: Fast production bundling for server code

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Integrated error overlays and debugging tools

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` script

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)
- Vite handles environment variable injection for frontend

The application is designed for deployment on platforms supporting Node.js with PostgreSQL database connectivity. The monorepo structure allows for easy deployment to services like Replit, Vercel, or traditional hosting platforms.

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```