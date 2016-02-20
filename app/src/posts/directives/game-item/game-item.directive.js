(function(){
  'use strict';

  angular.module('msp.posts')
    .directive('kdqGameItem', [
      '$timeout',
      '$sce',
      function($timeout, $sce) {
          return {
            templateUrl: viewTemplate,
            restrict: 'E',
            scope: {
              game: '=kdqGame'
            },
            replace: true,
            link: init
          };

          function init(scope, element, attrs) {
            scope.canPlayGame = false;
            scope.trustUrl = trustUrl;

            var timeoutId = undefined;

            $(window).scroll(function() {
              $timeout.cancel(timeoutId);

              var pos = element.offset();
              var scrollTop = $(window).scrollTop();
              var windowHeight = $(window).height();
              var elementHeight = element.height();

              if(scrollTop < pos.top && scrollTop + windowHeight > pos.top + elementHeight) {
                timeoutId = $timeout(function() {
                  scope.canPlayGame = true;
                }, 250);
              } else {
                $timeout(function() {
                  scope.canPlayGame = false;
                });
              }
            });

            function trustUrl(url) {
              return $sce.trustAsResourceUrl(url);
            }
          }
        }
    ]);

  function viewTemplate() {
    return 'src/posts/directives/game-item/game-item.view.html';
  }

})();
