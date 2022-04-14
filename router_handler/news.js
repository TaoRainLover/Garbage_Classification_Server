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
  const sql = 'select id, title, date,cover_path, count_viewed from news order by date desc limit ? offset ?'
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

