/**
 * Created by AncientMachine on 26.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('acrawlerApp')
    .controller('AdvanceFilterController', AdvanceFilterController);

  AdvanceFilterController.$inject = ['$scope', '$uibModalInstance'];

  /* @ngInject */
  function AdvanceFilterController($scope, $uibModalInstance) {

    $scope.status = {
      isopen: false
    };
    $scope.filter = {};
    $scope.items = [
      'friends',
      'family',
      'work',
      'others'
    ];
    $scope.selectGroup = function(group) {
      $scope.filter.group = group;
    };
    activate();

    ////////////////

    function activate() {

    }
    $scope.ok = function () {
      $uibModalInstance.close($scope.filter);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();

