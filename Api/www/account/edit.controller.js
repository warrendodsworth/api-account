(function () {
  'use strict';

  angular
    .module('app')
    .controller('EditController', ['$scope', '$location', 'AccountService', 'NotifyService', EditController]);

  function EditController($scope, $location, AccountService, NotifyService) {
    var vm = $scope;
    vm.title = '';

    AccountService.getCurrentUser().then(function (res) {
      vm.user = res.data;
    });

    vm.save = function (model) {
      AccountService.putCurrentUser(model).then(function (res) {
        NotifyService.success('Saved');
        $location.path('/manage');
      });
    };

    // upload later on form submit or something similar
    vm.submit = function () {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
      Upload.upload({
        url: 'api/photos',
        data: { file: file, 'username': $scope.username }
      }).then(function (res) {
        NotifyService.success('Success ' + resp.config.data.file.name + 'uploaded');
        console.log(res.data);
      }, function (res) {
        console.log(res);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        NotifyService.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    //$scope.uploadFiles = function (files) {
    //  Upload.upload({url:'', data: {file: files});
    //}
  }
})();