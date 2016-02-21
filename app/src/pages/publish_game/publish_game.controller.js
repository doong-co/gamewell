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

      var spinner;

    function submitGame() {
      if(!self.thumbnailFile[0]) {
        alert('A teaser image is required.')
       
        return;
      }
      if(self.thumbnailFile[0].lfFile.size > 10000000) {
          alert('Your image should be smaller than 10Mb');
          return;
        } 

      if(self.canUploadGame) {
        if(self.gameFile[0]) {
           spinner = spinner || new Spinner({
            lines: 9 // The number of lines to draw
          , length: 0 // The length of each line
          , width: 7 // The line thickness
          , radius: 27 // The radius of the inner circle
          , scale: 1.25 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , color: '#000' // #rgb or #rrggbb or array of colors
          , opacity: 0.25 // Opacity of the lines
          , rotate: 71 // The rotation offset
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 1.4 // Rounds per second
          , trail: 28 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , zIndex: 2e9 // The z-index (defaults to 2000000000)
          , className: 'spinner' // The CSS class to assign to the spinner
          , top: '50%' // Top position relative to parent
          , left: '50%' // Left position relative to parent
          , shadow: false // Whether to render a shadow
          , hwaccel: false // Whether to use hardware acceleration
          , position: 'absolute' // Element positioning
          });
      
          spinner.spin($('form[name="projectForm"]')[0]);

          userServices.uploadGame(self.gameFile[0].lfFile)
          .then(function(gameUrl) {
            self.project.url = gameUrl;
            publishGame();
          });
        }
        else {
          alert('A compressed game folder is required')
        }
        
      } else {
        publishGame();
      }
      
    }

    function publishGame() {

      var post = {
        user: self.activeUser,
        content: self.project,
        type: 1
      };

      if(self.thumbnailFile) {
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
          post.content.thumbnail = reader.result;
          userServices.publishGame(post)
            .then(function(post) {
              $mdToast.showSimple(post.content.name + ' published');
              $location.url('/'); //go to feed
              spinner && spinner.stop();
            });
        }, false);
        if(self.thumbnailFile[0]) {
          if(self.thumbnailFile[0].lfFile.size > 10000000) {
            alert('Your image should be smaller than 10Mb');
          }
          else {
            reader.readAsDataURL(self.thumbnailFile[0].lfFile);    
          }
          
        }
        else {
          alert('A teaser image is required.');
        }
        
      } else {
        userServices.publishGame(post)
          .then(function(post) {
            $mdToast.showSimple(post.content.name + ' published');
            $location.url('/'); //go to feed
            spinner && spinner.stop();
          });
      }
    }
  }
})();
