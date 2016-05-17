/// <reference path="../typings/tsd.d.ts"/>
import {Request, Response} from 'express';
var hdb = require('../hdb/hdb');
var router = hdb.Router();

router.route('/key/:key')
	.get((request: Request, response: Response) => {
		try {
			var value: String = hdb.get(request.params.key);
			console.log(`Value gotten from hdb.get(${request.params.key}: ${value})`);
			response.send(value);
		} catch(e) {
			console.error(`Getting key '${request.params.key}' failed with error: ${e}`);
			response.sendStatus(404);
			response.end();
		}
	})
	.put((request: Request, response: Response) => {
		var value = request.body;
		var success: Boolean = hdb.set(request.params.key, value.value);
		response.send(success ?"1" :"0");
	})
	.post((request: Request, response: Response) => {
		var value: String = request.body;
		var newObjectId: Number = hdb.insert(request.params.key, value);
		response.send(newObjectId);
	})
	.delete((request: Request, response: Response) => {
		var success: Boolean = hdb.delete(request.params.key);
		response.send(success ?"1" :"0");
	});

module.exports = router;
