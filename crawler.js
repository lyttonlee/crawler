const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('superagent-charset')(superagent)
const fs = require('fs')
const path = require('path')
const baseUrl = 'https://www.zwdu.com'
class Crawler {
  constructor (url) {
    this.url = url
  }
  // getbookinfo
  getBookInfo () {
    return new Promise((resolve, reject) => {
      request.get(this.url).charset('gbk').then(async res => {
        const data = res.text
        const $ = cheerio.load(data)
        // 获取书名
        const bookName = $('#maininfo #info h1').text()
        console.log(bookName)
        // 简介
        const intro = $('#intro p').text()
        const hrefs = []
        await $('.box_con #list dl dd').each((index, el) => {
          const item = $(el)
          // 每一章的链接
          const href = baseUrl + item.find('a').attr('href')
          hrefs.push(href)
        })
        const info = {
          name: bookName,
          intro: intro,
          hrefs: hrefs,
          length: hrefs.length
        }
        // console.log(info)
        resolve(info)
      })
    })
  }
  // get
  getLists (hrefs) {
    return hrefs
  }
}
module.exports = Crawler