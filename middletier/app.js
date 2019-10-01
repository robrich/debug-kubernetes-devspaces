var express = require('express');
var http = require('http');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
var port = process.env.PORT || 3000;
app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

var server = http.createServer(app);
server.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log(`listening on port ${port} in ${process.env.NODE_ENV}`);
});
