'use strict';
const Link = require( '../models/link' );
const opn = require('opn');


exports.getAllLinks = ( req, res ) => {
  //console.log('in getAllgames')
  Link.find( {} )
    .exec()
    .then( ( links ) => {
      res.render( 'url', {
        links: links
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log('link promise complete')
    } );
};

// this displays all of the skills
exports.goToLink = ( req, res ) => {
  console.log('in gotolink')
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
      console.log( 'go to link promise complete' );
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
      res.redirect( '/url' );
    } )
    .catch( error => {
      res.send( error );
    } );
};
