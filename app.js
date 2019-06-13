var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require("node-cron");
var http = require('https');
const fs = require('fs');
var moment = require('moment');


var collectRouter = require('./routes/collect');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/collect', collectRouter);
app.use('/users', usersRouter);

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

// schedule tasks to be run on the server
cron.schedule("*/10 * * * * *", function() {
  console.log('CRON TIME - ' + moment().format());
  getData();

});


function getData(req, res, next) {

	const url = 'https://storage.googleapis.com/fiawec-prod/assets/live/WEC/__data.json?_=' + Math.random();

	http.get(url, function(res){
	    var body = '';

	    res.on('data', function(chunk){
	        body += chunk;
	    });

	    res.on('end', function(){
	        var responseData = JSON.parse(body);
	        const dataStore = './data/' + responseData.params.timestamp + '.json';

	        fs.writeFile(dataStore, body, (err) => {  
				    				  console.log(err);
					// throws an error, you could also catch it here
				    if (err) throw err;

				    // success case, the file was saved
				    console.log('Saved: ' + dataStore);
				    console.log(err);
				});

	    });
	}).on('error', function(e){
	      console.log("Got an error: ", e);
	});
}


module.exports = app;
