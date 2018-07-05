
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
      request.get(this.url).charset('gbk').then(res => {
        const data = res.text
        const $ = cheerio.load(data)
        // 获取书名
        const bookName = $('#maininfo #info h1').text()
        const author = $('#maininfo #info p').eq(0).text()
        // 简介
        const intro = $('#intro p').text()
        // 所有章节的链接
        const hrefs = []
        $('.box_con #list dl dd').each((index, el) => {
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
  // 章节内容
  getContent (href) {
    return new Promise((resolve, reject) => {
      request.get(href).charset('gbk').then(res => {
        const itemData = res.text
        const item$ = cheerio.load(itemData)
        const itemTitle = item$('.box_con .bookname h1').text()
        console.log(`开始爬取-${itemTitle}`)
        const itemContent = item$('.box_con #content').text()
        const item = {
          title: itemTitle,
          content: itemContent
        }
        // const item = itemTitle + itemContent
        console.log(`已完成爬去${itemTitle}的内容`)
        resolve(item)
      }).catch(err => {
        console.error(err)
        reject('爬取失败！')
      })
    })
  }
  getLists (hrefs) {
    return new Promise((resolve, reject) => {
      const bookContent = []
      for (let i = 0; i < hrefs.length; i++) {
        // console.log(i + ':' + hrefs[i])
        request.get(hrefs[i]).charset('gbk').then(res => {
          const itemData = res.text
          const item$ = cheerio.load(itemData)
          const itemTitle = item$('.box_con .bookname h1').text()
          console.log(`开始爬取第${i}章-${itemTitle}`)
          const itemContent = item$('.box_con #content').text()
          const item = itemTitle + itemContent
          console.log(`已完成爬去第${i}章的内容`)
          bookContent.push(item)
        }).catch(err => {
          console.error(err)
          console.log('爬取失败！')
        })
      }
      console.log(bookContent)
      resolve(bookContent)
    })
  }
}
module.exports = Crawler