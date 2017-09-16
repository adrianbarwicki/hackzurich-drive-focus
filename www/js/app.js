angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('driving', {
          templateUrl: 'templates/driving.html',
          url: '/driving',
          controller: 'AppCtrl'
      })
      .state('results', {
          url: '/results',
          templateUrl: 'templates/results.html',
          controller: 'ResultCtrl'
      })
  $urlRouterProvider.otherwise('/driving');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
