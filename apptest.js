const
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  axios = require('axios'),
  flash = require('connect-flash'),
  linkController = require('./controllers/linkController'),
  connectionController = require('./controllers/connectionController'),
  //auth = require('./config/auth'),
  bodyParser = require('body-parser')
  path = require('path'),
  exec = require('child_process').exec,
  express = require('express')


var app = express(); //initialize an express server for gui


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/PresentationAssistant');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));

function process_request(req, res){
  console.log('recieved request')
  if (req.body.msg == 'next'){
    var data = 'down';
    console.log(data);
    if (data && keys.includes(data)) {
      try {
        keySender.sendKey(data);
        slide++;
      } catch (error) {
        console.log(error);
      }
    }
  } else if (req.body.msg == 'goTo'){
    var slideNum = req.body.num;
    var data = 'enter';
    console.log(data);
    if (data && keys.includes(data)) {
      try {
        if (slideNum < 10) {
          keySender.sendKeys([slideNum, data]);
        } else {
          var slideNumStr = slideNum.toString();
          var length = slideNumStr.length;
          var array = [];
          for (var i = 0; i < length; i++) {
            array.push(slideNumStr.charAt(i));
          }
          array.push(data);
          keySender.sendKeys(array);
        }
        slide = slideNum;
      } catch (error) {
        console.log(error);
      }
    }
  } else if (req.body.msg == 'back'){
    var data = 'up';
   console.log(data);
   if (data && keys.includes(data)) {
     try {
       keySender.sendKey(data);
       slide--;
     } catch (error) {
       console.log(error);
     }
   }
 }
 return res.json({
   "msg": "completed"
 });
}

app.post('/get', function(req,res){
  console.log('inside /get')
  console.log(JSON.stringify(req.body, null, 2));
  process_request(req,res)
});

app.get('/connection', function(req,res){
  res.render('connection');
});
app.post('/sendUserData', connectionController.sendUserData);
app.get('/url', linkController.submitLink);
app.post('/saveLink', linkController.saveLink);

app.use('/', function(req, res) {
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;