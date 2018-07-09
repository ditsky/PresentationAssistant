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

function process_request(req, res){
  var output_string="There was an error!";
  var direction;
  var distance = 1;
  if (req.body.request){
    if (req.body.request.intent.name == "forward_slide") {
      distance = req.body.request.intent.slots.distance.value;
      direction = 1;
      changeSlide(direction,distance);
      output_string="You are on slide " + slide_number;
    } else if (req.body.request.intent.name == "back_slide") {
      distance = req.body.request.intent.slots.distance.value;
      direction = -1;
      changeSlide(direction,distance);
      output_string="You are on slide " + slide_number;
    } else if (req.body.request.intent.name == "go_to_slide") {
      slide_number = parseInt(req.body.request.intent.slots.slide.value);
      console.log(slide_number)
      output_string="You are on slide " + slide_number;
    }
    return res.json({
      "version": "string",

      "sessionAttributes": {
          "key": "value"
    },
    "response": {
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

};

service.post('/hook', function (req,res) {
    console.log(JSON.stringify(req.body, null, 2));
    process_request(req,res)
});
