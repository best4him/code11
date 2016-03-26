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
    $scope.openModalEditContact = openModalEditContact;
    $scope.openModalAdvanceFilter = openModalAdvanceFilter;
    $scope.addNewContact = addNewContact;

    $scope.selectContact = function (contact) {
      $scope.selectedContact = contact;
    };

    $scope.deleteContact = function(contact) {
      $http.delete('/api/contacts/' + contact._id);
      $scope.selectedContact = undefined;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('link');
    });

    $scope.$watch('contacts', function(contacts) {
      contacts = _.sortBy(contacts,['firstName', 'lastName']);
      setSortedcontacts (contacts);
    }, true);

    $scope.$watch('query', function(query) {
      if(query) {
        filterContacts ({name: query});
      } else {
        setSortedcontacts ($scope.contacts);
      }
    });

    function filterContacts (filter) {
      if (filter && filter.name) {
        var pattern = new RegExp(filter.name, 'i');
      } else {
        var pattern = /\.*/
      }
      var contacts =  _.filter($scope.contacts, function(contact) {
       if((pattern.test(contact.firstName) || pattern.test(contact.lastName)) &&
         (filter.group ? contact.group === filter.group : true)) {
        return true;
       }
       return false;
    });
      setSortedcontacts (contacts);
    }
    function setSortedcontacts(contacts) {
      $scope.sortedcontacts = _.groupBy(contacts, function(item) {return item.firstName[0]; });
    }
    function openModalAddNewContact() {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/main/modals/new.contact.html',
        controller: 'NewContactController',
        resolve: {
          selectedContact: function () {
            return undefined;
          }
        }
      });

      modalInstance.result.then(function (contact) {
          addNewContact(contact);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

    function openModalEditContact() {

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

    function openModalAdvanceFilter() {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/main/modals/advance.filter.html',
        controller: 'AdvanceFilterController'
      });

      modalInstance.result.then(function (filter) {
        filterContacts(filter);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

      ////////////////
    function activate() {
      $http.get('/api/contacts').success(function(contacts) {
        $scope.contacts = contacts;
        socket.syncUpdates('contacts', $scope.contacts);
      });
    }
  }

})();


