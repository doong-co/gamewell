(function(){
  'use strict';

  // The main app
  angular
      .module('msp.app', ['ngMaterial', 'ngAnimate', 'ngResource',
        'msp.core', 'msp.users', 'msp.posts', 'msp.pages.feed', 'msp.pages.timeline', 'msp.pages.publish_game'])
      .config(function($mdThemingProvider){
	      $mdThemingProvider.theme('default')
	          .primaryPalette('teal')
	          .accentPalette('red');
      })
      .value('API_URL', 'http://localhost:1337');


})();
