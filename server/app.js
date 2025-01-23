const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import CORS

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/app-Errors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Angular app origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Allow credentials (cookies, auth headers)
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Configure Helmet with updated CSP settings
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://cdn.jsdelivr.net',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Needed for inline styles used by Leaflet
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
        'https://fonts.googleapis.com'
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: [
        "'self'",
        'data:',
        'https://*.tile.openstreetmap.org' // Allow images from OpenStreetMap tiles
      ],
      connectSrc: [
        "'self'",
        'https://*.tile.openstreetmap.org' // Allow connections to OpenStreetMap tile servers
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again in an hour'
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL injections
app.use(mongoSanitize());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/events', eventRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
