/* global angular,ionic */
/**
 * @ngdoc service
 * @name $ionicContentBanner
 * @module ionic
 * @description The Content Banner is an animated banner that will show specific information to a user.
 */
(function (angular, ionic) {
  'use strict';

  angular.module('jett.ionic.content.banner')
    .factory('$ionicContentBanner', [
      '$document',
      '$rootScope',
      '$compile',
      '$timeout',
      '$ionicPlatform',
      function ($document, $rootScope, $compile, $timeout, $ionicPlatform) {

        /**
         * @ngdoc method
         * @name $ionicContentBanner#show
         * @description
         * Load and show a new content banner.
         */
        function contentBanner (opts) {
          var scope = $rootScope.$new(true);

          angular.extend(scope, {
            icon: 'ion-ios-close-empty',
            transition: 'vertical',
            interval: 7000,
            type: 'info',
            $deregisterBackButton: angular.noop,
            closeOnStateChange: true
          }, opts);

          // Compile the template
          var classes = 'content-banner ' + scope.type + ' content-banner-transition-' + scope.transition;
          var element = scope.element = $compile('<ion-content-banner class="' + classes + '"></ion-content-banner>')(scope);
          var body = $document[0].body;

          var stateChangeListenDone = scope.closeOnStateChange ?
            $rootScope.$on('$stateChangeSuccess', function() { scope.close(); }) :
            angular.noop;

          scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
            function() {
              $timeout(scope.close);
            }, 300
          );

          scope.close = function() {
            if (scope.removed) {
              return;
            }
            scope.removed = true;

            ionic.requestAnimationFrame(function () {
              element.removeClass('content-banner-in');

              $timeout(function () {
                scope.$destroy();
                element.remove();
                body = stateChangeListenDone = null;
              }, 400);
            });

            scope.$deregisterBackButton();
            stateChangeListenDone();
          };

          scope.show = function() {
            if (scope.removed) {
              return;
            }

            body.querySelector('ion-view[nav-view="active"] .scroll-content').appendChild(element[0]);

            ionic.requestAnimationFrame(function () {
              $timeout(function () {
                element.addClass('content-banner-in');
              }, 20, false);
            });
          };

          //set small timeout to let ionic set the active/cached view
          $timeout(function () {
            scope.show();
          }, 10, false);

          // Expose the scope on $ionContentBanner's return value for the sake of testing it.
          scope.close.$scope = scope;

          return scope.close;
        }

        return {
          show: contentBanner
        };
      }]);


})(angular, ionic);
