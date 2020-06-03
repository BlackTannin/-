var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/admin');

var session = require('express-session');    /*缓存session依赖*/
var flash = require('connect-flash');         /*flash依赖*/

var  MongoStore  = require("connect-mongo")(session);   /*mongo数据库依赖*/
var logger = require('morgan');
var cors = require('cors');     /*跨域cors依赖*/

var app = express();
//使用session插件
app.use(session({
  secret: 'fadsfasdf',
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({
    url: 'mongodb://127.0.0.1:27017/Express',  //数据库的地址/数据库名
    touchAfter: 7 * 24 * 3600    //过期时间 touchAfter: 7 * 24 * 3600
  })
}))
//使用flash插件
app.use(flash());
//设置cors跨域
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由守卫模式
app.use(function (req,res,next) {
  res.locals.message = req.flash("message").toString();
  res.locals.type = req.flash('type').toString();
  res.locals.user = req.session.user;
  res.locals.islogin = req.session.islogin;

  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);//后台的路由



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
