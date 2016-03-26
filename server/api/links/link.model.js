'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  name: String
});

module.exports = mongoose.model('Link', LinkSchema);
