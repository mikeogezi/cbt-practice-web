'use strict'

let fs = require('fs')
let path = require('path')
let questions = require('../json/questions')

let index = (req, res, next) => {
    res.redirect('login')
}

let loginPost = (req, res, next) => {
    if (req.query.pin) {
        return res.redirect('quiz')
    }
    return res.redirect('login')
}

let login = (req, res, next) => {
    res.render('login')
}

let logout = (req, res, next) => {
    res.redirect('login')
}

let getQuestions = (req, res, next) => {
    res.send(questions)
}

let quiz = (req, res, next) => {
    res.render('quiz')
}

exports.index = index
exports.login = login
exports.loginPost = loginPost
exports.logout = logout
exports.getQuestions = getQuestions
exports.quiz = quiz