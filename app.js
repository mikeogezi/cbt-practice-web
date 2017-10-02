'use strict'

// \n.{1,}\| &#x9.*

let path = require('path')

let express = require('express')
let stylus = require('stylus')
let nib = require('nib')
let bodyParser = require('body-parser')
let favicon = require('serve-favicon')
let multer = require('multer')
let ms = require('ms')
let compression = require('compression')

let routes = require('./app/routes')

let compile = (str, _path) => {
    return stylus(str).set('filename', _path).use(nib());
}

let app = express()

app.set('homedir', __dirname)
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/public/views/pug')
app.set('view engine', 'pug')

app.locals.year = new Date().getFullYear()
app.locals.designerPersonOne = 'Alfred Lasisi'
app.locals.designerPersonOneSite = '#'
app.locals.designerPersonTwo = 'Biodun Owolabi'
app.locals.designerPersonTwoSite = '#'
app.locals.designerPersonThree = 'Michael Ogezi'
app.locals.designerPersonThreeSite = 'http://makerloom-web.herokuapp.com'

app.use(compression())
app.use(express.static(path.join(__dirname + '/public'), {
    maxAge: process.env.NODE_ENV == 'production' ? ms('365 days') : ms('0')
}))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, '/public/images/logo.ico')))
app.use(stylus.middleware({
    src: path.join(__dirname, '/public'),
    compile: compile
}))
app.use(bodyParser.urlencoded({
    extended: false
}))

app.locals.rootUrl = 'http://localhost:3000/'

// home page
app.get('/', routes.index)
// quiz page
app.get('/quiz/cs101', routes.quiz.cs101)
app.get('/quiz/cs201', routes.quiz.cs201)
// login page
app.get('/login/cs101', routes.login.cs101)
app.get('/login/cs201', routes.login.cs201)
// login
app.get('/loginPost/cs101', routes.loginPost.cs101)
app.get('/loginPost/cs201', routes.loginPost.cs201)
// log out
app.get('/logout', routes.logout)
// get test questions
app.get('/getQuestions/cs101', routes.getQuestions.cs101)
app.get('/getQuestions/cs201', routes.getQuestions.cs201)

app.locals.pretty = true

app.listen(app.get('port'), () => {
    console.log(`Listening or port ${app.get('port')}`)
})
