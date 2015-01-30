'use strict';

var _ = require('lodash');
var env = require('../../config/local.env');
var mysql = require('mysql');
var connection = mysql.createConnection(env.MYSQL);

// Get list of totals
exports.usage = function(req, res) {

  var sql = 'SELECT date, sum(meteringPeriodUsage) as total FROM production.ps_15min_device_usage ' +
            'GROUP BY date ORDER BY date DESC LIMIT 3';

  connection.query(sql, function (err, results) {

    if (err) {
      throw err;
    }

    res.json(results);

  });

};

exports.point = function (req, res) {

  var bizCount = 0,
      homeCount = 0,
      sql = 'SELECT A.feederId, A.meteringPeriodUsage, device.model ' +
            'FROM ps_daily_feeder_usage A ' +
            'JOIN feeder ' +
            'ON A.feederId = feeder.id ' +
            'JOIN device ' +
            'ON feeder.device_id = device.id ' +
            'WHERE A.meteringPeriodUsage > 0 ' +
            'GROUP BY A.feederId';

  connection.query(sql, function (err, results) {

    if (err) {
      throw err;
    }

    results.forEach(function (result) {

      if (result.model === 'EDM1' || result.model === 'EDM2') {
        bizCount += 1;
      } else if (result.model === 'EDM3') {
        homeCount += 1;
      }

    });

    res.json({
      'biz': bizCount,
      'home': homeCount,
      'total': bizCount + homeCount
    });

  });
};
