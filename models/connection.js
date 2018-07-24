'use strict';
const mongoose = require( 'mongoose' );

//var userSchema = mongoose.Schema( {any:{}})

var connectionSchema = mongoose.Schema( {
  ngrok: String,
  code: String,
  userID: String
} );

module.exports = mongoose.model( 'Connection', connectionSchema );
