'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Template', TemplateSchema);
