﻿(function () {
  'use strict';

  angular
      .module('ctrls')
      .controller('RegisterCtrl', ['$scope', '$location', '$timeout', 'AccountService', function ($scope, $location, $timeout, AccountService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
          userName: "",
          password: "",
          confirmPassword: ""
        };

        $scope.signUp = function (model) {

          AccountService.register(model).then(function (res) {

            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully,  you will be redicted to login page in 2 seconds.";
            startTimer();
          },
           function (res) {
             var errors = [];
             for (var key in res.data.modelState) {
               for (var i = 0; i < res.data.modelState[key].length; i++) {
                 errors.push(res.data.modelState[key][i]);
               }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
           });
        };

        var startTimer = function () {
          var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
          }, 2000);
        }

      }]);
})();
