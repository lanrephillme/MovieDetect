# MovieDetect API Integration Guide

This guide provides detailed instructions for integrating all the placeholder APIs with their respective services.

## 🎬 Movie Data APIs

### TMDb (The Movie Database) Integration

**Files to update:**
- `pages/api/movies/trending.js`
- `pages/api/movies/popular.js`
- `pages/api/movies/new-releases.js`
- `pages/api/movies/top-rated.js`
- `pages/api/movies/[id].js`

**Setup Steps:**
1. Sign up at [TMDb](https://www.themoviedb.org/settings/api)
2. Get your API key
3. Add `TMDB_API_KEY` to your environment variables

**Implementation Example:**
\`\`\`javascript
// In pages/api/movies/trending.js
const response = await fetch(
  `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
);
const data = await response.json();
\`\`\`

### OMDb API Integration

**Files to update:**
- `pages/api/movies/[id].js` (for IMDb ratings)

**Setup Steps:**
1. Sign up at [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Get your API key
3. Add `OMDB_API_KEY` to your environment variables

## 🔍 Search APIs

### Text Search (TMDb)
**File:** `pages/api/search/text.js`
- Use TMDb search endpoints
- Implement confidence scoring based on match quality

### Voice Search (OpenAI Whisper)
**File:** `pages/api/search/voice.js`
- Install: `npm install openai`
- Use Whisper API for speech-to-text
- Process transcribed text through text search

### Image Search (AWS Rekognition)
**File:** `pages/api/search/image.js`
- Install: `npm install aws-sdk`
- Use Rekognition for label detection
- Match labels with movie database

### Audio Search (Audd.io)
**File:** `pages/api/search/audio.js`
- Sign up at [Audd.io](https://audd.io/)
- Use their music recognition API
- Match identified songs with movie soundtracks

### Video Search (AWS Rekognition Video)
**File:** `pages/api/search/video.js`
- Use AWS Rekognition Video for frame analysis
- Extract key frames and analyze for movie matching

## 🔐 Authentication APIs

### User Registration & Login
**Files:**
- `pages/api/auth/signup.js`
- `pages/api/auth/signin.js`

**Required Packages:**
\`\`\`bash
npm install bcryptjs jsonwebtoken
\`\`\`

**Database Schema:**
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(50) DEFAULT 'free',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Social Authentication
**File:** `pages/api/auth/social.js`
- Install: `npm install next-auth`
- Configure OAuth providers (Google, Facebook, Twitter)

## 💳 Payment Integration (Stripe)

**File:** `pages/api/payments/stripe.js`

**Setup Steps:**
1. Install: `npm install stripe`
2. Create products and prices in Stripe Dashboard
3. Implement webhook handling for subscription events

**Implementation Example:**
\`\`\`javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
});
\`\`\`

## 📧 Email Integration (SendGrid)

**File:** `pages/api/email/send.js`

**Setup Steps:**
1. Install: `npm install @sendgrid/mail`
2. Create email templates in SendGrid
3. Configure sender authentication

## 📊 Database Schema

### Core Tables
\`\`\`sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  subscription_type VARCHAR(50) DEFAULT 'free',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE,
  imdb_id VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  year INTEGER,
  rating DECIMAL(3,1),
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  synopsis TEXT,
  genre JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watchlist table
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  movie_id INTEGER REFERENCES movies(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

-- Search analytics table
CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  search_type VARCHAR(50) NOT NULL,
  search_query TEXT,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🚀 Deployment Checklist

### Environment Variables
- [ ] All API keys configured
- [ ] Database connection string set
- [ ] JWT secret generated
- [ ] Email service configured
- [ ] AWS credentials set (if using image/video search)

### Database Setup
- [ ] Database created and connected
- [ ] Tables created with proper indexes
- [ ] Initial data seeded (popular movies)

### External Services
- [ ] TMDb API key working
- [ ] SendGrid email templates created
- [ ] Stripe products and webhooks configured
- [ ] AWS services configured (if applicable)

### Testing
- [ ] All API endpoints return proper responses
- [ ] Authentication flow working
- [ ] Payment flow tested in sandbox
- [ ] Email delivery working

## 📝 Implementation Priority

1. **Phase 1 - Core Functionality**
   - TMDb integration for movie data
   - Basic text search
   - User authentication
   - Watchlist functionality

2. **Phase 2 - Advanced Search**
   - Image search with AWS Rekognition
   - Audio search with Audd.io
   - Voice search with Whisper

3. **Phase 3 - Business Features**
   - Stripe payment integration
   - Email notifications
   - Admin dashboard
   - Analytics tracking

## 🔧 Development Tips

1. **API Rate Limits**: Implement caching for external API calls
2. **Error Handling**: Add comprehensive error handling for all APIs
3. **Security**: Validate all inputs and implement proper authentication
4. **Performance**: Use database indexes and query optimization
5. **Monitoring**: Add logging for all API calls and errors

## 📞 Support

For implementation questions:
1. Check the TODO comments in each API file
2. Refer to the official documentation for each service
3. Test with small datasets first before scaling
