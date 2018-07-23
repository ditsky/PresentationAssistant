'use strict';
const mongoose = require( 'mongoose' );

var studentSchema = mongoose.Schema( {
  name: String
} );

module.exports = mongoose.model( 'Student', studentSchema );
