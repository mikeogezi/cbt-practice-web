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

let routes = require('./app/routes')

let compile = (str, _path) => {
    return stylus(str).set('filename', _path).use(nib());
}

let app = express()

app.set('homedir', __dirname)
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/public/views/pug')
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname + '/public')))
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
app.get('/quiz', routes.quiz)
// login page
app.get('/login', routes.login)
// login
app.get('/loginPost', routes.loginPost)
// log out
app.get('/logout', routes.logout)
// get test questions
app.get('/getQuestions', routes.getQuestions)

app.locals.pretty = true

app.listen(app.get('port'), () => {
    console.log(`Listening or port ${app.get('port')}`)
})
