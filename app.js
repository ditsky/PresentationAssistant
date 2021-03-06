const opn = require('opn'),
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  keySender = require('node-key-sender'),
  logger = require('morgan'),
  axios = require('axios'),
  flash = require('connect-flash'),
  linkController = require('./controllers/linkController'),
  connectionController = require('./controllers/connectionController'),
  bodyParser = require('body-parser'),
  path = require('path'),
  exec = require('child_process').exec,
  express = require('express'),
  shell = require('shelljs'),
  ngrok = require('ngrok'),
  fs = require('fs'),
  pdfjsLib = require('pdfjs-dist');

//connecting to ngrok
let ngrokurl = false;

function toNgrok(req, res, next) {
  if (ngrokurl) {
    res.render('code', { url: ngrokurl });
  } else {
    ngrok
      .connect(8081)
      .then(url => {
        ngrokurl = url;
        console.log('urlB ' + url);
        res.render('code', { url: url });
      })
      .catch(error => {
        console.log('asd ' + error);
        next();
      });
  }
}

//open the site
opn('http://localhost:8081/');

var app = express(); //initialize an express server for gui
var slide = 1; //current slide number

const keys = [
  'left',
  'right',
  'up',
  'down',
  'space',
  'enter',
  'control',
  'w',
  'escape'
];

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/PresentationAssistant');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

//connect monggoDB on node.js without terminal opening
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'myProject';

MongoClient.connect(
  url,
  function(err, client) {
    assert.equal(null, err);
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    client.close();

    /*
  if (err) {
    console.log("a" + err);
  } else {
    console.log("Connected to the end");
  }
  db.close();
  */
  }
);

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
function nextSlide() {
  var data = 'down';
  console.log(data);
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
function backSlide() {
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
function goTo(slideNum) {
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

function space() {
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

function closeWindow() {
  var ctrl = 'control';
  var w = 'w';
  console.log(ctrl + w);
  if (ctrl && w && keys.includes(ctrl) && keys.includes(w)) {
    try {
      keySender.sendCombination([ctrl, w]);
    } catch (error) {
      console.log(error);
    }
  }
}

function endPresentation() {
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

function randomStudent(req, res, next) {
  const Student = require('./models/student');
  Student.find({})
    .exec()
    .then(students => {
      var rand = students[Math.floor(Math.random() * students.length)];
      res.locals.output = rand.name;
      next();
    })
    .catch(error => {
      console.log(error.message);
      res.locals.output = 'error selecting student';
    });
}

// function randomGroups(req,res,num){
//   Student.find({})
//   .exec()
//   .then(students => {
//     var array = students;
//     while (array.length > 0) {
//       array.push(array.splice(0, num));
//     }
//     //for (var i=0; i<arr)
//   //  res.locals.output
//   })
//   .catch(error => {
//     console.log(error.message);
//     res.locals.output = "error making groups"
//   })
//
// }

function link(name) {
  endPresentation();
  const Link = require('./models/link');
  Link.find({ name: name })
    .exec()
    .then(links => {
      console.log(links[0].url);
      opn(links[0].url);
    })
    .catch(error => {
      console.log(error.message);
      //res.locals.output = "the link has not been entered"
    });
}

function pdf() {
  var pdfPath = 'C:/Users/kevin/Desktop/How-to-give-a-proper-lecture.pdf';
  pdfjsLib
    .getDocument(pdfPath)
    .then(function(doc) {
      var numPages = doc.numPages;
      console.log('# Document Loaded');
      console.log('Number of Pages: ' + numPages);
      console.log();

      var lastPromise; // will be used to chain promises
      lastPromise = doc.getMetadata().then(function(data) {
        console.log('# Metadata Is Loaded');
        console.log('## Info');
        console.log(JSON.stringify(data.info, null, 2));
        console.log();
        if (data.metadata) {
          console.log('## Metadata');
          console.log(JSON.stringify(data.metadata.getAll(), null, 2));
          console.log();
        }
      });

      var loadPage = function(pageNum) {
        return doc.getPage(pageNum).then(function(page) {
          console.log('# Page ' + pageNum);
          var viewport = page.getViewport(1.0 /* scale */);
          console.log('Size: ' + viewport.width + 'x' + viewport.height);
          console.log();
          return page
            .getTextContent()
            .then(function(content) {
              // Content contains lots of information about the text layout and
              // styles, but we need only strings at the moment
              var strings = content.items.map(function(item) {
                return item.str;
              });
              console.log('## Text Content');
              console.log(strings.join(' '));
            })
            .then(function() {
              console.log();
            });
        });
      };
      // Loading of the first page will wait on metadata and subsequent loadings
      // will wait on the previous pages.
      for (var i = 1; i <= numPages; i++) {
        lastPromise = lastPromise.then(loadPage.bind(null, i));
      }
      return lastPromise;
    })
    .then(
      function() {
        console.log('# End of Document');
      },
      function(err) {
        console.error('Error in pdf: ' + err);
      }
    );
}

function process_request(req, res, next) {
  res.locals.output = 'Completed';
  console.log('recieved request: ');
  console.log(req.body);
  if (req.body.msg == 'next') {
    nextSlide();
    next();
  } else if (req.body.msg == 'goTo') {
    var slideNum = req.body.num;
    goTo(slideNum);
    next();
  } else if (req.body.msg == 'back') {
    backSlide();
    next();
  } else if (req.body.msg == 'link') {
    link(req.body.name);
    res.locals.output = 'opening link';
    next();
  } else if (req.body.msg == 'random') {
    randomStudent(req, res, next);
  } else if (req.body.msg == 'end') {
    endPresentation();
    next();
  } else if (req.body.msg == 'space') {
    space();
    next();
  } else if (req.body.msg == 'closeWindow') {
    closeWindow();
    next();
  } else if (req.body.msg == 'ppt') {
    pdf();
    next();
  } else {
    console.log('no command recieved');
    res.locals.output = 'Failed';
    next();
  }
}

app.post('/get', process_request, function(req, res) {
  console.log('in /get log 1: ' + JSON.stringify(req.body, null, 2));
  console.dir('in /get log 2: ' + res.locals.output);
  res.json({ msg: res.locals.output });
});

app.get('/code', toNgrok, function(req, res) {
  console.log('The request is: ');
  //console.dir(req)
  console.log(req.headers['user-agent']);
  res.render('code');
});
app.post('/sendUserData', connectionController.sendUserData);
app.get('/url', linkController.getAllStudents);
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
