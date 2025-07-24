# BC Commercial Solar Lead Generation Platform

A comprehensive full-stack lead generation platform built specifically for British Columbia commercial solar installers and businesses. This platform combines advanced solar calculation tools, interactive financial modeling, AI-powered lead qualification, and CRM functionality to convert prospects into qualified leads.

![Solar Calculator Platform](./attached_assets/image_1751068546830.png)

## 🌟 Key Features

### Advanced Solar Calculator
- **BC Regional Analysis**: Uses British Columbia-specific solar irradiance data for accurate estimates
- **Real-time Financial Modeling**: Dynamic ROI calculations and 25-year projections
- **Intelligent System Sizing**: Automated panel configuration based on business requirements
- **Incentive Integration**: Federal ITC, CleanBC rebates, and PST exemptions

### AI-Powered Lead Generation
- **Smart Qualification**: Gemini AI analyzes business suitability for solar installations  
- **Automated Scoring**: Intelligent lead scoring (0-100) with priority classification
- **Business Analysis**: AI evaluates energy consumption patterns and solar potential
- **CRM Integration**: Structured data ready for external CRM systems

### BC-Specific Features
- **Regional Climate Data**: Vancouver (3.2), Victoria (3.8), Kelowna (4.1 kWh/m²/day)
- **Address Autocomplete**: BC business location suggestions without external API dependencies
- **CleanBC Programs**: Integration with provincial rebate structures
- **Net Metering**: 2025 regulatory urgency and grandfathering information

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom commercial solar theme
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database (Neon Database serverless)
- **Google Gemini AI** for intelligent lead analysis
- **Express Sessions** with PostgreSQL store

### Database Schema
- **Users**: Authentication and user management
- **Solar Projects**: Business information and project requirements
- **Solar Calculations**: Financial analysis results and projections
- **BC Rate Structure**: British Columbia electricity rate tiers
- **Leads**: Comprehensive lead data with AI scoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deng1559/bc-commercial-solar-platform.git
   cd bc-commercial-solar-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📊 API Endpoints

### Solar Analysis
- `POST /api/analyze-solar-potential` - BC regional solar analysis
- `POST /api/calculate-solar` - Financial calculations and projections
- `GET /api/bc-rates` - British Columbia electricity rates

### Lead Management
- `POST /api/leads` - Create new lead with AI analysis
- `GET /api/leads` - Retrieve leads with filtering
- `POST /api/generate-roi-explanation` - AI-powered ROI explanations

### AI Features
- Built-in Gemini AI integration for business analysis
- Automated lead scoring and qualification
- Intelligent priority classification

## 🌍 Deployment

### Environment Variables (Production)
```env
DATABASE_URL=your_production_postgresql_url
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

### Build Commands
```bash
# Frontend build
npm run build

# Server build  
npm run build:server

# Database migration
npm run db:push
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── gemini.ts          # AI integration
│   └── storage.ts         # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json
```

## 🎯 Key Components

### Interactive Financial Model
Advanced calculator featuring:
- Dynamic system sizing with cost adjustments
- Real-time ROI and payback calculations
- 25-year financial projections
- Integrated incentive calculations
- AI-powered risk analysis

### BC Regional Solar Analysis
Intelligent property analysis providing:
- BC-specific solar irradiance data
- Commercial roof assessment
- Regional climate-adjusted potential ratings
- Business-type specific calculations

### Lead Generation System
Comprehensive lead capture featuring:
- Multi-step qualification forms
- Business energy profiling
- Project timeline identification
- Automated lead scoring and routing
- AI-powered business analysis

## 🤖 AI Features

### Gemini AI Integration
- **Smart Lead Qualification**: AI analyzes business type, energy usage, and goals
- **Suitability Assessment**: Evaluates energy consumption patterns
- **Priority Classification**: High/Medium/Low categorization with reasoning
- **Personalized Explanations**: Business-specific financial analysis

## 📈 Lead Management

### Automated Scoring
Leads are scored 0-100 based on:
- Monthly electricity bill analysis
- Business type suitability
- Project timeline urgency
- Roof area potential
- Primary goal alignment

### Status Tracking
Lead progression through:
- New → Contacted → Qualified → Quoted → Closed

## 🔧 Development

### Database Migrations
```bash
npm run db:push
```

### Type Safety
The application uses Drizzle ORM with Zod schemas for end-to-end type safety between frontend, backend, and database.

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Shared schemas for consistency

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@yourcompany.com or create an issue in the GitHub repository.

---

Built with ❤️ for the British Columbia solar industry