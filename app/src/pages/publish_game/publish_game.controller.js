(function(){

  angular
       .module('msp.pages.publish_game')
       .controller('msp.pages.publish_game.main', [
          '$q',
          '$routeParams',
          '$location',
          '$mdToast',
          'msp.users.services',
          publishGameController
       ]);

  function publishGameController($q, $routeParams, $location, $mdToast, userServices) {
    var self = this;
    
    /**
     * Activate the menu
     * @type {String}
     */
    self.pageType = 'publish_game';
    self.submit = submitGame;

    userServices
      .loadUser({username: 'me'})
      .then(function(user) {
        if (user) {
          self.activeUser = user;
        } else {
          $location.url('/'); //go to feed
        }
      });

    function submitGame() {
      var post = {
        user: self.activeUser,
        content: self.project,
        type: 1
      };

      userServices.publishGame(post)
        .then(function(post) {
          $mdToast.showSimple(post.content.name + ' published');
          $location.url('/'); //go to feed
        });
    }
  }
})();
