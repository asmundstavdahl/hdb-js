/// <reference path="../typings/tsd.d.ts"/>
import {Request, Response} from "express";
var hdb = require('../hdb/hdb');
var apiRouter = require('./ApiRouter');
var router = hdb.Router();

router.use('/api', apiRouter);

module.exports = router;
