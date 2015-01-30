'use strict';

angular.module('showroomApp')
    .directive('realtimeChart', function ($q, $interval, $rootScope, $log) {
        return {
            templateUrl: 'app/main/realtime-chart/realtime.html',
            restrict: 'EA',
            scope: {
                point: '='
            },
            link: function (scope, element) {

                scope.renderChart = function (data) {

                    var target = element.find('#realtime-moment-chart'),
                        parent = target.parent();
                    $log.info('target: ', target);
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });
                    target.highcharts({
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 10,
                            backgroundColor: null,
                            height: 250,
                            events: {
                                load: function () {

                                    var series = this.series[0];
                                    scope.$watch('point', function (newVal, oldVal) {
                                        if (!newVal) {
                                            return;
                                        }
                                        var newData = newVal.pop(),
                                            markerNum = parent.width() < 400 ? 12 : 15,
                                            needShift = series.data.length === markerNum ? true : false;
                                        try {
                                            series.addPoint([
                                                newData.time,
                                                newData.data
                                            ], true, needShift);
                                        } catch (exception) {}
                                    }, true);
                                }
                            }
                        },
                        plotOptions: {
                            spline: {
                                color: '#ffffff',
                                lineWidth: 2,
                                marker: {
                                    fillColor: '#ffffff',
                                    lineColor: '#ffffff',
                                    lineWidth: 3,
                                    radius: 5
                                }
                            }
                        },
                        title: {
                            margin: 0,
                            text: '.',
                            style: {
                                color: '#fff',
                                fontSize: '10px'
                            }
                        },
                        xAxis: {
                            labels: {
                                style: {
                                    'color': '#ffffff',
                                    'fontSize': '0.85em'
                                }
                            },

                            lineColor: '#ffffff',
                            lineWidth: 2,
                            type: 'datetime',
                            tickPixelInterval: 69,
                            units: [
                                [
                                    'second',
                                    [1, 10]
                                ]
                            ]
                        },
                        yAxis: {
                            title: {
                                text: null,
                            },
                            labels: {
                                enabled: false
                            },
                            gridLineWidth: 0,
                            minorGridLineWidth: 0
                        },
                        tooltip: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            data: data
                        }]
                    });
                };

                scope.renderChart();

            }
        };
    });
