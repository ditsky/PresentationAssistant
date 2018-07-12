var express = require('express');
var bodyParser = require('body-parser');
var util = require("util");

var service = express();


service.use(bodyParser.json());

var server = service.listen(8081, function() {
console.log('API server listening..')
});

var slide_number=1;

function changeSlide(direction,distance){
  slide_number=slide_number+(direction*distance);
}
/*
amazon:
if (req.body.request){
  return res.json({
    "version": "string",

    "sessionAttributes": {
        "key": "value"
  },
  "response"{
    "outputSpeech": {
        "type": "PlainText",
        "text": output_string
      },
      "reprompt": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Plain text string to speak reprompt"
        }
      },
      "shouldEndSession": true
    }

  });
}
*/
function process_request(req, res){
  var output_string="there was an error"
  var direction;
  var distance = 1;
  if (req.body.queryResult.intent.displayName == "next_slide") {
    output_string="next_slide"
    distance = req.body.queryResult.parameters["number"];
    direction=1;
    changeSlide(direction,distance);
  } else if (req.body.queryResult.intent.displayName == "back_slide") {
    output_string="back_slide"
    distance = req.body.queryResult.parameters["number"];
    direction=-1;
    changeSlide(direction,distance);
  } else if (req.body.queryResult.intent.displayName == "go_to_slide"){
    slide_number=req.body.queryResult.parameters["number"];
    output_string="go_to_slide"
  }

  return res.json({
    "fulfillmentMessages": [],
    "fulfillmentText": output_string,
    "payload": {"slack":{"text":output_string}},
    "outputContexts": [],
    "source": "Test Source",
    "followupEventInput": {}
  });
};

service.post('/hook', function (req,res) {
    console.log(JSON.stringify(req.body, null, 2));
    process_request(req,res)
});
