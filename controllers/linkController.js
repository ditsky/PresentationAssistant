'use strict';
const Link = require('../models/link');
const Student = require('../models/student');
const opn = require('opn');

// this displays all of the skills
exports.submitLink = (req, res) => {
  //console.log('in getAllLinks');
  Link.find({})
    .exec()
    .then(links => {
      res.render('url', { links: links });
    })
    .catch(error => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log('link promise complete');
    });
};

exports.goToLink = (req, res) => {
  Link.find({})
    .exec()
    .then(links => {
      opn(links[0].url);
    })
    .catch(error => {
      console.log(error.message);
      return [];
    });
};

exports.saveLink = (req, res) => {
  //console.dir(req)
  let newLink = new Link({
    name: req.body.name,
    url: req.body.url
  });

  let newConnection = createUser(userID)

  newLink
    .save()
    .then(() => {
      res.render('url');
    })
    .catch(error => {
      res.send(error);
    });
};

exports.saveStudent = (req, res) => {
  let newStudent = new Student({
    name: req.body.student
   });

  newStudent
    .save()
    .then(() => {
      res.render('url');
    })
    .catch(error => {
      res.send(error);
    });
};
