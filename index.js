
const Crawler = require('./crawler')
const fs = require('fs')
const path = require('path')
const bookUrl = 'https://www.zwdu.com/book/17349/'
const book2 = 'https://www.zwdu.com/book/7791/'
const crawler = new Crawler(book2)

crawler.getBookInfo().then(info => {
  const {name, intro, length, hrefs} = info
  const par = {
    name,
    hrefs
  }
  if (!fs.existsSync(path.join(__dirname, `./novle/${name}`))) {
    fs.mkdirSync(path.join(__dirname, `./novle/${name}`))
  }
  return par
}).then(par => {
  for (let i = 0; i < par.hrefs.length; i++) {
    setTimeout(() => {
      crawler.getContent(par.hrefs[i]).then(con => {
        console.log(i + '' + con)
        fs.writeFile(path.join(__dirname, `./novle/${par.name}/${con.title}.text`), con.content, 'utf8', err => {
          if (err) console.log(err)
          console.log('ok!')
        })
      })
    }, 1000)
  }
})
