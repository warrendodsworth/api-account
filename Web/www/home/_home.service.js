﻿(function () {
  'use strict';

  angular
    .module('app')
    .factory('home', ['$http', '$q', '_cache', '_qs', homeService]);

  function homeService($http, $q, _cache, _qs) {
    var service = {};

    service.getPosts = function (filters) {
      return _cache.get('/api/posts' + _qs.toQs(filters));
    };

    return service;
  }
})();



