'use strict';

angular.module('acrawlerApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;

    $http.get('/api/links').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('link', $scope.awesomeThings);
    });

    $scope.addLink = function() {
      if($scope.link === '') {
        return;
      }
      $http.post('/api/links', { name: 'http://www.' + $scope.link });
      $scope.link = '';
    };

    $scope.deleteLink = function(link) {
      $http.delete('/api/links/' + link._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('link');
    });
  });
