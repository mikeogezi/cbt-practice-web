const fs=require('fs')
f = 'pdftotext/legionofmaryuj.com_tutorialC++1.txt'
s = fs.readFileSync(f).toString()
ls = s.split('\n\n')
j = {questions:[]}
map = {'A':0,'B':1,'C':2,'D':3}
ls.forEach((l) => {
	var m = l.split('\n'),
	text = m[1],
	options = [],
	correct_answer
	var a=m[2].substr(3),b=m[3].substr(3),c=m[4].substr(3),d=m[5].substr(3)
	options = [a,b,c,d]
	correct_answer=options[map[m[6].substr(8)]]
	o = {text,options,correct_answer}
	j.questions.push(o)
})
console.log(j)
fs.writeFileSync('tmp.json',JSON.stringify(j,null,4))
