/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Contacts = require('./contacts.model.js');

// Get list of things
exports.index = function(req, res) {
  getContacts(req.user._id, function (err, links) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(links);
  })
};
exports.getContacts = getContacts;
function getContacts (userId, callback) {
  Contacts.find({'userId': userId}, function (err, links) {
    if(err) { return callback(err, null); }
    return callback(null, links);
  });
}
// Get a single thing
exports.show = function(req, res) {
  Contacts.findById(req.params.id, function (err, link) {
    if(err) { return handleError(res, err); }
    if(!link) { return res.status(404).send('Not Found'); }
    return res.json(link);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  req.body.userId = req.user._id;
  Contacts.create(req.body, function(err, link) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(link);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Contacts.findById(req.params.id, function (err, link) {
    if (err) { return handleError(res, err); }
    if(!link) { return res.status(404).send('Not Found'); }
    var updated = _.merge(link, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(link);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Contacts.findById(req.params.id, function (err, link) {
    if(err) { return handleError(res, err); }
    if(!link) { return res.status(404).send('Not Found'); }
    link.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
