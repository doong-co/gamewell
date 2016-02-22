(function(){
  'use strict';

  angular.module('msp.core')
    .directive('mspCoreMenu', [
      '$route',
      '$rootScope',
      'msp.core.menuService',
      mspCoreMenu
    ])
    .directive('mspToggleMenu', [
      '$mdBottomSheet',
      '$mdSidenav',
      mspToggleMenu
    ]);

    function mspCoreMenu($route, $rootScope, menuService) {

      var spinner = new Spinner({
          lines: 9 // The number of lines to draw
        , length: 0 // The length of each line
        , width: 7 // The line thickness
        , radius: 27 // The radius of the inner circle
        , scale: 1.25 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#fff' // #rgb or #rrggbb or array of colors
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

      return {
        templateUrl: viewTemplate,
        restrict: 'E',
        scope: true,
        link: init
      };

      function init(scope, element, attrs) {
        menuService
          .loadMenu()
          .then(function(menuItems) {
            scope.menuItems = menuItems;
          });

        
    
        // spinner.spin($('form[name="projectForm"]')[0]); 
        $rootScope.$on('$routeChangeStart', function(e, data) {
          spinner.spin($('md-toolbar')[0]);
        });
        $rootScope.$on('$routeChangeSuccess', function(e, data) {
          _.map(scope.menuItems, function(menuItem) {
            menuItem.active = (data.scope.page.pageType === menuItem.pageType);
          })
          spinner.stop();
        });

        window.kdqMenuInit = true;

      }

      function viewTemplate() {
        return 'src/core/components/menu/menu.view.html';
      }
    }

    function mspToggleMenu($mdBottomSheet, $mdSidenav) {
      return {
        restrict: 'A',
        scope: true,
        link: init
      };

      function init(scope, element, attrs) {
        scope.toggleView = toggleView;
      }

      function toggleView() {
        $mdSidenav('left').toggle();
      }
    }

})();
