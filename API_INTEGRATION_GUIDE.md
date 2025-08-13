# MovieDetect API Integration Guide

This guide provides detailed instructions for integrating real API endpoints into the MovieDetect application.

## Prerequisites

Before implementing the APIs, ensure you have the following:

1. **Database Setup**: PostgreSQL or MongoDB instance
2. **API Keys**: Obtain keys for all external services
3. **Environment Variables**: Configure all required environment variables
4. **Dependencies**: Install necessary npm packages

## Required Dependencies

Add these packages to your `package.json`:

\`\`\`bash
npm install bcryptjs jsonwebtoken
npm install @aws-sdk/client-rekognition @aws-sdk/client-s3
npm install @sendgrid/mail
npm install stripe
npm install redis
npm install prisma @prisma/client  # or mongoose for MongoDB
\`\`\`

## API Implementation Priority

Implement APIs in this order for best results:

### Phase 1: Core Movie Data
1. `/api/movies/trending` - TMDb trending movies
2. `/api/movies/popular` - TMDb popular movies  
3. `/api/movies/[id]` - Movie details with TMDb + OMDb
4. `/api/search/text` - Basic text search

### Phase 2: Authentication & User Management
1. `/api/auth/signup` - User registration
2. `/api/auth/signin` - User authentication
3. `/api/watchlist/*` - Watchlist management

### Phase 3: Advanced Search Features
1. `/api/search/voice` - Whisper API integration
2. `/api/search/image` - AWS Rekognition
3. `/api/search/audio` - Audd.io integration
4. `/api/search/video` - AWS Rekognition Video

### Phase 4: Payments & Admin
1. `/api/payments/stripe` - Stripe integration
2. `/api/admin/*` - Admin dashboard APIs

## Detailed Implementation Instructions

### 1. TMDb API Integration

**File**: `/pages/api/movies/trending.js`

Replace the TODO section with:

\`\`\`javascript
const response = await fetch(
  `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&page=1`
)
const data = await response.json()

const movies = data.results.map(movie => ({
  id: movie.id,
  title: movie.title,
  year: new Date(movie.release_date).getFullYear(),
  rating: movie.vote_average,
  poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  backdrop: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
  genre: movie.genre_ids, // You'll need to map these to genre names
  synopsis: movie.overview
}))
\`\`\`

### 2. User Authentication

**File**: `/pages/api/auth/signup.js`

Replace the TODO section with:

\`\`\`javascript
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Hash password
const hashedPassword = await bcrypt.hash(password, 12)

// Save to database (example with Prisma)
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    emailVerified: false
  }
})

// Generate JWT token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
)

// Send verification email
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: email,
  from: process.env.FROM_EMAIL,
  subject: 'Verify your MovieDetect account',
  html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}">here</a> to verify your account.</p>`
}

await sgMail.send(msg)
\`\`\`

### 3. AWS Rekognition Integration

**File**: `/pages/api/search/image.js`

Replace the TODO section with:

\`\`\`javascript
const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition')
const multer = require('multer')

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

// Process uploaded image
const command = new DetectLabelsCommand({
  Image: {
    Bytes: imageBuffer // from uploaded file
  },
  MaxLabels: 10,
  MinConfidence: 70
})

const response = await rekognition.send(command)
const labels = response.Labels.map(label => label.Name)

// Match labels with movie database
const matchingMovies = await searchMoviesByLabels(labels)
\`\`\`

### 4. Stripe Payment Integration

**File**: `/pages/api/payments/stripe.js`

Replace the TODO section with:

\`\`\`javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Create or retrieve customer
let customer
try {
  const customers = await stripe.customers.list({
    email: userEmail,
    limit: 1
  })
  
  if (customers.data.length > 0) {
    customer = customers.data[0]
  } else {
    customer = await stripe.customers.create({
      email: userEmail,
      payment_method: paymentMethodId
    })
  }
} catch (error) {
  console.error('Error with customer:', error)
}

// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: getPriceId(plan) }],
  default_payment_method: paymentMethodId,
  expand: ['latest_invoice.payment_intent']
})

// Update user in database
await prisma.user.update({
  where: { id: userId },
  data: {
    subscription: plan,
    stripeCustomerId: customer.id,
    stripeSubscriptionId: subscription.id
  }
})
\`\`\`

## Database Schema

### User Table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  subscription VARCHAR(50) DEFAULT 'free',
  email_verified BOOLEAN DEFAULT false,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Watchlist Table
\`\`\`sql
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  movie_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  watched BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10)
);
\`\`\`

### Search History Table
\`\`\`sql
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  query TEXT NOT NULL,
  search_type VARCHAR(50) NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Frontend Integration Points

### 1. Update Movie Carousels Component

In `components/movie-carousels.tsx`, the `fetchAllCategories` function is already set up to call the API endpoints. Ensure your APIs return data in this format:

\`\`\`javascript
{
  movies: [
    {
      id: number,
      title: string,
      year: number,
      rating: number,
      poster: string,
      backdrop?: string,
      trailer?: string,
      genre?: string[]
    }
  ]
}
\`\`\`

### 2. Update Search Components

The search functionality in `components/movie-detect-hero.tsx` is already configured to call the appropriate API endpoints based on search type.

### 3. Authentication Flow

The login/signup pages are already set up to call the authentication APIs. Ensure your APIs return:

\`\`\`javascript
{
  user: { id, name, email, subscription },
  token: "jwt_token_here"
}
\`\`\`

## Testing Your APIs

### 1. Use Postman or curl to test each endpoint:

\`\`\`bash
# Test trending movies
curl http://localhost:3000/api/movies/trending

# Test user registration
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test text search
curl -X POST http://localhost:3000/api/search/text \
  -H "Content-Type: application/json" \
  -d '{"query":"action movies with cars","type":"scene"}'
\`\`\`

### 2. Frontend Testing

1. Start your development server: `npm run dev`
2. Navigate to each page and test functionality
3. Check browser console for any API errors
4. Verify data is loading correctly in components

## Error Handling

Implement consistent error handling across all APIs:

\`\`\`javascript
try {
  // API logic here
} catch (error) {
  console.error('API Error:', error)
  
  if (error.code === 'ENOTFOUND') {
    return res.status(503).json({ message: 'External service unavailable' })
  }
  
  if (error.status === 401) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
  return res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
}
\`\`\`

## Security Considerations

1. **API Rate Limiting**: Implement rate limiting for all endpoints
2. **Input Validation**: Validate all input data
3. **JWT Security**: Use secure JWT secrets and implement token refresh
4. **File Upload Security**: Validate file types and sizes
5. **CORS Configuration**: Configure CORS properly for production

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] API keys tested and working
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] HTTPS enabled
- [ ] Monitoring and logging set up

## Support and Troubleshooting

### Common Issues:

1. **CORS Errors**: Configure Next.js API routes with proper CORS headers
2. **Database Connection**: Ensure database URL is correct and accessible
3. **API Key Issues**: Verify all API keys are valid and have proper permissions
4. **File Upload Limits**: Configure Next.js for larger file uploads if needed

### Getting Help:

- Check the console logs for detailed error messages
- Verify environment variables are loaded correctly
- Test external API connections independently
- Use database query logs to debug data issues

This guide provides the foundation for implementing all MovieDetect APIs. Follow the implementation priority and test each phase thoroughly before moving to the next.
