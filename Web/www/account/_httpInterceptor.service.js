(function () {
  'use strict';

  angular.module('app').factory('_httpInterceptorService', httpInterceptorService);

  httpInterceptorService.$inject = ['$q', '$location', '$injector', '_notify', 'localStorageService'];

  function httpInterceptorService($q, $location, $injector, _notify, localStorageService) {
    var service = {};
    var $http, rootScope;

    service.request = function (config) {
      config.headers = config.headers || {};
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.access_token;
      }
      return config;
    };

    service.responseError = function (res) {
      if (res.status === 401) {
        var returnUrl = $location.path();
        $location.path('/login').search({ returnUrl: returnUrl });
      } else {
        // get $http via $injector because of circular dependency problem
        $http = $http || $injector.get('$http');
        // don't send notification until all requests are complete
        if ($http.pendingRequests.length < 1) {
          // get $rootScope via $injector because of circular dependency problem
          rootScope = rootScope || $injector.get('$rootScope');
          // send a notification with response errors
          //rootScope.$broadcast('responseError', res);
          _notify.handleErrors(res);
        }
      }
      //See more at: http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux/#sthash.QBl0n2Pf.dpuf
      return $q.reject(res);
    };

    return service;
  }
}());