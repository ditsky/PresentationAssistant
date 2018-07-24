'use strict';
const Connection = require('../models/connection');
const axios = require('axios');

// this displays all of the skills
exports.render = (req, res) => {
  //console.log('in getAllLinks');
  Link.find({})
    .exec()
    .then(links => {
      res.render('connection', { links: links });
    })
    .catch(error => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log('link promise complete');
    });
};


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
