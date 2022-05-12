const db = require('../db/index')
const my_date = require('../utils/my_date')
// lists -- 查询新闻列表消息
exports.lists = (req, res) => { 
  // res.send('news lists api')
  // 页面 -- 从1开始
  const page = req.body.page
  // 每次获取数量为 8 
  const count = 8
  const offset = (page - 1)*count
  const sql = 'select * from news order by date desc limit ? offset ?'
  db.query(sql, [count, offset], (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('未查询到新闻列表数据')
    // 对时间进行处理
    results = my_date.date_format1(results)
    res.send({
      status: 0,
      msg: '获取到新闻列表数据',
      lists: results
    })
  })
}

// item -- 查询某一条新闻列表的详情信息
exports.item = (req, res) => {
  // res.send('news item api')
  const id = req.body.id
  const sql = `select * from news where id=?`
  // 1.查询该条新闻的数据
  db.query(sql, id, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('查询新闻数据失败')
    // 2. 查询成功--返回该条新闻的数据 并 更新该条新闻的浏览数
    const count = results[0].count_viewed + 1
    const sql2 = `update news set count_viewed=? where id=?`
    db.query(sql2, [count, id], (err, results2) => {
      if (err) return res.cc(err)
      // 更新浏览数量失败
      if (results2.affectedRows !== 1) return res.cc('查询新闻数据失败')
      // 设置时间格式
      const info = my_date.date_format2(results[0])
      res.send({
        status: 0,
        msg: '查询新闻数据成功！',
        info: info,
      })
    })
    
  })
}


// add --- 添加一条新闻文章
exports.add = (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const source = req.body.source
  const link = req.body.link
  const cover_path = req.body.cover_path
  const type = req.body.type

  const sql = `insert into news (title, content, cover_path, source, link, type) values (?,?, ?, ?,?, ?)`

  db.query(sql, [title, content, cover_path, source, link, type], (err, results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('添加新闻文章数据失败')

    res.send({
      status: 0,
      msg: '添加新闻文章数据成功'
    })
  })
}

exports.query = (req, res) => {
  // type: 查询方式
  const type = req.body.type
  const info =  '%' +req.body.info+'%'

  const sql = 'select * from news where '+type+' like ? order by date desc'

  db.query(sql,[info], (err, results) => {
    if(err) return res.cc(err)

    if(results.length === 0) return res.cc('未查询到相关信息', status = 0)

    res.send({
      status: 0,
      msg: '查询到相关的信息',
      list: results
    })
  })
}