/**
 * Created by AncientMachine on 12.01.2016.
 */
'use strict';
var express = require('express');
var controller = require('./crawling.controller.js');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/', auth.isAuthenticated(),  controller.startCrawling);

module.exports = router;
