var questions
var questionNum
const MAX_OPTS = 10

function listenCheckbox () {
    console.log('listenCheckbox')

    $('#question_section input[type=checkbox]').click(function () {
        var question = questions[questionNum - 1]
        var optCnt = question.options.length
        var chks = $('#question_section input[type=checkbox]');
        for (var chk of chks) {
            if (chk != this) {
                chk.checked = false;
            }
        }

        question.chosen_option = $(this).parent().find('label').text()
        console.log($(this).parent().find('label').text())
        var noCheck = true
        for (var chk of chks) {
            if (chk.checked) {
                noCheck = false;
            }
        }
        if (noCheck) {
            console.log("No check", isAnswered(question))
            unAnswer(question)
        }

        reRenderOneQuestionSelect(questionNum)
        if (isFocusedQuestion(questionNum)) {
            focusQuestionSelect(questionNum)
        }
    })
}

function renderQuestionSelect (num) {
    num = num || questions.length

    var questionSelect = $('.card-action#question_select')
    
    var qIdPrep = 'question_select_'
    questionSelect.html('')
    
    for (var qNum = 1; qNum <= num; ++qNum) {
        var qId = qIdPrep + qNum
        
        var _html = '<a class="waves-effect waves-dark btn white grey-text" qNum="' + qNum + '" id="' + qId + '">' + qNum + '</a>'
        questionSelect.append(_html)
        
        var _qId = '#' + qId
        var q = $(_qId)

        q.click(function onClickButtonSelect (evt) {
            var qNum = parseInt($(this).attr('qNum'))
            console.log('Selecting', qNum)
            renderQuestion(qNum)
        })
    }
}

function focusQuestionSelect (qNum) {
    var qId = '#question_select_'
    var q = questions[qNum - 1]
    var qSel = $(qId + qNum)
    qSel.removeClass('white blue white-text grey-text')
    qSel.addClass('blue white-text')
}

function isFocusedQuestion (qNum) {
    var qId = '#question_select_'
    var q = questions[qNum - 1]
    var qSel = $(qId + qNum)
    return qSel.hasClass('blue white-text')
}

function unFocusquestionSelect (qNum) {
    var qId = '#question_select_'
    var q = questions[qNum - 1]
    var qSel = $(qId + qNum)
    qSel.removeClass('blue white-text')
    reRenderOneQuestionSelect(qNum)
}

function reRenderOneQuestionSelect (qNum) {
    var qId = '#question_select_'
    var q = questions[qNum - 1]
    if (isAnswered(q)) {
        var qSel = $(qId + qNum)
        console.log("Id ans", qId + qNum)
        qSel.removeClass('white grey-text')
        qSel.addClass('white blue-text')
        qSel.css('font-weight', 'bolder')
    }
    else {
        var qSel = $(qId + qNum)
        console.log("Id !ans", qId + qNum)
        qSel.removeClass('white blue-text')
        qSel.addClass('white grey-text')
        qSel.css('font-weight', 'normal')
    }
}

function renderQuestion (num) {
    console.log('renderQuestion')

    unFocusquestionSelect(questionNum)
    focusQuestionSelect(num)

    if (num == 1) {
        // No previous
        $('#next').show()
        $('#finish').hide()
        $('#previous').addClass('disabled')
    }
    else if (num == questions.length) {
        // No next
        $('#next').hide()
        $('#finish').show()
        $('#previous').removeClass('disabled')
    }
    else {
        // Next and previous
        $('#next').show()
        $('#finish').hide()
        $('#previous').removeClass('disabled')
    }

    var questionNumber = '#question_number'
    var questionText = '#question_text'
    var question = questions[num - 1]
    var optCnt = question.options.length
    var optIds = []

    for (var i = 1; i <= optCnt; ++i) {
        optIds.push('option_' + i)
    }

    for (var i = 1; i <= MAX_OPTS; ++i) {
        var qSel = $('#option_' + i)
        qSel.parent().hide()
    }

    $(questionNumber).text(num + ' / ' + questions.length)
    
    $(questionText).text(question.text)

    for (var optId of optIds) {
        var optSel = $('#' + optId)
        optSel.parent().show()
        optSel[0].checked = false
    }

    for (var i in optIds) {
        var optId = optIds[i]
        $('label[for=' + optId + ']').text(question.options[i])
    }

    for (var i in question.options) {
        if (question.chosen_option == question.options[i]) {
            var select = '#option_' + (parseInt(i) + 1)
            $(select)[0].checked = true
        }
    }

    questionNum = num
}

function getQuestions () {
    var reqStr = '/getQuestions'
    var p = window.location.pathname
    var isCS101 = p.endsWith('/cs101') || p.startsWith('/cs101')
    var isCS201 = p.endsWith('/cs201') || p.startsWith('/cs201')
    var isGST103 = p.endsWith('/gst103') || p.startsWith('/gst103')
    var isGST104 = p.endsWith('/gst104') || p.startsWith('/gst104')
    var isGST223 = p.endsWith('/gst223') || p.startsWith('/gst223')

    if (isCS101) {
        reqStr += '/cs101'
        console.log('getQuestions', 'cs101', reqStr)
    }
    else if (isCS201) {
        reqStr += '/cs201'
        console.log('getQuestions', 'cs201', reqStr)
    }
    else if (isGST103) {
        reqStr += '/gst103'
        console.log('getQuestions', 'gst103', reqStr)
    }
    else if (isGST104) {
        reqStr += '/gst104'
        console.log('getQuestions', 'gst104', reqStr)
    }
    else if (isGST223) {
        reqStr += '/gst223'
        console.log('getQuestions', 'gst223', reqStr)
    }

    $.getJSON(reqStr, function (data) {
        questions = data.questions
        
        questionNum = 1

        renderQuestion(questionNum)

        renderQuestionSelect(questions.length)

        focusQuestionSelect(1)
    })
}

function nextQuestion () {
    unFocusquestionSelect(questionNum)
    renderQuestion(++questionNum)
}

function prevQuestion () {
    unFocusquestionSelect(questionNum)
    renderQuestion(--questionNum)
}

function listenCorrection () {
    $('#correction').click(function () {
        renderCorrectionPage()
    })
}

function listenReport () {
    $('#finish').click(function () {
        if (questionNum == questions.length) {
            renderReportPage()
        }
    })
}

function saveQuestion (num, chosen_answer) {
    questions[num - 1].chosen_option = chosen_answer ||  questions[num - 1].chosen_option
}

function listenQuestions () {
    $('#previous').click(function () {
        if (questionNum > 1) {
            var chosen_answers = $('#question_section input[type=checkbox]')
            var chosen_answer
            saveQuestion(questionNum, chosen_answer)
            prevQuestion()
        }
    })

    $('#next').click(function () {
        if (questionNum < questions.length) {
            var chosen_answers = $('#question_section input[type=checkbox]')
            var chosen_answer
            saveQuestion(questionNum, chosen_answer)
            nextQuestion()
        }
    })
}

function isCorrectAnswer (question) {
    if (question.chosen_option == question.correct_answer) {
        return true
    }
    return false
}

function isAnswered (question) {
    if (question.chosen_option) {
        return true
    }
    return false
}

function unAnswer (question) {
    if (question.chosen_option) {
        delete question.chosen_option
    }
}

function countCorrect () {
    var correct_c = 0
    for (var question of questions) {
        if (isCorrectAnswer(question)) {
            ++correct_c
        }
    }
    return correct_c
}

function calculateScore () {
    return ((countCorrect() / questions.length) * 100).toFixed(2)
}

function countAnswered () {
    var answered_c = 0
    for (var question of questions) {
        if (isAnswered(question)) {
            ++answered_c
        }
    }
    return answered_c
}

function getGrade (score) {
    if (score < 45) {
        return 'E'
    }
    else if (score < 50) {
        return 'D'
    }
    else if (score < 60) {
        return 'C'
    }
    else if (score < 70) {
        return 'B'
    }
    
    return 'A'
}

function renderReportPage () {
    $('#report_section').show()
    $('#correction_section').hide()
    $('#question_section').hide()

    var questions_answered = countAnswered()
    var correct_answered = countCorrect()
    var total_questions = questions.length
    var score = calculateScore()
    var grade = getGrade(score)

    $('#answered').text(questions_answered)
    $('#correct_answers').text(correct_answered)
    $('#total_questions').text(total_questions)
    $('#score').text(score + '%')
    $('#grade').text(grade)
}

var opt_id = MAX_OPTS;
function generateOptions (question) {
    options = ''
    for (var i = 0; i < question.options.length; ++i) {
        if (question.options[i] == question.correct_answer) {
            options += '<p><input type="checkbox" checked="checked" id="option_' + (++opt_id) + '"/><label for="option_' + opt_id + '">' + question.options[i] + '</label></p>'
            continue;
        }
        if (question.options[i] == question.chosen_option) {
            options += '<p><input class="filled-in wrong" type="checkbox" checked="checked" id="option_' + (++opt_id) + '"/><label for="option_' + opt_id + '">' + question.options[i] + '</label></p>'
            continue;
        }
        options += '<p><input disabled="disabled" type="checkbox" id="option_' + (++opt_id) + '"/><label for="option_' + opt_id + '">' + question.options[i] + '</label></p>'
    }
    return options
}

function generateCard (num) {
    var qNum = parseInt(num) + 1
    var html = 
        '<div class="card">' + 
        '<div class="card-content">' +
        '<p id="question_number">' + qNum + '</p>' +
        '<span class="card-title" id="question_text">' + questions[num].text + '</span>' +
        '</div>' +
        '<div class="card-action question_opts">' +
        generateOptions(questions[num]) +
        '</div>' +
        '</div>'
    return html
}

function renderCorrectionPage () {
    $('#report_section').hide()
    $('#correction_section').show()
    $('#question_section').hide()
    $('#all_questions.correction').html('')
    for (var i in questions) {
        $('#all_questions').append(generateCard(i))
    }
    $('#correction_section input[type=checkbox][checked=checked]').click(function (evt) {
        this.checked = true
    })
}

function renderQuestionPage () {
    $('#report_section').hide()
    $('#correction_section').hide()
    $('#question_section').show()
}

$(function () {
    if (window.location.pathname.startsWith('/quiz') || window.location.pathname.endsWith('/quiz')) {
        listenCheckbox()
        getQuestions()
        listenQuestions()
        listenCorrection()
        listenReport()
        renderQuestionPage()
    }
})
