"use strict";
var hdb = require('../hdb/hdb');
var router = hdb.Router();
router.route('/key/:key')
    .get(function (request, response) {
    try {
        var value = hdb.get(request.params.key);
        console.log("Value gotten from hdb.get(" + request.params.key + ": " + value + ")");
        response.send(value);
    }
    catch (e) {
        console.error("Getting key '" + request.params.key + "' failed with error: " + e);
        response.sendStatus(404);
        response.end();
    }
})
    .put(function (request, response) {
    var value = request.body;
    var success = hdb.set(request.params.key, value.value);
    response.send(success ? "1" : "0");
})
    .post(function (request, response) {
    var value = request.body;
    var newObjectId = hdb.insert(request.params.key, value);
    response.send(newObjectId);
})
    .delete(function (request, response) {
    var success = hdb.delete(request.params.key);
    response.send(success ? "1" : "0");
});
module.exports = router;
//# sourceMappingURL=ApiRouter.js.map