/**
 * Created by AncientMachine on 12.01.2016.
 */
var linkController = require('../../api/links/link.controller');
/**
 * UrlList Class
 * This object will contain an start url list that
 * crawler will user to start scraping.
 * @constructor
 */
function UrlList() {

  this.list = new Array();

}

/**
 * Populating the list with predefined start urls.
 */
UrlList.prototype.initialiseList = function (userId, callback) {
  var self = this;
  self.userId = userId;
  linkController.getLinks(self.userId, function(err, links) {
    self.list = links;
    callback(null, links);
  })

};

/**
 * Adding an new url to the predefinded list.
 */
UrlList.prototype.add = function (url) {
  this.list.push(url);
};

/**
 * Returns the url array.
 */
UrlList.prototype.get = function () {
  return this.list;
};

/**
 * Returns the url array.
 */
UrlList.prototype.length = function () {
  return this.list.length;
};


// export the class
module.exports = UrlList;
