var express = require('express');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var app = express();
bodyParser = require('body-parser');
var session = require('express-session');

app.use(session({
secret :'asdjha!@#@#$dd',
resave:false,
saveUninitialized:true
}))


app.use(bodyParser.urlencoded({extended: true}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('api', path.join(__dirname, 'api'));
app.set('view engine', 'ejs');

// set path for static assets
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {status:err.status, message:err.message});
});

module.exports = app;
