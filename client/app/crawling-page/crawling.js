/**
 * Created by AncientMachine on 02.01.2016.
 */
'use strict';

angular.module('acrawlerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('crawling', {
        url: '/crawling',
        templateUrl: 'app/crawling-page/crawling.html',
        controller: 'CrawlingCtrl',
        authenticate: true
      });
  });
