'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  TemplateSchema = require('./template.model').schema;

var TemplatesSchema = new Schema({
  name: String,
  templates: [TemplateSchema]
});

module.exports = mongoose.model('Templates', TemplatesSchema);
