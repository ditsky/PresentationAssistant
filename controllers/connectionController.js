'use strict';
const Connection = require('../models/connection');
const axios = require('axios');


exports.sendUserData = (req, res) => {
  let newConnection = new Connection ({
    ngrok: req.body.ngrok,
    code: req.body.code,
    userID: 'placeholder'
  });
  axios.post('https://speechflow.herokuapp.com/users',newConnection)
    .then(response => {
      res.redirect('index');
      console.log('sent');
    })
    .catch(error => {
      console.log(error);
    });
};
