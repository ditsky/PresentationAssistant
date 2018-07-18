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
      for each (link in links){
        console.log(link.url)
        opn(link.url)
      }
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'link promise complete' );
    } );
};
