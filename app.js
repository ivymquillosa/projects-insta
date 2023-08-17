const express = require('express')
const path = require('path')
// const sass = require('node-sass');
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const fs = require('fs')
const app = express()
const data = require('./translation.json')


// Set cache age for any files inside public older
app.use('/public', express.static(__dirname + '/public', { maxAge: 31557600 }))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res) {
  const appUrl = req.originalUrl;
  const isMatch = appUrl.match(/a\d{1,6}\/app/g)
  if (isMatch) {
    res.render('../views/download4')
  }
  const err = new Error('Not Found')
  err.status = 404
  res.render('../views/404')
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}
app.get('*.js', (req, res, next) => {
	req.url = req.url + '.gz'
	res.setHeader('Content-Encoding', 'gzip');
	next();
})
app.get('*.css', (req, res, next) => {
	req.url = req.url + '.gz'
	res.setHeader('Content-Encoding', 'gzip');
	next();
})

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


app.use(function(req, res) {
  const lang = req.acceptsLanguages('fr', 'en', 'es')
  if (lang) {
    res.render(console.log('===================LANGUAGE===========================', lang))
  }
})

// fs.readFile('translation.json', (err, data) => {
//   if (err) throw err;
//   let student = JSON.parse(data);
//   console.log(student);
// });

// console.log(data)
// const lang = navigator.language
// console.log(lang);


module.exports = app
