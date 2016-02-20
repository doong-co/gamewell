(function(){

  angular
       .module('msp.pages.publish_game')
       .controller('msp.pages.publish_game.main', [
          '$q',
          '$routeParams',
          '$location',
          'msp.users.services',
          publishGameController
       ]);

  function publishGameController($q, $routeParams, $location, userServices) {
    var self = this;
    
    /**
     * Activate the menu
     * @type {String}
     */
    self.pageType = 'publish_game';

    userServices
      .loadUser({username: 'me'})
      .then(function(user) {
        if (user) {
          self.activeUser = user;
        } else {
          $location.url('/'); //go to feed
        }
      });
  }
})();
