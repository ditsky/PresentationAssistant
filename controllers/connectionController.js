'use strict';
const Connection = require('../models/connection');
const axios = require('axios');


exports.sendUserData = (req, res) => {
  let newConnection = new Connection ({
    ngrok: req.body.ngrok,
    code: req.body.code,
    userID: null
  });
  //https://speechflow.herokuapp.com/users
  //https://ad4cc64c.ngrok.io/users
  axios.post('https://speechflow.herokuapp.com/users',newConnection)
    .then(response => {
      console.log('sent');
      console.log(response.data.msg);
      res.render('connection', { response: 'You are Connected!' });
    })
    .catch(error => {
      console.log(error);
    });
};
