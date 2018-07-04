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
    hrefs.push(href)
    // request.get(href).charset('gbk').then(res => {
    //   const itemData = res.text
    //   const item$ = cheerio.load(itemData)
    //   const itemTitle = item$('.box_con .bookname h1').text()
    //   console.log(`开始爬取-${itemTitle}`)
    //   const itemContent = item$('.box_con #content').text()
    //   const item = itemTitle + itemContent
    //   bookContent.push(item)
    //   console.log(`已完成爬取${itemTitle}章的内容`)
    // })
  })
  console.log(hrefs)
  // 2.遍历章节内容
  // await getlists(hrefs)
  // const getlists = async lists => {
  //   for (let i = 0; i < lists.length; i++) {
  //     request.get(lists[i]).charset('gbk').then(async res => {
  //       const itemData = res.text
  //       const item$ = cheerio.load(itemData)
  //       const itemTitle = item$('.box_con .bookname h1').text()
  //       console.log(`开始爬取第${i}章-${itemTitle}`)
  //       const itemContent = item$('.box_con #content').text()
  //       const item = itemTitle + itemContent
  //       await bookContent.push(item)
  //       console.log(`已完成爬去第${i}章的内容`)
  //     })
  //   }
  // }
  // for (let i = 0; i < hrefs.length; i++) {
  //   request.get(hrefs[i]).charset('gbk').then(async res => {
  //     const itemData = res.text
  //     const item$ = cheerio.load(itemData)
  //     const itemTitle = item$('.box_con .bookname h1').text()
  //     console.log(`开始爬取第${i}章-${itemTitle}`)
  //     const itemContent = item$('.box_con #content').text()
  //     const item = itemTitle + itemContent
  //     await bookContent.push(item)
  //     console.log(`已完成爬去第${i}章的内容`)
  //   })
  // }
  // book = await intro + bookContent.join('')
  console.log(bookContent)
  // fs.writeFile(path.join(__dirname, `./novle/${bookName}.txt`), book, 'utf8', err => {
  //   if (err) {
  //     console.error(err)
  //   }
  // })
})

