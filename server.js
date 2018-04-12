// Modules ================================================
const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// DB =====================================================
const db = require("./helpers/db")(mongoose);
mongoose.connect(db.url);

// uncomment after placing your favicon in /public
//app.use(favicon(dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/build')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);
app.set('view engine', 'pug');

// Routes =================================================
// Base route
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
});

// Admin page
router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
});

// API routes
require("./helpers/routes")(router, db);

console.log(`Server is running on port 8004`);
app.listen(8004);