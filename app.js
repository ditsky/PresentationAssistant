const cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  flash = require('connect-flash'),
  linkController = require('./controllers/linkController'),
  //auth = require('./config/auth'),

  path = require('path'),
  exec = require('child_process').exec,
  express = require('express'),
  web = express(); //initialize an express server for vui

const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://' +
    process.env.mlab_dbuser +
    ':' +
    process.env.mlab_dbpassword +
    '@ds141671.mlab.com:41671/heroku_rq4mxj0w'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

// view engine setup
web.set('views', path.join(__dirname, 'views'));
web.set('view engine', 'pug');

//middleware to process the req object and make it more useful!
web.use(logger('dev'));
web.use(express.json());
web.use(express.urlencoded({ extended: false }));
web.use(cookieParser());
web.use(flash());

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
web.use(express.static(path.join(__dirname, 'public')));

web.get('/url', linkController.submitLink);
web.post('/saveLink', linkController.saveLink);

web.use('/', function(req, res, next) {
  res.render('index');
});

// catch 404 and forward to error handler
web.use(function(req, res, next) {
  next(createError(404));
});

// error handler
web.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = web;
