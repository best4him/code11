/**
 * Created by AncientMachine on 06.01.2016.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PageSchema = new Schema({
  websiteId: {type: Schema.Types.ObjectId},
  websiteUrl : {type: String, required: true, unique: true},
  contentHtml : {type: String},
  contentText : {type: String},
  pageShares  : {type: String},
  pageViews   : {type: String},
  pageAdded    : {type: String},
  date: {type: Date, default:  Date.now},
  language: {type: Schema.Types.Mixed}
});

module.exports = mongoose.model('Page', PageSchema);
