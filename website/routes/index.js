var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var signChk = require('../api/handler/signupChk')();
var connection = mysql.init();

mysql.open(connection);

/* GET home page. */
router.get('/', function(req, res, next) {


  var sql = 'SELECT * FROM member'; // 클럽목록

  connection.query(sql, function(err, results, field) {
    console.log(results);
    res.render('index', {
      page: 'Home',
      menuId: 'home',
      memberlist: results,
      data: 'testData list ejs',
      ss_email: req.session.email
    });
  });
});


router.post('/signupComplete', function(req, res, next) {

  var name = req.param('name');
  var email = req.param('email');
  var password = req.param('password');

  var sql = 'INSERT INTO member (name, email, password) VALUES(?, ?, ?)';
  var params = [name, email, password];
  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.render('signupComplete', {
        page: '회원가입 실패',
        menuId: 'signupComplete',
        email: '중복된 이메일입니다.',
        status: 0,
        ss_email: req.session.email

      });
    } else {
      console.log(rows);
      res.render('signupComplete', {
        page: '회원가입 완료',
        menuId: 'signupComplete',
        email: email + '로 회원가입이 완료되었습니다.',
        status: 1,
        ss_email: req.session.email
      });
    }
  });

});


router.post('/loginComplete', function(req, res, next) {

  var email = req.param('email');
  var password = req.param('password');

  var sql = 'select * from member where email = ? and password = ?';

  var params = [email, password];
  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    } else {
      console.log(rows);
      if (rows[0] != undefined) {
        req.session.email = email;
        res.render('loginComplete', {
          page: '로그인 완료',
          menuId: 'loginComplete',
          status: 1,
          ss_email: req.session.email
        });
      } else {
        res.render('loginComplete', {
          page: '로그인 실패',
          menuId: 'loginComplete',
          status: 0,
          ss_email: req.session.email
        });
      }

    }
  });

});

router.get('/logout', function(req, res, next) {
if (!req.session.email) {
    req.session.destroy();
  res.render('loginComplete', {
    page: '로그아웃 실패',
    menuId: 'loginComplete',
    status: 3,
    ss_email: undefined
  });
}else{
      req.session.destroy();
    res.render('loginComplete', {
      page: '로그아웃 성공',
      menuId: 'loginComplete',
      status: 4,
      ss_email: undefined
    });
}
});

router.get('/about', function(req, res, next) {
  res.render('about', {
    page: 'About Us',
    menuId: 'about',
    ss_email: req.session.email
  });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {
    page: 'Contact Us',
    menuId: 'contact',
    ss_email: req.session.email
  });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', {
    page: 'signup ',
    menuId: 'signup',
    ss_email: req.session.email
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    page: 'login ',
    menuId: 'login',
    ss_email: req.session.email
  });

});


module.exports = router;
