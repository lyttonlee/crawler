const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('superagent-charset')(superagent)
const fs = require('fs')
const path = require('path')

// 小说地址
const bookUrl = 'https://www.zwdu.com/book/17349/'
const baseUrl = 'https://www.zwdu.com'
// 开始爬书
const hrefs = []
// const bookName = ''
const bookContent = []
request.get(bookUrl).charset('gbk').then(async res => {
  const data = res.text
  const $ = cheerio.load(data)
  // 获取书名
  const bookName = $('#maininfo #info h1').text()
  console.log(bookName)
  // 简介
  const intro = $('#intro p').text()
  // console.log(intro)
  // 章节内容
  // 1.获取章节链接
  await $('.box_con #list dl dd').each((index, el) => {
    const item = $(el)
    // 每一章的链接
    const href = baseUrl + item.find('a').attr('href')
    // hrefs.push(href)
    request.get(href).charset('gbk').then(res => {
      const itemData = res.text
      const item$ = cheerio.load(itemData)
      const itemTitle = item$('.box_con .bookname h1').text()
      console.log(`开始爬取-${itemTitle}`)
      const itemContent = item$('.box_con #content').text()
      const item = itemTitle + itemContent
      console.log(`已完成爬取${itemTitle}章的内容`)
      if (!fs.existsSync(path.join(__dirname, `./novle/${bookName}`))) {
        fs.mkdirSync(path.join(__dirname, `./novle/${bookName}`))
      }
      fs.writeFile(path.join(__dirname, `./novle/${bookName}/${itemTitle}.txt`), itemContent, 'utf8', err => {
        if (err) {
          console.error(err)
        }
        console.log('写入成功！')
      })
    })
  })
})

