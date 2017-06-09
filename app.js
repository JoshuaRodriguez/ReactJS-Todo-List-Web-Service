// Get required modules
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');
let helpers = require('./helpers');

// Allow access to environment variables
require('dotenv').config();

// Connect to mongodb database
require('./db/db');

// Set up routing paths
let apiRoutes = require('./api/apiRoutes');

// Extract express app 
let app = express();

// Let express use the following middle ware
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// When express server gets requested on home endpoint route request through api routes
app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ 
    status: err.status,
    errorMessage: helpers.determineErrorMessage(err.status) 
  });
});

module.exports = app;
