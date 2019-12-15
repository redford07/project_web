var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var connection = mysql.init();
mysql.open(connection);
