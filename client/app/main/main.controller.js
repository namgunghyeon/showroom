'use strict';

angular.module('showroomApp')
  .controller('MainCtrl', function ($scope, $http, $interval, $timeout, $log) {

    function getTick(from, to, count) {
      return (to - from) / count;
    }
    function getRandomTick(from, to, count, response) {
      var sigma = Math.abs(from-to)*0.1 + 700, time, time;
          time = (new Date(response[0].date).getMinutes() % 10 ) * 10  ;
      if (time == 0) {
          time = 100
      }
      return (from + (to - from)) / (900 * (time)) + sigma * rnd_snd();
    }
    function rnd_snd() {
      return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
    }

    function toWatt(milliWatt) {
      return parseInt(milliWatt / 1000, 10);
    }

    $scope.bgList = [
      {
        src: '../assets/images/bg_1.png'
      },
      {
        src: '../assets/images/bg_2.png'
      },
      {
        src: '../assets/images/bg_3.png'
      }
    ];

    $scope.bgIndex = 0;

    $interval(function () {
      $scope.bgIndex = ($scope.bgIndex + 1) % 3;
    }, 5000);

    $scope.usage = {
      before: 0,
      after: 0,
      current: 0
    };

    $scope.point_type = {
      biz: 0,
      home: 0,
      total: 0
    };
    $scope.point = [];

    $scope.getTotalUSage = function () {

      $http({
        method: 'GET',
        url   : '/api/total/usage'
      }).success(function (response) {
        $log.info('info: ', response);

        var tick,
            count;
        $scope.usage.before = toWatt(response[2].total) * 4;
        $scope.usage.after = toWatt(response[1].total) *4;

        if ($scope.usage.current === 0) {
            count = 30;
            tick = getTick($scope.usage.current, $scope.usage.before, count);
          } else {
            count = 9000;
            tick = getTick($scope.usage.before, $scope.usage.after, count);
        }

        var i = $interval(function () {
          $scope.usage.current += tick;
        }, 100, count);

      }).error(function (response) {
        $log.error('error: ', response);
      });

    };

    $scope.getRandTick = function () {

      $http({
        method: 'GET',
        url   : '/api/total/usage'
      }).success(function (response) {
        $log.info('info: ', response);

        var tick,
            count;

        var i = $interval(function () {
          $scope.usage.before = toWatt(response[2].total) * 4;
          $scope.usage.after = toWatt(response[1].total) * 4;

          if ($scope.usage.current === 0) {
              count = 30;
              tick = getRandomTick($scope.usage.current, $scope.usage.before, count, response);
            } else {
              count = 9000;
              tick = getRandomTick($scope.usage.before, $scope.usage.after, count, response);
          }
          $scope.point.push({
            data: tick,
            time: Date.now()
          });
          $scope.usage.current += tick;

        }, 1000, count);

      }).error(function (response) {
        $log.error('error: ', response);
      });
    };

    $scope.getTotalPoint = function () {
      $http({
        method: 'GET',
        url   : '/api/total/point'
      }).success(function (response) {
        $log.info('info: ', response);

        var count = 30,
            tickBiz = getTick($scope.point_type.biz, response.biz, count),
            tickHome = getTick($scope.point_type.home, response.home, count),
            tickTotal = getTick($scope.point_type.total, response.total, count);

        $interval(function () {
          $scope.point_type.biz += tickBiz;
          $scope.point_type.home += tickHome;
          $scope.point_type.total += tickTotal;
        }, 100, count);

        $timeout(function () {
          $scope.getTotalPoint();
        }, 24 * 3600 * 1000)

      }).error(function (response) {
        $log.error('error: ', response);
      });

    };
    $scope.getTotalPoint();
    $scope.getTotalUSage();
    $scope.getRandTick();
  });
