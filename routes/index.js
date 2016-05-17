"use strict";
var hdb = require('../hdb/hdb');
var apiRouter = require('./ApiRouter');
var router = hdb.Router();
router.use('/api', apiRouter);
module.exports = router;
//# sourceMappingURL=index.js.map