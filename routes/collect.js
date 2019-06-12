var express = require('express');
var http = require('https');
const fs = require('fs');
var router = express.Router();

/* GET collect page. */
router.get('/', function(req, res, next) {

	const url = 'https://storage.googleapis.com/fiawec-prod/assets/live/WEC/__data.json?_=' + Math.random();

	http.get(url, function(res){
	    var body = '';

	    res.on('data', function(chunk){
	    	console.log(chunk);
	        body += chunk;
	    });

	    res.on('end', function(){
	        var responseData = JSON.parse(body);
	        const dataStore = './data/' + responseData.params.timestamp + '.json';
	        fs.writeFile(dataStore, body, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Lyric saved!');
    console.log(err);
});
	        console.log("Got a response: ", responseData.params.timestamp);
	    });
	}).on('error', function(e){
	      console.log("Got an error: ", e);
	});

/*

	var options = {
	  hostname: 'http://storage.googleapis.com'
	  ,path: '/fiawec-prod/assets/live/WEC/__data.json?_=' + '343adadaz245'
	  ,method: 'GET'
      ,json:true
	};

	var reqA = http.get(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
	       console.log(data); // I can't parse it because, it's a string. why?
	  });
	});
	reqA.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	reqA.end();
*/

  res.send('get the le mans data');
});

module.exports = router;
