var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var connection = mysql.init();

mysql.open(connection);

/* GET home page. */
router.get('/', function(req, res, next) {


  var sql = 'SELECT * FROM newsinfo'; // 게시글목록
  var sql2 = 'SELECT count(*) FROM newsinfo as cnt'; // 게시글카운트

  connection.query(sql, function(err, results, field) {
    connection.query(sql2, function(err, cnt, field) {

      console.log(results);
      console.log(cnt);
      res.render('index', {
        page: '박제목록',
        menuId: 'home',
        list: results,
        cnt : cnt,
        data: 'testData list ejs',
        ss_email: req.session.email, ss_password : req.session.password

      });

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
        ss_email: req.session.email, ss_password : req.session.password

      });
    } else {
      console.log(rows);
      res.render('signupComplete', {
        page: '회원가입 완료',
        menuId: 'signupComplete',
        email: email + '로 회원가입이 완료되었습니다.',
        status: 1,
        ss_email: req.session.email, ss_password : req.session.password
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
        req.session.password = password;
        res.render('loginComplete', {
          page: '로그인 완료',
          menuId: 'loginComplete',
          status: 1,
          ss_email: req.session.email, ss_password : req.session.password
        });
      } else {
        res.render('loginComplete', {
          page: '로그인 실패',
          menuId: 'loginComplete',
          status: 0,
          ss_email: req.session.email, ss_password : req.session.password
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
    ss_email: undefined, ss_password: undefined
  });
}else{
      req.session.destroy();
    res.render('loginComplete', {
      page: '로그아웃 성공',
      menuId: 'loginComplete',
      status: 4,
      ss_email: undefined, ss_password: undefined
    });
}
});

router.get('/about', function(req, res, next) {
  res.render('about', {
    page: 'About Us',
    menuId: 'about',
    ss_email: req.session.email, ss_password : req.session.password
  });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {
    page: 'Contact Us',
    menuId: 'contact',
    ss_email: req.session.email, ss_password : req.session.password
  });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', {
    page: 'signup ',
    menuId: 'signup',
    ss_email: req.session.email, ss_password : req.session.password
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    page: 'login ',
    menuId: 'login',
    ss_email: req.session.email, ss_password : req.session.password
  });
});

router.get('/post', function(req, res, next) {
  res.render('post', {
    page: 'post ',
    menuId: 'post',
    ss_email: req.session.email, ss_password : req.session.password,
    status: -1
  });
});
router.get('/postDetail', function(req, res, next) {


  var sql = 'select * from newsinfo where _id = ?';
  var params = [req.param('v')];


  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    } else {
      console.log(rows);
        res.render('postDetail', {
          page: '디테일',
          menuId: 'postDetail',
          status: 1,
          ss_email: req.session.email, ss_password : req.session.password,
          list : rows
        });
    }
  });

});

router.post('/postChk', function(req, res, next) {
  var title = req.param('title');
  var link = req.param('link');
  var password = req.param('password');
  var company = req.param('company');
  var reporter = req.param('reporter');
  var content = req.param('content');
  var filelink = req.param('filelink');



  var sql = 'INSERT INTO newsinfo (reporter, company, new_title, link, content, password, writer ,filelink) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
  var params = [reporter, company, title,link,content,password,req.session.email,filelink];
  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      res.render('post', {
        page: 'post ',
        menuId: 'post',
        ss_email: req.session.email, ss_password : req.session.password,
        status: 5
      });
    }
  });
});


module.exports = router;
