var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var fs = require('fs');
var mysql = require('../api/db/db_con')();
var connection = mysql.init();

mysql.open(connection);

// 메인화면
router.get('/', function(req, res, next) {


  var sql = 'SELECT * FROM newsinfo order by _id desc' ; // 게시글목록
  var sql2 = 'SELECT count(*) FROM newsinfo as cnt'; // 게시글카운트

  connection.query(sql, function(err, results, field) {
    connection.query(sql2, function(err, cnt, field) {

// 렌더링
      console.log(results);
      console.log(cnt);
      res.render('index', {
        page: '최신박제목록',
        menuId: 'home',
        list: results,
        cnt : cnt,
        data: 'testData list ejs',
        ss_email: req.session.email, ss_password : req.session.password
// 세션값 전달
      });

    });
  });

});

// 회원가입 완료페이지
router.post('/signupComplete', function(req, res, next) {

  var name = req.param('name');
  var email = req.param('email');
  var password = req.param('password');
// 파라메터 받아와서
  var sql = 'INSERT INTO member (name, email, password) VALUES(?, ?, ?)';
  var params = [name, email, password];
  connection.query(sql, params, function(err, rows, fields){
    if (err) {//유니크값 에러일경우 중복이메일
      res.render('signupComplete', {
        page: '회원가입 실패',
        menuId: 'signupComplete',
        email: '중복된 이메일입니다.',
        status: 0,
        ss_email: req.session.email, ss_password : req.session.password

      });
    } else { //아니면 저장
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
  // 입력한값을 토대로 쿼리실 실행

  var params = [email, password];
  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    } else {
      console.log(rows);
      if (rows[0] != undefined) { //값이 없으면 성공 및 세션처리  상태값을 1을 보내서 성공처리
        req.session.email = email;
        req.session.password = password;
        res.render('loginComplete', {
          page: '로그인 완료',
          menuId: 'loginComplete',
          status: 1,
          ss_email: req.session.email, ss_password : req.session.password
        });
      } else {
        res.render('loginComplete', { //값이 있으면 실패 , 상태값을 0을 보내서 실패처리
          page: '로그인 실패',
          menuId: 'loginComplete',
          status: 0,
          ss_email: req.session.email, ss_password : req.session.password
        });
      }

    }
  });

});

router.get('/logout', function(req, res, next) { //로그아웃 세션삭제
if (!req.session.email) {
    req.session.destroy();
  res.render('loginComplete', { //알수없는 에러처리
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

router.get('/rank', function(req, res, next) { //랭킹 시스템구현
  var sql = 'SELECT * FROM newsinfo order by good desc'; // 게시글목록
  var sql2 = 'SELECT count(*) FROM newsinfo as cnt'; // 게시글카운트

  connection.query(sql, function(err, results, field) {
    connection.query(sql2, function(err, cnt, field) {

      console.log(results);
      console.log(cnt);
      res.render('rank', {
        page: '명예의박제',
        menuId: '명예의박제',
        list: results,
        cnt : cnt,
        data: 'testData list ejs',
        ss_email: req.session.email, ss_password : req.session.password

      });

    });
  });
});
//라우터목록
router.get('/contact', function(req, res, next) { //라우터처
  res.render('contact', {
    page: '페이지소개',
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
router.get('/postDetail', function(req, res, next) { //아이디값을 가져와서 검색하여 출력


  var sql = 'select * from newsinfo where _id = ?';
  var params = [req.param('v')];

  var sql2 = 'update newsinfo set hit = hit + 1 where _id = ?'

  connection.query(sql2, params, function(err, rows, fields) { //눌렀을때 조회수 증가토록
    if (err) {
      console.log(err);

    }

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

});

router.get('/postBakze', function(req, res, next) { //박제버튼을 누르면 추천수가 증가한다.


  var sql = 'select * from newsinfo where _id = ?';
  var params = [req.param('v')];

  var sql2 = 'update newsinfo set good = good + 1 where _id = ?'

  connection.query(sql2, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    }

  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err); //에러처리

    } else {
      console.log(rows);
        res.render('postDetail', {
          page: '디테일',
          menuId: 'postDetail',
          status: 9, //상태값으로 현재 액션을 프론트에서 체크한다.
          ss_email: req.session.email, ss_password : req.session.password,
          list : rows
        });

    }
  });

  });

});


router.get('/postModify', function(req, res, next) { //수정페이지 진입, 원리는 자세히보기 페이지와 같다.


  var sql = 'select * from newsinfo where _id = ?';
  var params = [req.param('v')];


  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    } else {
      console.log(rows);
        res.render('postModify', {
          page: '수정',
          menuId: 'postModify',
          status: 1,
          ss_email: req.session.email, ss_password : req.session.password,
          list : rows
        });
    }
  });

});

router.post('/postUpdated', function(req, res, next) {  //업데이트 완료 체크 기능

  var title = req.param('title');
  var link = req.param('link');
  var password = req.param('password');
  var passwordCpm = req.param('passwordCpm');
  var company = req.param('company');
  var reporter = req.param('reporter');
  var content = req.param('content');
  var _id = req.param('_id');

// 모든 데이터를 가져와서
if (passwordCpm != password) { //비밀번호 체크를 해서 틀리면 뒤로가기
    res.end("<script>alert('comfirm password!!'); history.back();</script>")
    return;
}

  var sql = 'update newsinfo set new_title = ? , link = ? , company = ? , reporter = ? , content = ? where _id = ?';


  var params = [title,link,company,reporter,content,_id];
  connection.query(sql, params, function(err, rows, fields) { //비밀번호가 맞으면 업데이트 실행
    if (err) {
      console.log(err);

    } else {
      res.end("<script>alert('updated!'); history.back();</script>")
      console.log(rows);
    }
  });

});

router.get('/postDelete', function(req, res, next) { //삭제눌렀을때 삭제

var params = [req.param('v')];



  var sql = 'delete from newsinfo where _id = ?';

  connection.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.log(err);

    } else {

      var sql1 = 'SELECT * FROM newsinfo'; // 게시글목록
      var sql2 = 'SELECT count(*) FROM newsinfo as cnt'; // 게시글카운트

      connection.query(sql1, function(err, results, field) {
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

      console.log(rows);
    }
  });

});

router.post('/postChk', function(req, res, next) { //게시글을 생성한다
  var title = req.param('title');
  var link = req.param('link');
  var password = req.param('password');
  var company = req.param('company');
  var reporter = req.param('reporter');
  var content = req.param('content');
  var filelink = req.param('filelink');
  console.log(title );


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
