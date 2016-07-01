(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('notes.IndexController', notesController);

  notesController.$inject = ['$scope', '$http', '$location', 'NotifyService', 'QsService', 'noteService'];

  function notesController($scope, $http, $location, NotifyService, qs, noteService) {
    var vm = $scope;
    vm.filters = qs.toFilters();
    vm.$watch('filters', function (val) {
      qs.toQs(vm.filters);
    }, true);
    vm.pageChanged = function () {
      noteService.getNotes(vm.filters).then(function (res) {
        vm.notes = res.data.items;
        vm.total = res.data.total;
      });
    };
    vm.pageChanged();
    vm.create = function (model) {
      noteService.postNote(model).then(function (res) {
        NotifyService.success('Note Created');
        vm.filters.action = 'list';
      });
    };
    vm.delete = function (note, index) {
      noteService.deleteNote(note.id).then(function (res) {
        vm.notes.splice(index, 1);
        NotifyService.success('Deleted');
      });
    };
  }
}());