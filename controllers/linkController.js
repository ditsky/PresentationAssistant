'use strict';
const Link = require('../models/link');
const Student = require('../models/student');
const opn = require('opn');


exports.getAllStudents = ( req, res) => {
  Student.find( {} )
    .exec()
    .then( ( students ) => {
      getAllLinks(req,res,students)
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'student promise complete' );
    } );
};

// this displays all of the skills
function getAllLinks (req, res, students) {
  //console.log('in getAllLinks');
  Link.find({})
    .exec()
    .then(links => {
      console.log('rendering')
      res.render('url', { links: links, students: students });
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
  req.body.urlname = req.body.urlname.toLowerCase();
  let newLink = new Link({
    name: req.body.urlname,
    url: req.body.url
  });

  //let newConnection = createUser(userID)

  newLink
    .save()
    .then(() => {
      res.redirect('/url');
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
      res.redirect('/url');
    })
    .catch(error => {
      res.send(error);
    });
};
