# MovieDetect API Integration Guide

## Overview
This guide provides comprehensive instructions for integrating all APIs required for the MovieDetect application.

## Required API Keys and Services

### 1. The Movie Database (TMDb) API
**Purpose**: Primary movie data source
**Website**: https://www.themoviedb.org/settings/api
**Environment Variable**: `TMDB_API_KEY`

**Setup Instructions**:
1. Create account at TMDb
2. Go to Settings > API
3. Request API key (free)
4. Add to `.env.local`: `TMDB_API_KEY=your_api_key_here`

**Usage in Code**:
\`\`\`javascript
const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`)
\`\`\`

### 2. Open Movie Database (OMDb) API
**Purpose**: Additional movie metadata
**Website**: http://www.omdbapi.com/apikey.aspx
**Environment Variable**: `OMDB_API_KEY`

**Setup Instructions**:
1. Register for free API key
2. Add to `.env.local`: `OMDB_API_KEY=your_api_key_here`

### 3. SendGrid Email API
**Purpose**: Email notifications and newsletters
**Website**: https://sendgrid.com/
**Environment Variables**: `SENDGRID_API_KEY`, `FROM_EMAIL`

**Setup Instructions**:
1. Create SendGrid account
2. Generate API key in Settings > API Keys
3. Verify sender email address
4. Add to `.env.local`:
   \`\`\`
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@yourdomain.com
   \`\`\`

### 4. AWS S3 (File Storage)
**Purpose**: Store user uploads (images, videos, audio)
**Website**: https://aws.amazon.com/s3/
**Environment Variables**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

**Setup Instructions**:
1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Add credentials to `.env.local`

### 5. Stripe Payment Processing
**Purpose**: Handle premium subscriptions
**Website**: https://stripe.com/
**Environment Variables**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`

**Setup Instructions**:
1. Create Stripe account
2. Get API keys from Dashboard
3. Add to `.env.local` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## API Endpoints Structure

### Movie Data Endpoints
- `GET /api/movies/trending` - Trending movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/new-releases` - New releases
- `GET /api/movies/top-rated` - Top rated movies
- `GET /api/movies/[id]` - Movie details

### Search Endpoints
- `POST /api/search/text` - Text-based search
- `POST /api/search/image` - Image-based search
- `POST /api/search/audio` - Audio-based search
- `POST /api/search/video` - Video-based search
- `POST /api/search/voice` - Voice search
- `POST /api/search/face` - Face recognition search

### User Management
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/recover` - Password recovery
- `POST /api/auth/social` - Social login

### Watchlist Management
- `GET /api/watchlist/user` - Get user watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `POST /api/watchlist/remove` - Remove from watchlist

### Recommendations
- `GET /api/recommendations` - AI-powered recommendations

### Email & Communication
- `POST /api/email/send` - Send emails
- `POST /api/email/subscribe` - Newsletter subscription

### Payment Processing
- `POST /api/payments/stripe` - Handle Stripe payments

### Admin Endpoints
- `GET /api/admin/stats` - Application statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/movies` - Movie management

## Database Schema Requirements

### Users Table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url VARCHAR(255),
  subscription_type VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Movies Table
\`\`\`sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  tmdb_id INTEGER UNIQUE,
  title VARCHAR(255) NOT NULL,
  overview TEXT,
  poster_path VARCHAR(255),
  backdrop_path VARCHAR(255),
  release_date DATE,
  vote_average DECIMAL(3,1),
  genre_ids INTEGER[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Watchlist Table
\`\`\`sql
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  movie_id INTEGER REFERENCES movies(id),
  watched BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);
\`\`\`

### Search History Table
\`\`\`sql
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  query TEXT,
  search_type VARCHAR(50),
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Performance Optimizations

### 1. Caching Strategy
- Redis for API response caching
- CDN for static assets
- Browser caching for images

### 2. Database Optimizations
- Indexes on frequently queried columns
- Connection pooling
- Query optimization

### 3. Image Optimization
- Next.js Image component
- WebP format support
- Lazy loading

### 4. API Rate Limiting
- Implement rate limiting for all endpoints
- Use Redis for rate limit storage

## Security Considerations

### 1. Authentication
- JWT tokens for API authentication
- Secure password hashing (bcrypt)
- Session management

### 2. Data Validation
- Input sanitization
- File upload validation
- SQL injection prevention

### 3. API Security
- CORS configuration
- API key protection
- Request size limits

## Deployment Checklist

### Environment Variables
- [ ] All API keys configured
- [ ] Database connection string
- [ ] JWT secret key
- [ ] Email service credentials
- [ ] Cloud storage credentials

### Database Setup
- [ ] Database created and migrated
- [ ] Indexes created
- [ ] Backup strategy implemented

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] API usage analytics

## Testing Strategy

### Unit Tests
- API endpoint testing
- Component testing
- Utility function testing

### Integration Tests
- Database operations
- External API integrations
- Authentication flows

### Performance Tests
- Load testing
- API response times
- Database query performance
\`\`\`

Now let me create the complete package.json with all required dependencies:
