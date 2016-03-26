/**
 * Created by AncientMachine on 26.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('acrawlerApp')
    .controller('NewContactController', NewContactController);

  NewContactController.$inject = ['$scope', '$uibModalInstance', 'selectedContact'];

  /* @ngInject */
  function NewContactController($scope, $uibModalInstance, selectedContact) {
    $scope.status = {
      isopen: false
    };
    console.log("selectedContact", selectedContact);
    $scope.newContact = {};
    $scope.items = [
      'friends',
      'family',
      'work',
      'others'
    ];
    $scope.selectGroup = function(group) {
      $scope.newContact.group = group;
    };
    activate();

    ////////////////

    function activate() {
    if (selectedContact) {
      $scope.newContact = selectedContact;
    }
    }
    $scope.ok = function () {
      $uibModalInstance.close($scope.newContact);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();

