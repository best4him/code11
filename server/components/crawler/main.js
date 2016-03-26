/**
 * Created by AncientMachine on 12.01.2016.
 */
'use strict';
var urlFrontierComponent = require('./url-frontier');
var urlListComponent = require('./url_list');
var linkExtractorComponent = require('./link.extractor');
var websiteGetContentComponent = require('./website.content.getter');
var Page = require('./page.model');
var urlList = new urlListComponent();
var async = require('async');
var htmlToText = require('html-to-text');
var HashTable = require('hashtable');
var crypto = require('crypto');
var logComponent = require('../log/log.service');
var risComponent = require('./rewind.input.stream');
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();
var urlFrontier = new urlFrontierComponent();
var linkExtractor = new linkExtractorComponent();
var websiteConentGetter = new websiteGetContentComponent();
var ris = new risComponent();
var log = new logComponent();

global.seenUrlHashtable = new HashTable();
global.currentCrawlingUrl = null;
global.currentWebsiteId = null;

exports.startCrawling = function(userId, callback) {
 urlList.initialiseList(userId, function(err, links) {
   if (err) {
     console.log('error initializing links');
   }
   console.log('url list initialized');
   getNextWebsiteFromListAndStartCrawling();
 })
};
function getNextWebsiteFromListAndStartCrawling() {
  var websiteToCrowl = urlList.get().shift();

  urlFrontier.clear();
  urlFrontier.add(websiteToCrowl.name);
  global.currentWebsiteId = websiteToCrowl._id;
  console.log('Starting to crawl...', websiteToCrowl.name);
  start();
}

/**
 * Get next url from urlFrontier and get the content.
 */
function start() {
  console.log('Url frontier length: ' + urlFrontier.length());
  if (urlFrontier.length() > 0) {
    var link = urlFrontier.get();
    getLinkContentAndStartProcessing(link);
  } else {
    if (urlList.length() > 0) {
      getNextWebsiteFromListAndStartCrawling();
    } else {
      console.log('-- Job done. All websites from initial list crawled. ;)');
      console.log('-- Proud of me master? :)');
    }
  }
}

/**
* Get website content and start processign
* @param url
*/
function getLinkContentAndStartProcessing(url) {
  console.log('Getting content from : ' + url);
  global.currentCrawlingUrl = url;
  markLinkAsCrawled();
  websiteConentGetter.getContent(url, processWebsiteContent);
}

/**
 * Process website content
 * @param websiteContent
 * @param websiteUrl
 */
function processWebsiteContent(websiteContent) {
  ris.setContent(websiteContent);
  //console.log('Content getted: ' + ris.getContent());
  async.parallel([
      function (callback) {
        extractHtml(ris.getContent(), callback)
      },
      function (callback) {
        extractText(ris.getContent(), callback)
      },
      function (callback) {
        extractLinks(ris.getContent(), callback)
      },
      function (callback) {
        extractPageViews(ris.getContent(), callback)
      },
      function (callback) {
        extractDate(ris.getContent(), callback)
      },
      function (callback) {
        extractShares(ris.getContent(), callback)
      }
    ],
    function (err, results) {
      if (!err) {
        processParalelResults(results);
        start();
      } else {
        log.logError(err);
      }
    }
  );
}

/**
 * Retrun the html content.
 */
function extractHtml(content, callback) {
  callback(null, content);
}

/**
 * Extract only text from content.
 */
function extractText(content, callback) {

  var textContent = htmlToText.fromString(content, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true
  });

  callback(null, textContent);
}

/**
 * Extract links from content.
 */
function extractLinks(content, callback) {
  //linkExtractor.getAllLinks(global.currentCrawlingUrl, content, callback);
  callback(null, [] );
}

/**
 * Extract how may users have viewed the page.
 */
function extractPageViews(content, callback) {
  // put here code do extract vews
  callback(null, 2566);
}

/**
 * Extract the date the page was created.
 * YYYY-MM-DD HH:MM:SS
 */
function extractDate(content, callback) {
  // put here code do extract date
  websiteConentGetter.getAddedDateOrTime(content, callback);
}

/**
 * Extract how many users have shared the page.
 */
function extractShares(content, callback) {
  // put here code do extract vews
  callback(null, 356);
}


/**
 * Add data to database and add lins to url frontier.
 */
function processParalelResults(results) {
  saveDataToDb(results);
  addExtractedLinksToUrlFrontier(results[2]);
}

function markLinkAsCrawled(){
  var linkHash = crypto.createHash('sha256').update(global.currentCrawlingUrl).digest('hex');
  global.seenUrlHashtable.put(linkHash, {value: ''});
}

/**
 * Add extracted links to urlFrontier
 */
function addExtractedLinksToUrlFrontier(links) {
  for (var i = 0; i < links.length; i++) {
    if (!urlFrontier.isLinkInQueue(links[i])) {
      urlFrontier.add(links[i]);
    }
  }
}

/**
 * Insert data in database
 * @param data
 */
function saveDataToDb(data) {

  var doc = {
     websiteId : global.currentWebsiteId,
   websiteUrl : global.currentCrawlingUrl,
   contentHtml : data[0],
   contentText : data[1],
   pageViews : data[3],
   pageAdded : data[4],
   pageShares : data[5]

  };
  //language:lngDetector.detect(data[1],3)
 var page = new Page(doc);

  page.save(function(err) {
      console.log('err', err);
    console.log('Page ' + global.currentCrawlingUrl + 'inserted');
  });

}
