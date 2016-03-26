'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactsSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  firstName: String,
  lastName: String,
  group: {type:String, enum: ['friends','family','work','others']}
});

module.exports = mongoose.model('Contacts', ContactsSchema);
