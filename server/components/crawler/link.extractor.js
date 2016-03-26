/**
 * Created by AncientMachine on 13.01.2016.
 */
var cheerio = require("cheerio");
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");
var crypto = require('crypto');

var baseUrl = '';

// Constructor
function LinkExtrator() {
}


/**
 * Returns an array with all links.
 * @param body
 */
LinkExtrator.prototype.getAllLinks = function (url, body, mainCallback) {
  baseUrl = getBaseUrl(url);
  var links = [];
  var i = 0;
  var $ = cheerio.load(body);
  $("a").each(function () {
    var href = $(this).attr("href");
    if (href) {
      var linkHref = cleanLink(href);
      if (checkIfIsValid(linkHref)) {
        var linkHash = crypto.createHash('sha256').update(linkHref).digest('hex');
        if(!global.seenUrlHashtable.has(linkHash)){
          links[i] = linkHref;
          i++;
        }
      }
    }
  });
  return mainCallback(null, links);
}

/**
 * Returns the cleaned link
 * @param body
 */
function cleanLink(link) {
  var url = getAbsoluteLink(link);
  url = url.split('#')[0];
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }
  return url;
}

/**
 * Detects rather link is absolute and relatieve and
 * if it is relative converts it to absolute.
 * @param link
 */
function getAbsoluteLink(link) {
  if (isAbsoluteUrl(link)) {
    return link;
  } else {
    return baseUrl + '/' + link;
  }
}

/**
 * Return true if link is valid
 * @param link
 * @returns {boolean}
 */
function checkIfIsValid(link) {
  if (!isLinkSocialMedia(link)
    && !isLinkAResource(link)
    && isLinkFromThisDomain(link)
    && !isUrlToSendMail(link)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Return absolute base url
 * http://www.google.com/search/bara/aana
 * returns http://www.google.com
 * @param url
 * @returns {string}
 */
function getBaseUrl(url) {
  var urlData = urlparser.parse(url);
  return urlData.protocol + '//' + urlData.host;
}


/**
 * Check if link is used to send an email
 * http://kristogodari.com/mailto:kristo.godari@gmail.com
 * @param url
 * @returns {boolean}
 */
function isUrlToSendMail(url) {
  if (url.indexOf('mailto') > -1) {
    return true;
  } else {
    return false;
  }
}
/**
 *
 * @param url
 */
function isLinkSocialMedia(url) {
  var socialMediaLinks = [
    'google.com',
    'facebook.com',
    'youtube.com',
    'linkedin.com',
    'flickr.com',
    'twitter.com',
    'instagram.com',
    'pinterest.com',
    'qzone.qq.com',
    'vk.com',
    'tumblr.com',
    'renren.com',
    'bebo.com',
    'tagged.com',
    'orcut.com',
    'netlog.com',
    'goodreads.com',
    'soundcloud.com',
    'about.me',
    'ask.fm'
  ];

  var socialMedia = [];

  socialMediaLinks.forEach(checkIfSocialMedia);

  function checkIfSocialMedia(element, index, array) {
    if (url.indexOf(element) > -1) {
      socialMedia.push(element);
    }
  }

  if (socialMedia.length > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * Check if link is from domain.
 * @param url
 */
function isLinkFromThisDomain(link) {
  if (link.indexOf(baseUrl) > -1) {
    return true;
  } else {
    return false;
  }
}

/**
 * Check if link is a resource ex: image, pdf, doc...
 * @param link
 * @returns {boolean}
 */
function isLinkAResource(link) {
  var staticFilesLink = [
    '.css',
    '.js',
    '.avi',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.exe',
    '.gif',
    '.jpg',
    '.jpeg',
    '.mid',
    '.midi',
    '.mp3',
    '.mpg',
    '.mpeg',
    '.qt',
    '.pdf',
    '.png',
    '.ram',
    '.rar',
    '.zip',
    '.tiff',
    '.wav',
  ];

  var staticFilesLinks = [];

  staticFilesLink.forEach(checkIfStaticFiles);

  function checkIfStaticFiles(element, index, array) {
    if (link.match(element + "$")) {
      staticFilesLinks.push(element);
    }
  }

  if (staticFilesLinks.length > 0) {
    return true;
  } else {
    return false;
  }
}


// export the class
module.exports = LinkExtrator;
