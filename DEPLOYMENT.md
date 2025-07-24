# Deployment Guide

This guide covers deployment options for the BC Commercial Solar Platform.

## 🚀 Replit Deployment (Recommended)

### Prerequisites
1. Replit account
2. PostgreSQL database (Neon Database recommended)
3. Google Gemini API key

### Steps
1. **Import to Replit**
   - Create new Repl from GitHub repository
   - Or fork this existing Repl

2. **Environment Setup**
   - Add secrets in Replit's Secrets tab:
     ```
     DATABASE_URL=your_postgresql_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Deploy**
   - Click the "Deploy" button in Replit
   - Your app will be live at `your-repl-name.replit.app`

## 🌐 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- PostgreSQL database

### Steps
1. **Connect Repository**
   - Import project from GitHub to Vercel
   - Select "Express.js" as framework preset

2. **Environment Variables**
   ```
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Vercel will automatically deploy on git push

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/solar_platform
      - GEMINI_API_KEY=your_gemini_api_key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=solar_platform
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ☁️ Railway Deployment

### Steps
1. **Connect Repository**
   - Login to Railway
   - Create new project from GitHub

2. **Add Database**
   - Add PostgreSQL service
   - Copy DATABASE_URL from service

3. **Environment Variables**
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway auto-deploys on git push

## 🗄️ Database Setup

### Neon Database (Recommended)
1. Create account at neon.tech
2. Create new project
3. Copy connection string
4. Add to environment variables

### Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb bc_solar_platform

# Set environment variable
export DATABASE_URL="postgresql://postgres:password@localhost:5432/bc_solar_platform"
```

## 🔐 Environment Variables Reference

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API key for AI features

### Optional
- `NODE_ENV`: Application environment (development/production)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Individual PostgreSQL connection parameters

## 🔧 Production Considerations

### Performance
- Enable gzip compression
- Set up CDN for static assets
- Configure connection pooling for database

### Security
- Use HTTPS in production
- Rotate API keys regularly
- Implement rate limiting
- Set secure session cookies

### Monitoring
- Set up error tracking (Sentry)
- Monitor database performance
- Track API usage
- Set up uptime monitoring

## 📊 Health Checks

The application includes built-in health check endpoints:

```bash
# Application health
GET /health

# Database health
GET /api/health
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Production
        run: |
          # Your deployment commands here
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is running

2. **AI Features Not Working**
   - Verify GEMINI_API_KEY is set
   - Check API quota and billing
   - Review error logs

3. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify TypeScript compilation

### Logs
```bash
# View application logs
npm run logs

# Database logs
npm run db:logs
```

## 📱 Mobile Optimization

The application is responsive and works on mobile devices. For optimal mobile experience:

- Test on various screen sizes
- Optimize images for mobile
- Consider PWA implementation
- Test touch interactions

---

For additional support, consult the main [README.md](README.md) or create an issue in the repository.