'use strict';

var express = require('express');
var controller = require('./total.controller');

var router = express.Router();

router.get('/usage', controller.usage);
router.get('/point', controller.point);

module.exports = router;
