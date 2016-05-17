"use strict";
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var Hdb = (function () {
    function Hdb() {
        this.request = {};
        this.dataDirectory = process.cwd() + "/hdb-data";
        this.valueFilename = '.value';
        try {
            fs.accessSync(this.dataDirectory, fs.R_OK | fs.W_OK | fs.X_OK);
        }
        catch (e) {
            fs.mkdirSync(this.dataDirectory);
        }
    }
    Hdb.prototype.get = function (key) {
        var value;
        value = this.getKeyValue(key);
        console.log("Ret from hdb.get: " + value);
        return value;
    };
    Hdb.prototype.set = function (key, value) {
        return this.setKeyValue(key, value);
    };
    Hdb.prototype.keyExists = function (key) {
        var realKeyPath = this.getRealPathFromKey(key);
        try {
            fs.accessSync(realKeyPath);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Hdb.prototype.getRealPathFromKey = function (key) {
        return this.dataDirectory + "/" + key;
    };
    Hdb.prototype.getKeyValue = function (key) {
        if (!this.keyExists(key)) {
            throw new Error("Tried to get a non-existant key");
        }
        var realKeyPath = this.getRealPathFromKey(key);
        var keyValueFilePath = realKeyPath + "/" + this.valueFilename;
        var value = fs.readFileSync(keyValueFilePath, {
            encoding: "utf8"
        });
        return value;
    };
    Hdb.prototype.setKeyValue = function (key, value) {
        var realKeyPath = this.getRealPathFromKey(key);
        var keyValueFilePath = realKeyPath + "/" + this.valueFilename;
        try {
            fs.writeFileSync(keyValueFilePath, value);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Hdb.validateKey = function (key) {
        if (key.indexOf("..") != -1) {
            throw new Error("Invalid key");
        }
        else {
            key = key.replace("//+", "/");
        }
        return key;
    };
    Hdb.prototype.Router = function () {
        var router = express.Router({
            caseSensitive: true
        });
        router.use(function (request, response, next) {
            console.log("hdb " + request.method + " " + request.path);
            next();
        });
        router.param('key', function (request, response, next, key) {
            console.log("Validating :key (" + key + ")");
            try {
                request.params.key = Hdb.validateKey(key);
                next();
            }
            catch (e) {
                response.sendStatus(400);
                response.end();
            }
        });
        return router;
    };
    return Hdb;
}());
module.exports = new Hdb();
//# sourceMappingURL=hdb.js.map