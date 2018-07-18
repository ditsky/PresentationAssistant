'use strict';
const Link = require('../models/link');
console.log('loading the link Controller');

// this displays all of the skills
exports.goToLink = (req, res) => {
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
