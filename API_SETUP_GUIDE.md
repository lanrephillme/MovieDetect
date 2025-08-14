# MovieDetect API Setup Guide

This guide provides comprehensive instructions for setting up all the APIs and integrations required for the MovieDetect application.

## 📋 Complete API Requirements Checklist

### ✅ Already Configured (Keep These)
- `CUSTOM_AI_API_KEY` - Custom AI service for NLP scene matching
- `ASSEMBLYAI_API_KEY` - Speech-to-text for voice search
- `GOOGLE_SPEECH_API_KEY` - Alternative speech recognition
- `GOOGLE_VISION_API_KEY` - Image recognition and analysis
- `ACRCLOUD_HOST` - Audio fingerprinting service
- `ACRCLOUD_ACCESS_KEY` - ACRCloud authentication
- `ACRCLOUD_SECRET_KEY` - ACRCloud secret key
- `JUSTWATCH_API_KEY` - Streaming platform availability
- `AWS_ACCESS_KEY_ID` - AWS services access
- `AWS_SECRET_ACCESS_KEY` - AWS authentication
- `AWS_REGION` - AWS service region

### 🔧 Missing APIs (Need to Add)

#### Movie & Metadata APIs
- `TMDB_API_KEY` - The Movie Database (primary movie data)
- `OMDB_API_KEY` - Open Movie Database (alternative source)
- `IMDB_API_KEY` - IMDb ratings and reviews (optional)
- `ROTTEN_TOMATOES_API_KEY` - Critics scores (optional)

#### Video Streaming & Playback APIs
- `YOUTUBE_API_KEY` - YouTube trailer integration
- `VIMEO_ACCESS_TOKEN` - Vimeo video embedding
- `MUSE_AI_API_KEY` - Video processing and streaming

#### Additional AWS Services
- `AWS_S3_BUCKET` - File storage for uploads
- `AWS_REKOGNITION_API_KEY` - Enhanced video/image recognition

#### Payments & Communication
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_PUBLIC_KEY` - Client-side Stripe integration
- `SENDGRID_API_KEY` - Email notifications
- `FROM_EMAIL` - Sender email address

#### App Configuration
- `NEXT_PUBLIC_APP_URL` - Application base URL

## 🔑 How to Obtain Each API Key

### 1. TMDb API (Required - Primary Movie Database)
**Where:** https://www.themoviedb.org/settings/api
**Steps:**
1. Create free TMDb account
2. Go to Settings → API
3. Request API key (free)
4. Copy API key to `TMDB_API_KEY`

**Used in:** `/api/search/text`, `/api/movies/[id]`, actor search, movie metadata

### 2. YouTube API (Recommended - Trailer Playback)
**Where:** https://console.developers.google.com/
**Steps:**
1. Create Google Cloud project
2. Enable YouTube Data API v3
3. Create credentials → API key
4. Copy to `YOUTUBE_API_KEY`

**Used in:** Movie detail modal trailer embedding, video search

### 3. OMDb API (Alternative Movie Database)
**Where:** http://www.omdbapi.com/apikey.aspx
**Steps:**
1. Request free API key
2. Verify email
3. Copy to `OMDB_API_KEY`

**Used in:** Alternative movie data source, Rotten Tomatoes scores

### 4. Vimeo API (Optional - Alternative Video)
**Where:** https://developer.vimeo.com/apps
**Steps:**
1. Create Vimeo developer account
2. Create new app
3. Generate access token
4. Copy to `VIMEO_ACCESS_TOKEN`

**Used in:** Alternative video embedding for trailers

### 5. Muse.ai API (Optional - Video Processing)
**Where:** https://muse.ai/api
**Steps:**
1. Sign up for Muse.ai account
2. Go to API section
3. Generate API key
4. Copy to `MUSE_AI_API_KEY`

**Used in:** Advanced video processing and streaming

### 6. Stripe API (Optional - Payments)
**Where:** https://dashboard.stripe.com/apikeys
**Steps:**
1. Create Stripe account
2. Go to Developers → API keys
3. Copy publishable key to `STRIPE_PUBLIC_KEY`
4. Copy secret key to `STRIPE_SECRET_KEY`

**Used in:** Premium features, subscriptions

### 7. SendGrid API (Optional - Email)
**Where:** https://app.sendgrid.com/settings/api_keys
**Steps:**
1. Create SendGrid account
2. Go to Settings → API Keys
3. Create API key with mail send permissions
4. Copy to `SENDGRID_API_KEY`
5. Set `FROM_EMAIL` to verified sender

**Used in:** Feedback notifications, user communications

## 🏗️ Code Integration Points

### Search APIs Usage:
\`\`\`javascript
// Text Search - uses TMDB_API_KEY, CUSTOM_AI_API_KEY
/api/search/text → TMDb movie search + NLP processing

// Voice Search - uses ASSEMBLYAI_API_KEY or GOOGLE_SPEECH_API_KEY
/api/search/voice → Speech-to-text → TMDb search

// Image Search - uses GOOGLE_VISION_API_KEY or AWS_REKOGNITION
/api/search/image → Image analysis → TMDb matching

// Audio Search - uses ACRCLOUD_* keys
/api/search/audio → Audio fingerprinting → TMDb lookup

// Video Search - uses AWS_REKOGNITION + GOOGLE_VISION_API_KEY
/api/search/video → Frame analysis → TMDb matching
\`\`\`

### Movie Detail Modal Usage:
\`\`\`javascript
// Movie Details - uses TMDB_API_KEY
/api/movies/[id] → Complete movie information

// Streaming Platforms - uses JUSTWATCH_API_KEY
/api/streaming/platforms → Where to watch

// Trailer Embedding - uses YOUTUBE_API_KEY, VIMEO_ACCESS_TOKEN
Movie detail modal → Embedded video players

// Ratings - uses TMDB_API_KEY, OMDB_API_KEY
Movie ratings display → Multiple rating sources
\`\`\`

## 🚀 Quick Setup Instructions

1. **Copy the .env.example file to .env**
2. **Fill in your existing API keys** (keep the ones you have)
3. **Obtain missing API keys** using the guides above
4. **Test each search method** to verify API integration
5. **Check console logs** for any API errors

## 🔍 Testing Each Feature

### Text Search Test:
\`\`\`bash
curl -X POST http://localhost:3000/api/search/text \
  -H "Content-Type: application/json" \
  -d '{"query": "robot in future city", "searchType": "scene"}'
\`\`\`

### Voice Search Test:
- Open search modal → Voice tab
- Click microphone → speak "science fiction movie"
- Check if transcription works

### Image Search Test:
- Upload movie screenshot or poster
- Verify object detection in console logs
- Check movie matching results

### Movie Detail Modal Test:
- Click any movie from search results
- Verify all tabs load (Overview, Reviews, Similar, Feedback)
- Test trailer playback (requires YouTube/Vimeo API)
- Test streaming platform links

## ⚠️ Priority API Keys (Get These First)

1. **TMDB_API_KEY** - Essential for all movie data
2. **YOUTUBE_API_KEY** - Important for trailer playback
3. **SENDGRID_API_KEY** - Needed for feedback system
4. **STRIPE_SECRET_KEY** - If implementing premium features

## 🎯 Optional Enhancements

- **OMDB_API_KEY** - Alternative movie data source
- **IMDB_API_KEY** - Better ratings and reviews
- **ROTTEN_TOMATOES_API_KEY** - Critics scores
- **MUSE_AI_API_KEY** - Advanced video processing
- **AWS_REKOGNITION_API_KEY** - Enhanced image/video analysis

## 📱 Integration Steps to Complete

### Step 1: Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your existing API keys
3. Add new API keys as you obtain them

### Step 2: TMDb Integration (Priority)
\`\`\`javascript
// Add to your .env file
TMDB_API_KEY=your_tmdb_api_key_here

// Test the integration
curl "https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=blade+runner"
\`\`\`

### Step 3: YouTube Integration (Recommended)
\`\`\`javascript
// Add to your .env file
YOUTUBE_API_KEY=your_youtube_api_key_here

// Test trailer search
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=blade+runner+2049+trailer&key=YOUR_KEY"
\`\`\`

### Step 4: SendGrid Integration (For Feedback)
\`\`\`javascript
// Add to your .env file
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=your_verified_email@domain.com

// Test email sending
curl -X POST "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"your_email@domain.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test email"}]}'
\`\`\`

## 🔧 Troubleshooting Common Issues

### Issue 1: "API key not found" errors
**Solution:** Check that your .env file is in the root directory and properly formatted

### Issue 2: CORS errors with external APIs
**Solution:** All API calls are made from server-side routes, not client-side

### Issue 3: File upload failures
**Solution:** Ensure AWS S3 bucket permissions are correctly configured

### Issue 4: Video playback not working
**Solution:** Verify YouTube API key has proper permissions and quotas

## 🎬 Complete Feature Matrix

| Feature | Required APIs | Status |
|---------|---------------|--------|
| Text Search | TMDB_API_KEY, CUSTOM_AI_API_KEY | ✅ Ready |
| Voice Search | ASSEMBLYAI_API_KEY, TMDB_API_KEY | ✅ Ready |
| Image Search | GOOGLE_VISION_API_KEY, TMDB_API_KEY | ✅ Ready |
| Audio Search | ACRCLOUD_*, TMDB_API_KEY | ✅ Ready |
| Video Search | AWS_REKOGNITION, TMDB_API_KEY | ✅ Ready |
| Movie Details | TMDB_API_KEY | 🔧 Need TMDB |
| Trailer Playback | YOUTUBE_API_KEY | 🔧 Need YouTube |
| Streaming Links | JUSTWATCH_API_KEY | ✅ Ready |
| User Feedback | SENDGRID_API_KEY | 🔧 Need SendGrid |
| Payments | STRIPE_SECRET_KEY | 🔧 Optional |

## 🚀 Final Deployment Checklist

- [ ] All required API keys added to production environment
- [ ] Database connections configured (if using)
- [ ] File upload permissions set correctly
- [ ] Email sending verified
- [ ] All search methods tested
- [ ] Movie detail modal fully functional
- [ ] Error handling working properly
- [ ] Performance optimized for production

The application will work with mock data for missing APIs, but real API keys will provide the full MovieDetect experience with accurate search results, trailer playback, and comprehensive movie information! 🎬✨

---

## 📊 **Integration Steps Summary**

To resolve the "This generation uses integrations" message, you need to:

1. **Copy the .env.example file** to `.env` in your project root
2. **Add your existing API keys** (the ones you already have)
3. **Obtain the missing API keys** starting with the priority ones:
   - TMDB_API_KEY (most important)
   - YOUTUBE_API_KEY (for video playback)
   - SENDGRID_API_KEY (for feedback system)
4. **Test the application** to ensure all integrations work properly

The codebase is now complete and ready - you just need to configure the API keys to unlock all features! 🎯

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# TMDb API (Required for movie data)
TMDB_API_KEY=your_tmdb_api_key_here

# OMDb API (Optional - for additional movie data)
OMDB_API_KEY=your_omdb_api_key_here

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@moviedetect.com

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000

# AWS (for file uploads and storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# JustWatch API (for streaming platforms)
JUSTWATCH_API_KEY=your_justwatch_api_key_here

# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Google Cloud (for speech-to-text and vision)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_PRIVATE_KEY=your_private_key
GOOGLE_CLOUD_CLIENT_EMAIL=your_client_email

# Database (if using external database)
DATABASE_URL=your_database_url_here
\`\`\`

## API Integrations

### 1. TMDb API (The Movie Database)

**Purpose**: Primary source for movie data, images, and metadata.

**Setup**:
1. Visit [TMDb API](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Add the key to your `.env.local` file

**Usage**: Used in all movie-related API routes for fetching movie details, search results, and recommendations.

### 2. OMDb API (Optional)

**Purpose**: Additional movie data and ratings.

**Setup**:
1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add to your environment variables

### 3. JustWatch API

**Purpose**: Streaming platform availability data.

**Setup**:
1. Contact JustWatch for API access
2. Implement in `/api/streaming/platforms/route.js`

**Note**: This is a premium service. For development, mock data is provided.

### 4. OpenAI API

**Purpose**: AI-powered search features and recommendations.

**Setup**:
1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create an API key
3. Add to environment variables

**Usage**: Powers the AI search functionality and movie recommendations.

### 5. Google Cloud APIs

**Purpose**: Speech-to-text, image recognition, and video analysis.

**Required APIs**:
- Speech-to-Text API
- Vision API
- Video Intelligence API

**Setup**:
1. Create a Google Cloud project
2. Enable the required APIs
3. Create a service account and download credentials
4. Add credentials to environment variables

### 6. AWS Services

**Purpose**: File storage and processing.

**Required Services**:
- S3 (file storage)
- Lambda (serverless functions)
- Rekognition (image/video analysis)

**Setup**:
1. Create AWS account
2. Set up S3 bucket for file uploads
3. Configure IAM user with appropriate permissions
4. Add credentials to environment variables

## API Routes Implementation

### Movie Data Routes

\`\`\`javascript
// /api/movies/[id]/route.js
// Fetches detailed movie information from TMDb

// /api/movies/trending/route.js
// Gets trending movies

// /api/movies/popular/route.js
// Gets popular movies

// /api/movies/top-rated/route.js
// Gets top-rated movies

// /api/movies/new-releases/route.js
// Gets new releases
\`\`\`

### Search Routes

\`\`\`javascript
// /api/search/text/route.js
// Text-based movie search

// /api/search/voice/route.js
// Voice search with speech-to-text

// /api/search/image/route.js
// Image-based search using computer vision

// /api/search/audio/route.js
// Audio recognition search

// /api/search/video/route.js
// Video analysis search
\`\`\`

### User Management Routes

\`\`\`javascript
// /api/auth/signup/route.js
// User registration

// /api/auth/signin/route.js
// User authentication

// /api/watchlist/add/route.js
// Add movie to watchlist

// /api/watchlist/remove/route.js
// Remove movie from watchlist
\`\`\`

## Development Setup

### 1. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys.

### 3. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

### 4. Test API Endpoints

Use tools like Postman or curl to test your API endpoints:

\`\`\`bash
# Test movie search
curl -X POST http://localhost:3000/api/search/text \
  -H "Content-Type: application/json" \
  -d '{"query": "blade runner", "searchType": "scene"}'

# Test movie details
curl http://localhost:3000/api/movies/1
\`\`\`

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables in Production

Ensure all environment variables are properly set in your production environment:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- AWS: Use AWS Systems Manager Parameter Store

## API Rate Limits and Quotas

### TMDb API
- 40 requests per 10 seconds
- 1000 requests per day (free tier)

### OpenAI API
- Varies by model and subscription
- Monitor usage in OpenAI dashboard

### Google Cloud APIs
- Speech-to-Text: 60 minutes free per month
- Vision API: 1000 requests free per month

## Error Handling

All API routes include comprehensive error handling:

\`\`\`javascript
try {
  // API logic
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error('API Error:', error)
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  )
}
\`\`\`

## Security Considerations

1. **API Key Security**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement rate limiting for public endpoints
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS properly for production
5. **Authentication**: Implement proper JWT authentication

## Monitoring and Analytics

### Recommended Tools
- Vercel Analytics (for deployment metrics)
- Sentry (for error tracking)
- LogRocket (for user session recording)
- Google Analytics (for user behavior)

### Custom Logging

\`\`\`javascript
// Add to API routes for monitoring
console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status}`)
\`\`\`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS configuration
2. **API Key Issues**: Verify keys are correctly set and have proper permissions
3. **Rate Limiting**: Implement caching and request throttling
4. **File Upload Issues**: Check AWS S3 permissions and bucket configuration

### Debug Mode

Enable debug logging by setting:

\`\`\`env
NODE_ENV=development
DEBUG=true
\`\`\`

## Support and Resources

- [TMDb API Documentation](https://developers.themoviedb.org/3)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Cloud API Documentation](https://cloud.google.com/docs)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)

For additional support, please refer to the project documentation or create an issue in the GitHub repository.
