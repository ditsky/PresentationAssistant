const
  opn = require('opn'),
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  keySender = require('node-key-sender'),
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
var slide = 1; //current slide number

const keys = ['left', 'right', 'up', 'down', 'space', 'enter', 'control', 'w', 'escape'];

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


//Monkey patching the node-key-sender library to fix jar path issues
keySender.execute = function(arrParams) {
  return new Promise(function(resolve, reject) {
    //path where the jar file resides
    const jarPath = path.join(
      __dirname,
      'node_modules',
      'node-key-sender',
      'jar',
      'key-sender.jar'
    );
    //generate command to execute the jar file
    //original command with path in quotes replace with path without enclosed in quotes
    const command =
      'java -jar ' +
      jarPath +
      ' ' +
      arrParams.join(' ') +
      keySender.getCommandLineOptions();

    return exec(command, {}, function(error, stdout, stderr) {
      if (error == null) {
        resolve(stdout, stderr);
      } else {
        reject(error, stdout, stderr);
      }
    });
  });
};

//Hits the down key on the user's keyboard
function nextSlide(){
  var data = 'down';
  console.log(data);
  console.dir(keys)
  if (data && keys && keys.includes(data)) {

    try {
      keySender.sendKey(data);
      slide++;
    } catch (error) {
      console.log(error);
    }
  }
}

//Hits the up key on the user's keyboard
function backSlide(){
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

//Uses the slide number from the request to first type the slide number
//Then hit the enter key since in ppt "number+enter" goes to that slide number
function goTo(slideNum){
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
}

function raiseVolume(){
  console.log('raising volume')
  keySender.sendCombination(['meta', 'f12']);
}

function space(){
  var data = 'space';
  console.log(data);
  if (data && keys.includes(data)) {
   try {
     keySender.sendKey(data);
   } catch (error) {
     console.log(error);
   }
  }
}

function closeWindow(){
  var ctrl = 'control';
  var w = 'w';
  console.log(ctrl+w);
  if (ctrl && w && keys.includes(ctrl) && keys.includes(w)) {
   try {
     keySender.sendCombination([ctrl,w]);
   } catch (error) {
     console.log(error);
   }
  }
}

function exitPresentation(){
  var data = 'escape';
  console.log(data);
  if (data && keys.includes(data)) {
   try {
     keySender.sendKey(data);
   } catch (error) {
     console.log(error);
   }
  }
}

function random(){

  console.log('picking random student')
}

function link(name){
  const Link = require('./models/link');
  Link.find({name:name})
	.exec()
  .then(links => {
    console.log(links[0].url)
    opn(links[0].url)
    })
  .catch(error => {
    console.log(error.message);
    res.locals.output = "the link has not been entered"
  })
  console.log(url)
}

function process_request(req, res, next){
  res.locals.output = "Completed"
  console.log('recieved request: ')
  console.log(req.body)
  if (req.body.msg == 'next'){
    nextSlide();
  } else if (req.body.msg == 'goTo'){
    var slideNum = req.body.num;
    goTo(slideNum);
  } else if (req.body.msg == 'back'){
    backSlide();
  } else if (req.body.msg == 'link'){
    link(req.body.name);
    res.locals.output = "opening link"
  } else if (req.body.msg == 'random'){
    random();
    res.locals.output = "Sam"
  } else if (req.body.msg == "space"){
    space();
  } else if (req.body.msg == "closeWindow"){
    closeWindow();
  } else if (req.body.msg == 'raiseVolume') {
    raiseVolume();
  } else {
    console.log('no command recieved')
    res.locals.output = "Failed"
  }
  next()
}

app.post('/get', process_request, function(req,res){
  console.log(JSON.stringify(req.body, null, 2));
  console.dir(res.locals.output)
  res.json({"msg": res.locals.output});
});

app.get('/about', function(req, res) {
  console.log('The request is: ')
  //console.dir(req)
  console.log(req.headers['user-agent'])
  res.render('about');
});
app.post('/sendUserData', connectionController.sendUserData);
app.get('/url', linkController.submitLink);
app.post('/saveLink', linkController.saveLink);
app.post('/saveStudent', linkController.saveStudent);

app.get('/', function(req, res) {
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
