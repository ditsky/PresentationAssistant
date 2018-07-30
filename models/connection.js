'use strict';
const mongoose = require( 'mongoose' );

//var userSchema = mongoose.Schema( {any:{}})

var connectionSchema = mongoose.Schema( {
  userID: String,
  code: String,
  ngrok: String
} );

module.exports = mongoose.model( 'connection', connectionSchema );
