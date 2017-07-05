(function() {
  'use strict';

  angular
    .module('public')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controllerAs: 'MainController'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
