"use strict";
var hdb = require('../hdb/hdb');
var express = require('express');
function HdbRouter() {
    var router = express.Router();
    router.param('key', function (request, response, next, key) {
        request.params.key = hdb.validateKey(key);
        next();
    });
    return router;
}
module.exports = HdbRouter;
//# sourceMappingURL=HdbRouter.js.map