# Weather & News Dashboard - Backend API

A robust Node.js/Express backend API for the Weather & News Dashboard application.

## Features

- **Authentication**: JWT-based auth with refresh tokens
- **Weather Data**: OpenWeatherMap API integration with caching
- **News Feed**: NewsAPI integration with caching
- **User Management**: Profile and preferences management
- **Location Management**: Save and manage favorite locations
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Logging**: Winston-based logging system
- **Caching**: In-memory caching for API responses
- **Validation**: Express-validator for input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (access + refresh tokens)
- **Caching**: Redis
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston + Morgan

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- OpenWeatherMap API key
- NewsAPI key

### Installation

1. **Clone and install dependencies**:

   ```bash
   cd weather-news-backend
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**:

   ```env
   MONGO_URI=mongodb://localhost:27017/weather-news-dashboard
   JWT_ACCESS_SECRET=your-super-secret-access-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   OPENWEATHER_API_KEY=your-openweather-api-key
   NEWSAPI_KEY=your-newsapi-key
   PORT=5000
   EMAIL_USER=your-email
   EMAIL_PASS=your-email-password
   FRONTEND_ORIGIN=http://localhost:5173
   ```

4. **Get API Keys**:

   - **OpenWeatherMap**: Sign up at [openweathermap.org](https://openweathermap.org/api)
   - **NewsAPI**: Sign up at [newsapi.org](https://newsapi.org/)

5. **Start the server**:

   ```bash
   # Development
   bun run dev

   # Production
   bun start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Weather

- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

### News

- `GET /api/news` - Get news articles
- `GET /api/news/sources` - Get news sources

### Locations

- `GET /api/locations` - Get saved locations
- `POST /api/locations` - Add new location
- `DELETE /api/locations/:id` - Remove location

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  preferences: {
    theme: 'light' | 'dark',
    defaultLocation: { name, lat, lon },
    newsTopics: [String]
  },
  savedLocations: [{
    name: String,
   country: String,
    lat: Number,
    lon: Number,
   temp:  Number,
   icon:  String,
   condition:  String,
    createdAt: Date,
  }],
  refreshTokens: [{ token, createdAt }]
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **JWT**: Secure token-based authentication
- **HTTP-only Cookies**: Secure refresh token storage

## Logging

- **Development**: Console + file logging
- **Production**: File logging only
- **Log Files**: `logs/error.log`, `logs/combined.log`
- **Log Rotation**: 5MB max, 5 files retained

## Deployment

### Environment Variables for Production

```env
FRONTEND_ORIGIN=your_frontend_origin
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=jwt_access_secret
JWT_REFRESH_SECRET=jwt_refresh_secret
EMAIL_USER=nodemail_email
EMAIL_PASS=nodemail_password
OPENWEATHER_API_KEY=your_api_key
NEWSAPI_KEY=your_api_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - see LICENSE file for details
