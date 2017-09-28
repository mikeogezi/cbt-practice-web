'use strict'

const QUESTION_COUNT = 50

let _ = require('underscore')
let fs = require('fs')
let path = require('path')
let questions101 = require('../json/questions_cs101')
let questions201 = require('../json/questions_cs201')

let index = (req, res, next) => {
    res.render('choice', {
        title: 'Mock CBT Exam - Courtesy of Alfred Lasisi'
    })
}

const KEYWORDS = [
    'lasisifornassa',
    'lasisi',
    'alfred',
    'nassa',
    'malik',
    'maleek'
]

let isValid = (pin) => {
    pin = pin.toLocaleLowerCase()
    for (var kwd of KEYWORDS) {
        kwd = kwd.toLocaleLowerCase();
        if (pin.includes(kwd)) {
            return true
        }
    }
    return false
}
let loginPost = {
    cs101: (req, res, next) => {
        if (isValid(req.query.pin)) {
            return res.redirect('/quiz/cs101')
        }
        return res.redirect('/login/cs101')
    },
    cs201: (req, res, next) => {
        if (isValid(req.query.pin)) {
            return res.redirect('/quiz/cs201')
        }
        return res.redirect('/login/cs201')
    }
}

let login = {
    cs101: (req, res, next) => {
        res.render('login', {
            choice: 'cs101',
            title: 'Log In - Courtesy of Alfred Lasisi'
        })
    },
    cs201: (req, res, next) => {
        res.render('login', {
            choice: 'cs201',
            title: 'Log In - Courtesy of Alfred Lasisi'
        })
    }
}

let logout = (req, res, next) => {
    res.redirect('/')
}

let getQuestions = {
    cs101: (req, res, next) => {
        let q = {
            questions: []
        }
        q.questions = _.sample(questions101.questions, QUESTION_COUNT)
        res.json(q)
    },
    cs201: (req, res, next) => {
        let q = {
            questions: []
        }
        q.questions = _.sample(questions201.questions, QUESTION_COUNT)
        res.json(q)
    }
}

let quiz = {
    cs101: (req, res, next) => {
        res.render('quiz', {
            choice: 'cs101',
            title: 'Exam - Courtesy of Alfred Lasisi'
        })
    },
    cs201: (req, res, next) => {
        res.render('quiz', {
            choice: 'cs201',
            title: 'Exam - Courtesy of Alfred Lasisi'
        })
    }
}

exports.index = index
exports.login = login
exports.loginPost = loginPost
exports.logout = logout
exports.getQuestions = getQuestions
exports.quiz = quiz