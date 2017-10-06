'use strict'

const QUESTION_COUNT = 50

let _ = require('underscore')
let fs = require('fs')
let path = require('path')

let questionsCS101 = require('../json/questions_cs101')
let questionsCS201 = require('../json/questions_cs201')
let questionsGST103 = require('../json/questions_gst103')
let questionsGST104 = require('../json/questions_gst104')
let questionsGST223 = require('../json/questions_gst223')

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
    },
    gst103: (req, res, next) => {
        if (isValid(req.query.pin)) {
            return res.redirect('/quiz/gst103')
        }
        return res.redirect('/login/gst103')
    },
    gst104: (req, res, next) => {
        if (isValid(req.query.pin)) {
            return res.redirect('/quiz/gst104')
        }
        return res.redirect('/login/gst104')
    },
    gst223: (req, res, next) => {
        if (isValid(req.query.pin)) {
            return res.redirect('/quiz/gst223')
        }
        return res.redirect('/login/gst223')
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
    },
    gst103: (req, res, next) => {
        res.render('login', {
            choice: 'gst103',
            title: 'Log In - Courtesy of Alfred Lasisi'
        })
    },
    gst104: (req, res, next) => {
        res.render('login', {
            choice: 'gst104',
            title: 'Log In - Courtesy of Alfred Lasisi'
        })
    },
    gst223: (req, res, next) => {
        res.render('login', {
            choice: 'gst223',
            title: 'Log In - Courtesy of Alfred Lasisi'
        })
    }
}

let logout = (req, res, next) => {
    res.redirect('/')
}

let _questions = (questionsObj) => {
    let q = {
        questions: []
    }
    q.questions = _.sample(questionsObj.questions, QUESTION_COUNT)
    return q
}

let getQuestions = {
    cs101: (req, res, next) => {
        res.json(_questions(questionsCS101))
    },
    cs201: (req, res, next) => {
        res.json(_questions(questionsCS201))
    },
    gst103: (req, res, next) => {
        res.json(_questions(questionsGST103))
    },
    gst104: (req, res, next) => {
        res.json(_questions(questionsGST104))
    },
    gst223: (req, res, next) => {
        res.json(_questions(questionsGST223))
    }
}

let _quiz = (choice) => {
    return {
        choice: 'cs101',
        title: 'Exam - Courtesy of Alfred Lasisi'
    }
}

let quiz = {
    cs101: (req, res, next) => {
        res.render('quiz', _quiz('cs101'))
    },
    cs201: (req, res, next) => {
        res.render('quiz', _quiz('cs201'))
    },
    gst103: (req, res, next) => {
        res.render('quiz', _quiz('gst103'))
    },
    gst104: (req, res, next) => {
        res.render('quiz', _quiz('gst104'))
    },
    gst223: (req, res, next) => {
        res.render('quiz', _quiz('gst223'))
    }
}

let quizRes = (req, res, next) => {
    return quiz[req.params.choice](req, res, next)
}

let getQuestionsRes = (req, res, next) => {
    return getQuestions[req.params.choice](req, res, next)
}

let loginRes = (req, res, next) => {
    return login[req.params.choice](req, res, next)
}

let loginPostRes = (req, res, next) => {
    return loginPost[req.params.choice](req, res, next)
}

exports.index = index
exports.loginRes = loginRes
exports.loginPostRes = loginPostRes
exports.logout = logout
exports.getQuestionsRes = getQuestionsRes
exports.quizRes = quizRes