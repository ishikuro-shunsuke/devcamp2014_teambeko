var express = require('express');
var routes = require('./routes/index');
var hist = require('./routes/hist');
var path = require('path');
var app = express();

app.get('/',routes.index);
app.get('/hist', hist.findAll);

//var router = express.Router();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/tester/', function(req, res) {
  var http = require('request');
  var url = req.query.url;

  var parameters = req.query.parameters;
  parameters = parameters.split(',').join('&');
  parameters = parameters.split(':').join('=');

  var str = null;

  if (req.method == 'POST') {
    http.post({url: url, body: parameters}, function(req2, res2) {
      str = { url: url, status_code: req2.statusCode };
      res.json(str);
    });
  }else{
    var request_url = url + '?' + parameters;
console.log(request_url);
    http({url: request_url}, function(error, res2, body) {
      str = { url: request_url, status_code: res2.statusCode };
      res.json(str);
    });
  }
});


app.listen(8081);
