const fs=require('fs')
f =  process.argv[2] || 'pdftotext/legionofmaryuj.com_tutorialC++1.txt'
s = fs.readFileSync(f).toString()
ls = s.split('\n\n')
j = {questions:[]}
map = {'A.':0,'B.':1,'C.':2,'D.':3,'E.':4,'a.':0,'b.':1,'c.':2,'d.':3,'e.':4
,'(a).':'a.','(b).':'b.','(c).':'c.','(d).':'d.','(e).':'e.'}
ls.forEach((l) => {
	let i=0
	var m = l.split('\n'),
	text = m[++i],
	//text = m[i],
	options = [],
	correct_answer
	console.log(m)
	// for(let h in m){
	// 	m[h] = m[h].trim()
	// }
	var a=m[++i].substr(3),b=m[++i].substr(3),c=m[++i].substr(3),d=m[++i].substr(3)
	//var a=m[++i].split('.')[1].trim(),b=m[++i].split('.')[1].trim(),c=m[++i].split('.')[1].trim(),d=m[++i].split('.')[1].trim()
	options = [a,b,c,d]
	// for(var h in m) {
	// 	if (m[h].startsWith('(')) {
	// 	 correct_answer=options[map[map[m[h].split(' ')[0]]]]
	// 	}
	// }
	correct_answer=(m[++i].split(':')[1])
	//correct_answer=options[map[m[++i].split(':')[1]]]


	o = {text,options,correct_answer}
	j.questions.push(o)
})
console.log(j)
fs.writeFileSync(`tmp${process.argv[2]}.json`,JSON.stringify(j,null,4))
