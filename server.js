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
const client = require('./db/sql_db');
const storage = multer.diskStorage({
  destination: './images/',
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    })
  }
})
const upload = multer({ storage: storage });

const userDB = require('./db/users_db');
const postingDB = require('./db/postings_db');
const reviewDB = require('./db/review_db')
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

app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/reviews/:chef_name', reviewDB.getReviews())


app.post('/reviews', (req, res) => {
  let { chef_name, reviewer_name, date_created, imageurl, review } = req.body
  let query = "INSERT INTO reviews (chef_name, reviewer_name, date_created, imageurl, review) VALUES($1, $2, $3, $4, $5)"
  let values = [chef_name, reviewer_name, date_created, imageurl, review]
  client.query(query, values)
    .then(data => {
      res.send({ "all": "good" })
    })
    .catch(err => {
      console.log(err);
    })
})

app.post('/users', function (req, res, next) {
  let { firstName, lastName, email, phoneNumber, lat, lon } = req.body;
  let { path } = "";//req.file;
  return userDB.addUser(firstName, lastName, email, phoneNumber, lat, lon, path, () => {
    res.status(204).end();
  });
});

app.get('/users', function (req, res, next) {
  return userDB.getAllUsers((data) => {
    res.send(data);
  });
});

app.get('/users/:id', function (req, res, next) {
  let userID = req.params.id;
  userDB.getUserByID(userID, (data) => {
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

app.post('/postings', function (req, res, next) {
  let { title, description, capacity, lat, lon, firstname, lastname, time, email } = req.body;
  postingDB.addPosting(title, description, capacity, lat, lon, firstname, lastname, time, email, () => {
    res.status(204).end();
  });
});

app.get('/postings', function (req, res, next) {
  postingDB.getAllPostings((data) => {
    res.send(data);
  });
});

app.get('/postings/:id', function (req, res, next) {
  let postingID = req.params.id;
  postingDB.getPostingByID(postingID, (data) => {
    res.send(data);
  });
});

app.post('/addUser/:uid/toPost/:pid', function (req, res, next) {
  let { uid, pid } = req.params;
  userDB.addUserToPosting(uid, pid, () => {
    res.status(204).end();
  });
});

app.get('/getSubscribedusers/:pid', function (req, res, next) {
  let { pid } = req.params;
  userDB.getUsersForAPosting(1, (data) => {
    res.send(data);
  });
});

app.post('/approveUser/:uid/toPost/:pid', function (req, res, next) {
  let { uid, pid } = req.params;
  postingDB.approveUserToPost(uid, pid, () => {
    res.end();
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;