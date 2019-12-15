var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var connection = mysql.init();
mysql.open(connection);


var sql = 'SELECT * FROM member'; // 클럽목록

connection.query(sql, function(err, results, field){
console.log(results);
res.render('index', {page:'Home', menuId:'home',memberlist : results,data : 'testData list ejs'});
});
