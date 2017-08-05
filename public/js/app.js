var questions
var questionNum

function listenCheckbox () {
    console.log('listenCheckbox')

    $('#question_section input[type=checkbox]').click(function () {
        var chks = $('#question_section input[type=checkbox]');
        for (var chk of chks) {
            if (chk != this) {
                chk.checked = false;
            }
        }
        var question = questions[questionNum - 1]
        question.chosen_option = $(this).parent().find('label').text()
        console.log($(this).parent().find('label').text())
    })
}

function renderQuestion (num) {
    console.log('renderQuestion')

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
    var option1 = 'option_1'
    var option2 = 'option_2'
    var option3 = 'option_3'
    var option4 = 'option_4'
    var option5 = 'option_5'

    var question = questions[num - 1]

    $(questionNumber).text(num)
    
    $(questionText).text(question.text)

    $('#' + option1)[0].checked = false
    $('#' + option2)[0].checked = false
    $('#' + option3)[0].checked = false
    $('#' + option4)[0].checked = false
    $('#' + option5)[0].checked = false

    $('label[for=' + option1 + ']').text(question.options[0])
    $('label[for=' + option2 + ']').text(question.options[1])
    $('label[for=' + option3 + ']').text(question.options[2])
    $('label[for=' + option4 + ']').text(question.options[3])
    $('label[for=' + option5 + ']').text(question.options[4])

    for (var i in question.options) {
        if (question.chosen_option == question.options[i]) {
            var select = '#option_' + (parseInt(i) + 1)
            $(select)[0].checked = true
        }
    }

    questionNum = num
}

function getQuestions () {
    console.log('getQuestions')

    var reqStr = 'getQuestions'
    $.getJSON(reqStr, function (data) {
        questions = data.questions
        
        questionNum = 1

        renderQuestion(questionNum)
    })
}

function nextQuestion () {
    renderQuestion(++questionNum)
}

function prevQuestion () {
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
    return countCorrect() * 2
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

var opt_id = 5;
function generateOptions (question) {
    options = ''
    for (var i = 0; i < 5; ++i) {
        if (question.options[i] == question.correct_answer) {
            options += '<p><input type="checkbox" checked="checked" id="option_' + (++opt_id) + '"/><label for="option_' + opt_id + '">' + question.options[i] + '</label></p>'
            continue;
        }
        options += '<p><input type="checkbox" id="option_' + (++opt_id) + '"/><label for="option_' + opt_id + '">' + question.options[i] + '</label></p>'
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
        '<div class="card-action">' +
        generateOptions(questions[num]) +
        '</div>' +
        '</div>'
    return html
}

function renderCorrectionPage () {
    $('#report_section').hide()
    $('#correction_section').show()
    $('#question_section').hide()
    $('#all_questions').html('')
    for (var i in questions) {
        $('#all_questions').append(generateCard(i))
    }
}

function renderQuestionPage () {
    $('#report_section').hide()
    $('#correction_section').hide()
    $('#question_section').show()
}

$(function () {
    if (window.location.pathname == '/quiz') {
        listenCheckbox()
        getQuestions()
        listenQuestions()
        listenCorrection()
        listenReport()
        renderQuestionPage()
    }
})