/**
 * Created by AncientMachine on 12.01.2016.
 */
'use strict';
var crawler = require('../../components/crawler/main');
exports.startCrawling = function(req, res) {
  console.log('start Crawling');
  crawler.startCrawling(req.user._id, function(err, data) {

  });

    res.status(200).send('Crawling finished');
};
