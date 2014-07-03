"use strict";

var mongoose = require('mongoose');

var dateformat = require('dateformat');

var Schema = mongoose.Schema;

var AccessLogSchema = new Schema({
  method: String,
  path: String,
  host: String,
  time: String
});
  

var HistSchema = new Schema({
  key: String,
  value: [{x: String, y: Number}]
});

mongoose.connect('mongodb://localhost/rails');

var accesslogs = mongoose.model('AccessLog', AccessLogSchema, 'accesslog');

exports.findAll = function(req, res) {
  accesslogs.find({}, function(err, results) {
    if (err) {
      res.send({'error': 'An error has occurred'});
    } else {
      console.log('Success: Getting history');
      var hist = [];
      var tmp_time_list = [];
      for (var i = 0; i < results.length; i++) {
        var key_exist = false;

        // format time
        var time = dateformat(results[i].time, 'yyyy-mm-dd HH:mm:00');
        tmp_time_list.push(time);
        for (var j = 0; j < hist.length; j++) {
          if (hist[j].key == results[i].path) {
            key_exist = true;

            // append value
            var value_x_exist = false;
console.log(hist[j]);
            for (var k = 0; k < hist[j].value.length; k++) {
              if (hist[j].value[k].x === time) {
	        value_x_exist = true;
                hist[j].value[k].y++;
              }
            }
            if (value_x_exist === false) {
              hist[j].value.push({x: time, y: 1});
            }
          }
        }
        if (key_exist === false) {
	  hist.push({key: results[i].path, value: [{x: time, y: 1}]});
        }
      }

      for (var i = 0; i < hist.length; i++) {
        for (var j = 0; j < tmp_time_list.length; j++) {
          var has = false;
          for (var k = 0; k < hist[i].value.length; k++) {
            if (tmp_time_list[j] === hist[i].value[k].x) {
              has = true;
              break;
            }
          }
          if (has === false) {
            hist[i].value.push({x: tmp_time_list[j], y: 0});
          }
        }
      }
      res.json(hist);
    }
  });
};


