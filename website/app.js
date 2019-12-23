var express = require('express');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var app = express();
bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');

//공통모듈 선언

//세션 정의
app.use(session({
secret :'asdjha!@#@#$dd',
resave:false,
saveUninitialized:true
}))


app.use(bodyParser.urlencoded({extended: true}));


// 프론트 세 및 서버사ㅣ드 세팅
app.set('views', path.join(__dirname, 'views'));
app.set('api', path.join(__dirname, 'api'));
app.set('view engine', 'ejs');

// 정적변수 세팅
app.use(express.static(path.join(__dirname, 'public')));


// 기본라우트
app.use('/', index);

//404 핸들러
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 에러 핸들러
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {status:err.status, message:err.message});
});

module.exports = app;
