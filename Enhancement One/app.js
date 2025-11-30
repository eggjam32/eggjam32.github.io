var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

// Load environment variables
require('dotenv').config();

// Connect to DB and Passport config
require('./app_api/models/db');
require('./app_api/config/passport');

// Import routers
var loginRouter = require('./app_server/routes/index');      // Server-rendered login & auth
var clientRouter = require('./app_server/routes/clients');   // Server-rendered client dashboard
var apiRouter = require('./app_api/routes/index');           // Other API routes
var apiClientsRouter = require('./app_api/routes/clients'); // API route for Angular SPA

var app = express();

// -------------------- Middleware --------------------

// CORS for Angular SPA
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// View engine
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'app_server', 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'app_server', 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server/views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: err.name + ': ' + err.message });
  } else {
    next(err);
  }
});

// -------------------- Routes --------------------

// Server-rendered pages
app.use('/', loginRouter);       // login/logout
app.use('/clients', clientRouter); // client dashboard (server-rendered)

// API routes (for Angular)
app.use('/api', apiRouter);            // other API endpoints
app.use('/api/clients', apiClientsRouter); // Angular SPA calls for clients

// -------------------- Error Handling --------------------

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Generic error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
