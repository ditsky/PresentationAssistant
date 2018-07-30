'use strict';
const Student = require( '../models/student' );

exports.getAllStudents = ( req, res ) => {
  //console.log('in getAllgames')
  Student.find( {} )
    .exec()
    .then( ( students ) => {
      res.render( 'url', {
        students: students
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log('student promise complete')
    } );
};

var rand = "";
exports.randomStudent = (callback) => {
  //console.log('in getAllgames')
  Student.find( {} )
    .exec()
    .then( ( students ) => {
      rand = students[Math.floor(Math.random() * students.length)].name;
      console.log(rand)
      callback(null, rand);
    } )
    .catch( ( error ) => {
      console.log( error.message );
      callback(error);
    } )
    .then( () => {
      console.log('student promise complete')
    } );
};

exports.saveStudent = ( req, res ) => {
  let newStudent = new Student( {
    name: req.body.sname
  } )

  newStudent.save()
    .then( () => {
      res.redirect( '/url' );
    } )
    .catch( error => {
      res.send( error );
    } );
};
