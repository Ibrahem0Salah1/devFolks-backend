const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session');
// const postRoute = require('./routes/postRoutes');
const userRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/AppError');
const passport = require('./config/passport');
const globalErrorHandler = require('./middlewares/errorMiddleware');
const app = express();



// 1) MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}   
app.use(cors({
    origin :'http://localhost:3001',
     credentials: true // only needed if you're sending cookies/auth headers
}))
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1); // REQUIRED in production behind nginx, or a secure cookie
                            // is treated as http and silently dropped (express-session index.js:242)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid', // was the default 'connect.sid'; shorter and does not advertise the tech
    cookie: {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000, // 10 min: this session exists only for the OAuth handshake
    },
}));
app.use(passport.initialize());
app.set('query parser', 'extended');



// 2) ROUTES
// app.use( '/api/v1/posts' , postRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoutes);
// ===== Handle unknown routes (404) =====
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
