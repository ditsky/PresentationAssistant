'use strict';
const Link = require('../models/link'),
  opn = require('opn');
console.log('loading the link Controller');

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
    url: req.body.url
  });

  newLink
    .save()
    .then(() => {
      res.redirect('/url');
    })
    .catch(error => {
      res.send(error);
    });
};
