'use strict';
const mongoose = require( 'mongoose' );

//var userSchema = mongoose.Schema( {any:{}})

var studentSchema = mongoose.Schema( {
  name: String
} );

module.exports = mongoose.model( 'Student', studentSchema );
