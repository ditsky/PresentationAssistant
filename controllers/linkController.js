'use strict';
const Link = require( '../models/link' );
const opn = require('opn');
console.log("loading the link Controller")


// this displays all of the skills
exports.goToLink = ( req, res ) => {
  console.log('in getAllLinks')
  Link.find( {} )
    .exec()
    .then( ( links ) => {
      console.log(links[1].url)
      opn(links[1].url);
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'link promise complete' );
    } );
};

exports.saveLink = ( req, res ) => {
  //console.log("in saveGame!")
  //console.dir(req)
  let newLink = new Link( {
    url: req.body.url
  } )

  newLink.save()
    .then( () => {
      res.redirect( '/test' );
    } )
    .catch( error => {
      res.send( error );
    } );
};
