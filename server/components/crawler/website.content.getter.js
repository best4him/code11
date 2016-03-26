/**
 * Created by AncientMachine on 13.01.2016.
 */
/**
 * Request dependencies
 * @type {request|exports|module.exports}
 */
var request = require("request");
var moment = require('moment');
var fs = require('fs');
var cheerio = require("cheerio");

/**
 * Constructor
 * @constructor
 */
function WebsiteContentGetter() {

}

/**
 * Returns the html content of a given uri.
 * If error log the errors in a file.
 */
WebsiteContentGetter.prototype.getContent = function (uri, callback) {
  request({
    uri: uri,
  }, function (error, response, body) {
    if (!error) {
      callback(body);
    } else {
      var fileName = 'logs/error_log.txt';
      fs.appendFile(fileName, error + '\r\n', function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("-- An error occurred and was logged in the file " + fileName);
      })
    }
  });
}

/**
 * Returns the html content of a given uri.
 * If error log the errors in a file.
 */
WebsiteContentGetter.prototype.getAddedDateOrTime = function (htmlContent, callback) {
  var $ = cheerio.load(htmlContent);
  var links = $('time');
  var time = "0000-00-00 00:00:00";
  if (Object.keys(links).length > 0) {
    if(links && links[Object.keys(links)[0]] && links[Object.keys(links)[0]].attribs && links[Object.keys(links)[0]].attribs.datetime){
      var htmlTime = links[Object.keys(links)[0]].attribs.datetime;
      if (htmlTime) {
        if (moment(htmlTime).isValid()) {
          time = moment(htmlTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          callback(null, time);
        }else{
          callback(null, time);
        }
      } else {
        callback(null, time);
      }
    }else{
      callback(null, time);
    }
  } else {
    callback(null, time);
  }
}


// export the class
module.exports = WebsiteContentGetter;
