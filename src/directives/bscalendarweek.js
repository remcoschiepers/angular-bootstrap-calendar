'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:bsCalendarWeek
 * @description
 * # bsCalendarWeek
 */
angular.module('bs.calendar')
  .directive('bsCalendarWeek', function(moment, calendarHelper) {
    return {
      templateUrl: 'templates/week.html',
      restrict: 'EA',
      require: '^bsCalendar',
      scope: {
        events: '=calendarEvents',
        currentDay: '=calendarCurrentDay',
        eventClick: '=calendarEventClick',
        useIsoWeek: '=calendarUseIsoWeek'
      },
      link: function postLink(scope, element, attrs, calendarCtrl) {

        calendarCtrl.titleFunctions.week = function(currentDay) {
          return 'Week ' + moment(currentDay).week() + ' of ' + moment(currentDay).format('YYYY');
        };

        function updateView() {
          scope.view = calendarHelper.getWeekView(scope.events, scope.currentDay, scope.useIsoWeek);
        }

        scope.drillDown = function(day) {
          calendarCtrl.changeView('day', moment(scope.currentDay).clone().date(day).toDate());
        };

        scope.$watch('currentDay', updateView);
        scope.$watch('events', updateView, true);

      }
    };
  });
