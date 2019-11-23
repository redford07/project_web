var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var connection = mysql.init();
mysql.open(connection);




/* GET home page. */
router.get('/', function(req, res, next) {


      var sql = 'SELECT * FROM member'; // 클럽목록

		connection.query(sql, function(err, results, field){
      console.log(results);
      res.render('index', {page:'Home', menuId:'home',memberlist : results,data : 'testData list ejs'});
		});


});

router.get('/about', function(req, res, next) {
  res.render('about', {page:'About Us', menuId:'about'});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {page:'Contact Us', menuId:'contact'});
});
router.get('/signup', function(req, res, next) {
  res.render('signup', {page:'signup ', menuId:'signup'});
});

module.exports = router;
