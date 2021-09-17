const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
// const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cache = require('./middleware/cache');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const shouldCompress = require('./utils/shouldCompress');
// Load env vars
dotenv.config({ path: './config/.env' });

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();

// Compress all responses
app.use(compression({ filter: shouldCompress }));

// Body parser
app.use(express.json());

// Cookie parser
// app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Do caching...
app.use(cache(300));
// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;
connectDB().then(() => {
  server = app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on  http://localhost:${PORT}`
        .yellow.bold
    )
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection :- ${err.messsage}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
