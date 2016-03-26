var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
  console.log('connected');
});
// private variable
var fifoQueue = require('fifo')();

// Constructor
function UrlFrontier() {

}

/**
 * Add new url to queue.
 */
UrlFrontier.prototype.add = function (url) {
  fifoQueue.push(url);
};


/**
 * Returns the last inserted  url in queue.
 */
UrlFrontier.prototype.get = function () {
  return fifoQueue.shift();
};


/**
 * Returns the length of the queue.
 */
UrlFrontier.prototype.length = function () {
  return fifoQueue.length;
};

/**
 * Loopes throw all the queue and logs the action.
 */
UrlFrontier.prototype.iteration = function () {
  fifoQueue.forEach(function (value, node) {
    console.log(node.value);
  })
};

/**
 * Clear the queue
 */
UrlFrontier.prototype.clear = function () {
  fifoQueue.clear()
};

/**
 * Checks if link is already in queue
 */
UrlFrontier.prototype.isLinkInQueue = function (link) {
  var duplicateElements = [];
  fifoQueue.forEach(function (value, node) {
    if (node.value == link) {
      duplicateElements.push(value);
    }
  })

  if (duplicateElements.length > 0) {
    return true;
  } else {
    return false;
  }
};


// export the class
module.exports = UrlFrontier;
