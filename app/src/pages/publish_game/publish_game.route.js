(function(){
  'use strict';

  angular.module('msp.pages.publish_game')
         .config(['$routeProvider', '$locationProvider', publishGameRoutes]);

  function publishGameRoutes($routeProvider, $locationProvider){
    $routeProvider
      .when('/publish_game', {
        templateUrl: 'src/pages/publish_game/publish_game.view.html',
        controller: 'msp.pages.publish_game.main',
        controllerAs: 'page'
      });
  }

})();