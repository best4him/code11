/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var link = require('./contacts.model.js');

exports.register = function(socket) {
  link.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  link.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('contacts:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('contacts:remove', doc);
}
