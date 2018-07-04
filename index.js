const Crawler = require('./crawler')
const bookUrl = 'https://www.zwdu.com/book/17349/'
const crawler = new Crawler(bookUrl)

crawler.getBookInfo().then(res => {
  // console.log(res)
  const {name, intro, length, hrefs} = res
  console.log(crawler.getLists(hrefs))
})
