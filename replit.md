# BC Commercial Solar Lead Generation Platform

## Overview

This is a comprehensive full-stack lead generation platform built for BC commercial solar installers and businesses. The application combines advanced solar calculation tools, interactive financial modeling, Google Solar API integration, and CRM functionality to convert prospects into qualified leads. It features a React frontend with TypeScript, an Express.js backend, and comprehensive lead management capabilities.

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
- **Leads**: Lead generation data with business contact information, project requirements, and automated lead scoring

## Key Components

### Interactive Financial Modeling
Advanced real-time calculator (`client/src/components/interactive-financial-model.tsx`) featuring:
- Dynamic system sizing with cost per watt adjustments
- Real-time ROI and payback period calculations
- 25-year financial projections with escalating energy rates
- Key performance indicators (KPIs) dashboard
- Integrated incentive calculations (Federal ITC, BC Hydro rebates, PST exemptions)
- AI-powered risk analysis and opportunity assessment

### Google Solar API Integration
Satellite-powered property analysis (`client/src/components/solar-map-analysis.tsx`) providing:
- Real-time roof assessment using Google Solar API
- Interactive satellite map visualization
- Solar potential rating and system sizing recommendations
- Automated roof area calculations and panel optimization
- Address-based solar irradiance data for BC regions

### Lead Generation System
Comprehensive lead capture and management (`client/src/components/lead-generation-form.tsx`):
- Multi-step lead qualification forms
- Business type and energy usage profiling
- Project timeline and goal identification
- Integrated CRM data collection
- Automated lead scoring and routing

### Solar Calculator Engine
Located in both frontend (`client/src/lib/solar-calculations.ts`) and backend (`server/routes.ts`), the calculator performs:
- System sizing based on business requirements
- Annual production estimates using BC solar irradiance data
- Cost calculations with installation type and panel quality factors
- CleanBC Business Program rebate calculations
- Federal investment tax credit calculations (30%)
- Payback period and 25-year ROI analysis
- CO2 offset estimations

### Incentives Information
Dedicated section (`client/src/components/incentives-section.tsx`) explaining:
- CleanBC Business Programs
- Federal solar incentives
- Provincial rebate structures
- Tax credit opportunities
- 2025 regulatory urgency and net metering grandfathering

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
- `GOOGLE_SOLAR_API_KEY`: Google Solar API key for real satellite analysis (required)
- `GEMINI_API_KEY`: Google Gemini API key for AI-powered lead analysis (required)
- `NODE_ENV`: Environment setting (development/production)
- `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`: PostgreSQL connection parameters
- Vite handles environment variable injection for frontend

The application is designed for deployment on platforms supporting Node.js with PostgreSQL database connectivity. The monorepo structure allows for easy deployment to services like Replit, Vercel, or traditional hosting platforms.

### Lead Management System
The database integration includes:
- **AI-Powered Lead Scoring**: Business leads are automatically analyzed and scored (0-100) using Gemini AI for intelligent business assessment
- **Smart Business Analysis**: AI evaluates energy consumption patterns, business type suitability, and solar potential
- **Intelligent Lead Qualification**: Automated priority classification (High/Medium/Low) with detailed reasoning and recommendations
- **Lead Status Tracking**: Leads progress through statuses: new → contacted → qualified → quoted → closed
- **CRM-Ready Data**: All lead data is structured for integration with external CRM systems
- **API Endpoints**: Complete REST API for lead management and retrieval

## AI-Powered Features

### Gemini AI Integration
The application leverages Google's Gemini AI for intelligent business analysis:
- **Smart Lead Qualification**: AI analyzes business type, energy usage, and goals to provide intelligent lead scoring
- **Business Solar Suitability Assessment**: AI evaluates energy consumption patterns and business characteristics
- **Automated Priority Classification**: Leads are categorized as High/Medium/Low priority with detailed reasoning
- **Intelligent Recommendations**: AI provides specific next steps and opportunities for each lead
- **Personalized ROI Explanations**: AI generates business-specific financial analysis explanations

### API Endpoints
- `POST /api/leads` - Enhanced with AI analysis and intelligent scoring
- `POST /api/generate-roi-explanation` - AI-powered personalized ROI explanations
- `POST /api/analyze-solar-potential` - Real Google Solar API integration for satellite analysis

## Changelog

```
Changelog:
- June 27, 2025. Initial setup and commercial solar calculator implementation
- June 27, 2025. Added PostgreSQL database with Drizzle ORM integration
- June 27, 2025. Implemented lead generation system with automated scoring
- June 27, 2025. Integrated Google Solar API for real satellite property analysis
- June 27, 2025. Added Gemini AI for intelligent lead qualification and business analysis
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```