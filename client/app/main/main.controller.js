'use strict';

angular.module('showroomApp')
  .controller('MainCtrl', function ($scope, $http, $interval, $timeout, $log) {

    function getTick(from, to, count) {
      return (to - from) / count;
    }

    function toKWh(milliWatt) {
      return parseInt(milliWatt / 1000000, 10);
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

    $scope.point = {
      biz: 0,
      home: 0,
      total: 0
    };

    $scope.getTotalUSage = function () {

      $http({
        method: 'GET',
        url   : '/api/total/usage'
      }).success(function (response) {
        $log.info('info: ', response);

        var tick,
            count;

        $scope.usage.before = toKWh(response[2].total * 4);
        $scope.usage.after = toKWh(response[1].total * 4);

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

        i.then(function () {
          $scope.getTotalUSage();
        });

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
            tickBiz = getTick($scope.point.biz, response.biz, count),
            tickHome = getTick($scope.point.home, response.home, count),
            tickTotal = getTick($scope.point.total, response.total, count);

        $interval(function () {
          $scope.point.biz += tickBiz;
          $scope.point.home += tickHome;
          $scope.point.total += tickTotal;
        }, 100, count);

        $timeout(function () {
          $scope.getTotalPoint();
        }, 24 * 3600 * 1000)

      }).error(function (response) {
        $log.error('error: ', response);
      });

    };

    $scope.getTotalUSage();
    $scope.getTotalPoint();


  });
