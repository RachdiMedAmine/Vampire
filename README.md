# Gaming & Anime Portal

A full-stack web application for browsing and managing gaming and anime content, built with Angular frontend and Node.js/Express backend with MongoDB.

## 🎯 Project Overview

This platform allows users to explore games and anime, register accounts, and interact with content through a modern, animated interface. The application features user authentication, dynamic content management, and a responsive design.

## 🏗️ Architecture

**Frontend:** Angular 18 with Server-Side Rendering (SSR)  
**Backend:** Node.js + Express.js  
**Database:** MongoDB Atlas  
**Authentication:** JWT-based authentication with HTTP-only cookies

## ✨ Features

### User Features
- 🔐 User registration and authentication (signup/login)
- 🎮 Browse gaming content with categories
- 📺 Explore anime collections
- 🏠 Animated homepage with featured content
- 📱 Responsive design for all devices
- 🔒 Secure authentication with JWT tokens

### Content Management
- Dynamic content loading from MongoDB
- Type-based filtering (gaming/anime)
- Latest content highlighting
- Image galleries and descriptions

### Design Features
- Animated gradient backgrounds
- Marquee news ticker
- Category badges (new, strategy, racing, adventure)
- Glassmorphism UI effects
- Bootstrap 5 integration
- Font Awesome icons

## 🛠️ Technology Stack

### Frontend
- **Angular 18** - Component-based framework
- **Angular SSR** - Server-side rendering
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icon library
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Angular CLI 18+

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend Setup
```bash
cd server
npm install
```

Configure environment variables in `server/config.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
```

Start the backend:
```bash
npm start
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup
```bash
# From project root
npm install
```

Start the Angular development server:
```bash
npm start
```

Frontend will run on `http://localhost:4200`

## 📁 Project Structure
```
├── server/                      # Backend Node.js application
│   ├── controllers/             # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── eventController.js   # Event/content management
│   │   └── userController.js    # User management
│   ├── models/                  # Mongoose schemas
│   │   ├── usersModel.js        # User schema
│   │   └── eventsModel.js       # Event/content schema
│   ├── routes/                  # API routes
│   │   ├── userRoutes.js        # User endpoints
│   │   └── eventRoutes.js       # Event endpoints
│   ├── utils/                   # Helper functions
│   │   ├── catchAsync.js        # Async error handler
│   │   ├── email.js             # Email utilities
│   │   └── app-Errors.js        # Error handling
│   ├── app.js                   # Express app setup
│   ├── server.js                # Server entry point
│   └── config.env               # Environment variables
│
├── src/                         # Angular frontend
│   ├── app/                     # Application components
│   │   ├── home/                # Homepage component
│   │   ├── games/               # Games listing
│   │   ├── animes/              # Anime listing
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   ├── nav-bar/             # Navigation component
│   │   ├── footer/              # Footer component
│   │   ├── auth.service.ts      # Authentication service
│   │   └── data.service.ts      # API data service
│   ├── assets/                  # Static assets
│   └── styles.css               # Global styles
│
├── angular.json                 # Angular configuration
├── package.json                 # Frontend dependencies
├── server.ts                    # SSR server configuration
└── tsconfig.json                # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/users/signup          - Register new user
POST   /api/v1/users/login           - User login
GET    /api/v1/users/logout          - User logout
POST   /api/v1/users/forgotPassword  - Request password reset
PATCH  /api/v1/users/resetPassword/:token - Reset password
PATCH  /api/v1/users/updatePassword  - Update password (authenticated)
```

### Users
```
GET    /api/v1/users                 - Get all users (protected)
GET    /api/v1/users/me              - Get current user (protected)
GET    /api/v1/users/:id             - Get user by ID (protected)
PATCH  /api/v1/users/updateMe        - Update current user (protected)
DELETE /api/v1/users/deleteMe        - Delete current user (protected)
```

### Events/Content
```
GET    /api/v1/events                - Get all events
GET    /api/v1/events/:id            - Get event by ID
POST   /api/v1/events                - Create event
PATCH  /api/v1/events/:id            - Update event
DELETE /api/v1/events/:id            - Delete event
GET    /api/v1/events/type/:type     - Get events by type (gaming/anime)
GET    /api/v1/events/latest/:type   - Get latest events by type
```

## 🎨 Frontend Routes
```
/                - Homepage with featured content
/home            - Homepage (alias)
/games           - Gaming content listing
/animes          - Anime content listing
/login           - User login page
/signup          - User registration page
```

## 🔐 Authentication Flow

1. User registers via `/signup` with form validation
2. Password is hashed with bcrypt (cost factor 12)
3. JWT token is generated and sent in HTTP-only cookie
4. Frontend stores token in localStorage
5. Token is included in subsequent API requests
6. Protected routes verify token before access

## 🎨 Design Features

### Animated Backgrounds
- Gradient animations on login/signup pages
- Smooth color transitions using CSS keyframes

### Navigation
- Responsive navbar with user authentication status
- Dynamic user image display
- Logout functionality

### Content Cards
- Glassmorphism effect on forms
- Category badges (new, strategy, racing, adventure)
- Hover effects and transitions

### News Ticker
- Marquee scrolling latest news
- Category-colored tags

## 🔒 Security Features

- **Helmet** - Sets secure HTTP headers
- **CORS** - Configured for specific origin
- **Rate Limiting** - Prevents brute force attacks
- **NoSQL Injection Protection** - express-mongo-sanitize
- **XSS Protection** - Input sanitization
- **Parameter Pollution Prevention** - hpp middleware
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **HTTP-only Cookies** - Prevents XSS attacks

## 🚦 Running in Production

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
cd server
npm run start:prod
```

### SSR Server
```bash
npm run serve:ssr:project
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📝 Environment Variables

Create `server/config.env` with:
```env
NODE_ENV=production
PORT=3000
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/dbname
DATABASE_PASSWORD=your_password
JWT_SECRET=your_very_long_secret_key_here
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
```

## 🐛 Troubleshooting

**CORS Issues:**
- Ensure `corsOptions` origin matches your frontend URL
- Check credentials are enabled

**Authentication Errors:**
- Verify JWT_SECRET is set correctly
- Check cookie settings (httpOnly, secure in production)

**MongoDB Connection:**
- Verify DATABASE and DATABASE_PASSWORD are correct
- Check MongoDB Atlas IP whitelist

**SSR Issues:**
- Use `typeof window !== 'undefined'` checks for browser-only code
- Ensure localStorage access is wrapped in browser checks

## 🔮 Future Enhancements

- [ ] User profile pages with avatars
- [ ] Content rating and reviews
- [ ] Advanced search and filtering
- [ ] Social features (favorites, watchlists)
- [ ] Admin dashboard for content management
- [ ] Real-time notifications
- [ ] Content recommendations
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] API rate limiting per user
- [ ] Content upload functionality
- [ ] Image optimization and CDN integration

## 📄 License

This project is available for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with Angular, Node.js, Express & MongoDB** 🚀
