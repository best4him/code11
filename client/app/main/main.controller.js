(function () {
  'use strict';

  angular
    .module('acrawlerApp')
    .controller('MainCtrl', ControllerName);

  ControllerName.$inject = ['$scope', '$http', 'socket', 'Auth', '$uibModal'];

  /* @ngInject */
  function ControllerName($scope, $http, socket, Auth, $uibModal) {


    activate();
    $scope.contacts = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.openModalAddNewContact = openModalAddNewContact;
    $scope.selectContact = function (contact) {
      $scope.selectedContact = contact;
    };

    $http.get('/api/contacts').success(function(contacts) {
      $scope.contacts = contacts;
      socket.syncUpdates('contacts', $scope.contacts);
    });

    $scope.addNewContact = addNewContact;


    $scope.deleteLink = function(link) {
      $http.delete('/api/contacts/' + link._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('link');
    });

    $scope.$watch('contacts', function(contacts) {
      contacts = _.sortBy(contacts,['firstName', 'lastName']);
      $scope.sortedcontacts = _.groupBy(contacts, function(item) {return item.firstName[0]; });
    }, true);


    function openModalAddNewContact() {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/main/modals/new.contact.html',
        controller: 'NewContactController',
        resolve: {
          selectedContact: function () {
            return $scope.selectedContact;
          }
        }
      });

      modalInstance.result.then(function (contact) {
        if (contact._id) {
          updateContact(contact);
        } else {
          addNewContact(contact);
        }


      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

    function addNewContact(contact) {
      if(!isValidContact(contact)) {
        return;
      }
      $http.post('/api/contacts', contact);
    }

    function updateContact(contact) {
      if(!isValidContact(contact)) {
        return;
      }
      console.log(contact);
      $http.put('/api/contacts/' + contact._id, contact);

    }
    function isValidContact (contact) {
      if(!contact.firstName === '' || !contact.lastName ) {
        return false;
      }
      return true;
    }

      ////////////////

    function activate() {

    }
  }

})();


