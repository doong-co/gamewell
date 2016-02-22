(function(){
  'use strict';

  // The main app
  angular
      .module('msp.app', ['ngMaterial', 'lfNgMdFileInput', 'ngAnimate', 'ngResource',
        'msp.core', 'msp.users', 'msp.posts', 'msp.pages.feed', 'msp.pages.timeline', 'msp.pages.publish_game','sticky'])
      .config(function($mdThemingProvider){
	      $mdThemingProvider.theme('default')
	          .primaryPalette('teal')
	          .accentPalette('red');
      })
      .value('API_URL', window.location.protocol + '//' + window.location.hostname + ':1337')
      .run(function() {

        
        
      });


})();
