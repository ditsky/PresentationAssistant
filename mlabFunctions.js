function newCode(){
  const val = Math.round(10000000*Math.random())
  return val;
}

//recieving ngrok from laptop
function updateNgrok(code){
	Connections.update({code:code}, {$set:{ngrok:ngrok}})
	.then(res.send('updated'))
  .error(res.send('error'+error));
}


//recieving userID from phone
function updateUser(req,res,next){
  Connections.update({code:code}, {$set:{userID:userID}})
    .then(res.send('updated'))
    	next()
    .error(res.send('error: '+ error));
}

function createUser(userID){
	const code = newCode();
        //res.json(code)
        let newConnection = new Connection({
        	code:code,
          ngrok:null,
          userID: userID
        })
  return newConnection;
}


//send command to laptop
function sendCommand(req,res,next){
  if (req.body.queryResult.intent.displayName == 'connect') {
  	res.locals.output_string = 'please enter code: '+res.locals.connection.code;
    next()
  } else if (req.body.queryResult.intent.displayName == 'nextSlide') {
    axios
      .post(res.locals.connection.ngrok+'/get', { msg: 'next' })
      .then(response => {
        console.log('on heroku sending to ngrok ');
        res.locals.output_string = 'Moving to the next slide';
        next();
      })
      .catch(error => {
        console.log('error in nextSlide' + error);
      });
  } else if (req.body.queryResult.intent.displayName == 'goToSlide') {
    var slideNum = req.body.queryResult.parameters['number-integer'];
    axios
      .post(res.locas.connection.ngrok+'/get', { msg: 'goTo', num: slideNum })
      .then(response => {
        console.log('on heroku sending to ngrok ');
        res.locals.output_string = 'Moving to slide number ' + slideNum;
        next();
      })
      .catch(error => {
        console.log('error in goToSlide' + error);
      });
  } else if (req.body.queryResult.intent.displayName == 'randomStudent') {
    axios
      .post(res.locals.connection.ngrok+'/get', { msg: 'random' })
      .then(response => {
        console.log('on heroku sending to ngrok ');
        res.locals.output_string = 'selected ' + response.data.msg;
        next();
      })
      .catch(error => {
        console.log('error in randonStudent' + error);
      });
  } else if (req.body.queryResult.intent.displayName == 'goToLink') {
    axios
      .post(res.locals.connection.ngrok+'/get', { msg: 'link' })
      .then(response => {
        console.log('on heroku sending to ngrok ');
        res.locals.output_string = 'opening the link';
        next();
      })
      .catch(error => {
        console.log('error in goToLink' + error);
      });
  } else if (req.body.queryResult.intent.displayName == 'previousSlide') {
    axios
      .post(res.locals.connection.ngrok+'/get', { msg: 'back' })
      .then(response => {
        console.log('on heroku sending to ngrok ');
        res.locals.output_string = 'Moving to the previous slide';
        next();
      })
      .catch(error => {
        console.log('error in previousSlide' + error);
      });
  } else {
    res.locals.output_string = 'oh noooooooooooooo';
    next();
  }
}

//find ngrok code
function attachConnection(req,res,next){
	console.dir(req.body)
	Connections.find({userID:req.body.userID})
	.exec()
  .then(connection => {
      if (connection.length==0){
      	let newConnection = createUser(userID);
        const code = newConnection.code
        newConnection
        .save()
        .then(() => {
          //res.send(code);
          res.locals.connection = newConnection
          next()
        })
      } else {
        res.locals.connection = connection[0];
        next()
      }
    })
}
