'use strict';

/**
 * @ngdoc function
 * @name angularBootstrapCalendarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularBootstrapCalendarApp
 */
angular.module('bs.calendar')
  .controller('MainCtrl', function ($scope, $modal, moment, CalendarService) {

    var currentYear = moment().year();
    var currentMonth = moment().month();
    $scope.getGcalEvents = CalendarService.getGcalEvents;
    $scope.transformRes = CalendarService.transformRes;

    $scope.init = function () {
      var req1Params = {
        cal: 'h27jit74b8la1oj47538np3mvg',
        q : {
          singleEvents: true
        }
      };
      var req2Params = {
        cal: 'h27jit74b8la1oj47538np3mvg',
        q : {
          singleEvents: false
        }
      }

      $scope.events = $scope.getGcalEvents(req1Params).then(
          // success
          function (data) {
            $scope.events = $scope.transformRes(data)
          },
          // error
          function (data) {
          }
        )
        .then(
          function (data) {
            $scope.getGcalEvents(req2Params).then(
              // success
              function (data) {
                $scope.events = $scope.events.concat( $scope.transformRes(data) );
              },
              // error
              function (data) {
                console.log('error')
              }
            )
          }
        )
    }

    $scope.init();
    $scope.events = [];

    $scope.calendarView = 'month';
    $scope.calendarDay = new moment();

    function showModal(action, event) {
      $modal.open({
        templateUrl: 'modalContent.html',
        controller: function($scope, $modalInstance) {
          $scope.$modalInstance = $modalInstance;
          $scope.action = action;
          $scope.event = event;
        }
      });
    }

    $scope.eventClicked = function(event) {
      showModal('Clicked', event);
    };

    $scope.eventEdited = function(event) {
      showModal('Edited', event);
    };

    $scope.eventDeleted = function(event) {
      showModal('Deleted', event);
    };

    $scope.setCalendarToToday = function() {
      $scope.calendarDay = new Date();
    };

    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();

      event[field] = !event[field];
    };
  })
  .factory('CalendarService', function ($http, $filter) {
    var calendarService = {};

    calendarService.getGcalEvents = function (params) {
      return $http({
          url: 'https://www.googleapis.com/calendar/v3/calendars/'+params.cal+'@group.calendar.google.com/events',
          method: "GET",
          params: {
              singleEvents: params.q.singleEvents,
              showHiddenInvitations: true,
              key: 'AIzaSyB8ijjKige6h_zN38bbsYBCOaC1m4v9IO0',
              timeMin: moment().subtract('month', 1).toISOString()
            }
        })
        .then(
          function (res) {
            return res.data;
          },
          function (res) {
            return res.data;
          }
        );
    };

    calendarService.transformRes = function (data) {
      data.items = $filter('filter')(data.items, function (item) {
        return item.status !== 'cancelled';
      });

      return data.items.map( function(item) {
        var newItem = {};
        if ( ! item.hasOwnProperty('start') ) {
          return;
        }
        if ( item.start.hasOwnProperty('date') ) {
          newItem.allday = true;
          // is all day event
        }
        newItem.title = item.summary;
        newItem.type = item.organizer.displayName;
        newItem.starts_at = ( item.start.hasOwnProperty('date') ) ? moment(item.start.date)._d : moment(item.start.dateTime)._d;
        newItem.ends_at = ( item.start.hasOwnProperty('date') ) ? moment(item.end.date)._d : moment(item.start.dateTime)._d;

        return newItem;
      });
    }

    return calendarService;
  });
