'use strict';
const mongoose = require( 'mongoose' );

//var userSchema = mongoose.Schema( {any:{}})

var linkSchema = mongoose.Schema( {
  url: String
} );

module.exports = mongoose.model( 'Link', linkSchema );
