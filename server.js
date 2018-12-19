var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mime = require('mime');
const accountSid = 'AC40b1c97027706d31c345a9f2bd800768';
const authToken = '7bb80fc990a84e660c7670f5ae29afd1';
const twilioClient = require('twilio')(accountSid, authToken);
const multer = require('multer');
const cors = require('cors');
const storage = multer.diskStorage({
  destination: './images/',
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if(err) return cb(err);
      
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    })
  }
})
const upload = multer({ storage: storage });

const sql_db = require('./db/sql_db');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.post('/users', function(req, res, next) {
  let { firstName, lastName, email, phoneNumber, lat, lon } = req.body;
  let { path } = "";//req.file;
  return sql_db.addUser(firstName, lastName, email, phoneNumber, lat, lon, path, () => {
    res.status(204).end();
  });
});

app.get('/users', function(req, res, next) {
  return sql_db.getAllUsers((data) => {
    res.send(data);
  });
});

app.get('/users/:id', function(req, res, next) {
  let userID = req.params.id;
  sql_db.getUserByID(userID, (data) => {
    // twilioClient.messages
    //   .create({
      //     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
      //     from: '+19042043073',
      //     to: '+13477591423'
      //   })
      //   .then(message => console.log(message.sid))
      //   .done();
      res.send(data);
    });
  });
  
  app.post('/postings', function(req, res, next) {
    let { title, description, capacity, lat, lon, firstname, lastname, time, email } = req.body;
    sql_db.addPosting(title, description, capacity, lat, lon, firstname, lastname, time, email, () => {
      res.status(204).end();
    });
  });
  
  app.get('/postings', function(req, res, next) {
    sql_db.getAllPostings((data) => {
      res.send(data);
    });
  });
  
  app.get('/postings/:id', function(req, res, next) {
    let postingID = req.params.id;
    sql_db.getPostingByID(postingID, (data) => {
      res.send(data);
    });
  });
  
  app.post('/addUser/:uid/toPost/:pid', function(req, res, next) {
    let {uid, pid} = req.params;
    sql_db.addUserToPosting(uid, pid, () => {
      res.status(204).end();
    });
  });
  
  app.get('/getSubscribedusers/:pid', function(req, res, next) {
    let { pid } = req.params;
    sql_db.getUsersForAPosting(1, (data) => {
      res.send(data);
    });
  });
  
  app.post('/approveUser/:uid/toPost/:pid', function(req, res, next) {
    let { uid, pid } = req.params;
    sql_db.approveUserToPost(uid, pid, () => {
      res.end();
    });
  });
  
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
