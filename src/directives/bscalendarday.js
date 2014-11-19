'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:bsCalendarDay
 * @description
 * # bsCalendarDay
 */
angular.module('bs.calendar')
  .directive('bsCalendarDay', function(calendarHelper) {
    return {
      templateUrl: 'templates/day.html',
      restrict: 'EA',
      require: '^bsCalendar',
      scope: {
        events: '=calendarEvents',
        currentDay: '=calendarCurrentDay',
        eventClick: '=calendarEventClick'
      },
      link: function postLink(scope, element, attrs, calendarCtrl) {

        calendarCtrl.titleFunctions.day = function(currentDay) {
          return moment(currentDay).format('dddd DD MMMM, YYYY');
        };

        function updateView() {
          scope.view = calendarHelper.getDayView(scope.events, scope.currentDay);
        }

        scope.$watch('currentDay', updateView);
        scope.$watch('events', updateView, true);

      }
    };
  });
