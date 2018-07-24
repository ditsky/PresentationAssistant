'use strict';
const Connection = require('../models/connection');
const axios = require('axios');


exports.sendUserData = (req, res) => {
  let newConnection = new Connection ({
    ngrok: req.body.ngrok,
    code: req.body.code,
    userID: 'placeholder'
  });
  axios.post('https://speechflow.herokuapp.com/hook',newConnection)
    .then(response => {
      console.log('sent');
    })
    .catch(error => {
      console.log(error);
    });
};
