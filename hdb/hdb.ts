/// <reference path="../typings/tsd.d.ts"/>
import {Request, Response} from "express";
const fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');

class Hdb {
	private dataDirectory: String;
	private valueFilename: String;
	private request = {};
	constructor() {
		//this.dataDirectory = process.env["HOME"] + "/hdb-data";
		this.dataDirectory = process.cwd() + "/hdb-data";
		this.valueFilename = '.value';

		/**
		 * Check that we have sufficient permissions to the data directory.
		 */
		try {
			fs.accessSync(this.dataDirectory, fs.R_OK | fs.W_OK | fs.X_OK);
		} catch (e) {
			fs.mkdirSync(this.dataDirectory);
		}
	}

	get(key: String) : String {
		var value: String;

		value = this.getKeyValue(key);

		console.log(`Ret from hdb.get: ${value}`);
		return value;
	}

	set(key: String, value) : Boolean {
		return this.setKeyValue(key, value);
	}

	keyExists(key: String) : Boolean {
		var realKeyPath: String = this.getRealPathFromKey(key);
		try {
			fs.accessSync(realKeyPath);
			return true;
		} catch(e) {
			return false;
		}
	}

	getRealPathFromKey(key: String) {
		return `${this.dataDirectory}/${key}`;
	}

	getKeyValue(key: String): String {
		if (!this.keyExists(key)) {
			throw new Error("Tried to get a non-existant key");
		}

		var realKeyPath: String = this.getRealPathFromKey(key);
		var keyValueFilePath: String = `${realKeyPath}/${this.valueFilename}`;

		var value: String = fs.readFileSync(keyValueFilePath, {
			encoding: "utf8"
		});

		return value;
	}

	setKeyValue(key: String, value) {
		var realKeyPath: String = this.getRealPathFromKey(key);
		var keyValueFilePath: String = `${realKeyPath}/${this.valueFilename}`;

		try {
			fs.writeFileSync(keyValueFilePath, value);
			return true;
		} catch(e) {
			return false;
		}
	}

	static validateKey(key: String) : String {
		if(key.indexOf("..") != -1){
			throw new Error("Invalid key");
		} else {
			key = key.replace("//+", "/");
		}
		return key;
	}

	Router() : Object {
		var router = express.Router({
			caseSensitive: true
		});

		//router.use(bodyParser.urlencoded({extended: true}));

		router.use((request: Request, response: Response, next: Function) => {
			console.log(`hdb ${request.method} ${request.path}`);
			next();
		});
	
		/**
		 * Guarantee routes with a :key match to get a valid route in req.params.key.
		 */
		router.param('key', (request: Request, response: Response, next: Function, key: String) => {
			console.log(`Validating :key (${key})`);
			try {
				request.params.key = Hdb.validateKey(key);
				next();
			} catch(e) {
				response.sendStatus(400);
				response.end();
			}
		});

		return router;
	}
}

module.exports = new Hdb();
