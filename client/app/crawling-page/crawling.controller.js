/**
 * Created by AncientMachine on 02.01.2016.
 */
(function () {
  'use strict';

  angular
    .module('acrawlerApp')
    .controller('CrawlingCtrl', CrawlingCtrl);

  CrawlingCtrl.$inject = ['$scope', '$http', '$interval'];

  /* @ngInject */
  function CrawlingCtrl($scope, $http, $interval) {
    $scope.progress = 10;
    $scope.status = "Downloading";
    var i = 0;
    $interval(function() {
      $scope.progress += 10;
      $scope.status = $scope.status+ i++ + '</br>';
    }, 500, 9);
    activate();

    ////////////////

    function activate() {
      $http.post('/api/crawling', {}).then(function(message) {
          console.log(message);
      }, function (error) {
        console.log('error', error);
      })
    }
  }

})();

