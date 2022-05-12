const db = require('../db/index')
const my_data = require('../utils/my_date')
exports.submit = (req, res) => {
  // res.send('feedback submit api')
  const openid = req.body.openid
  const type = req.body.type
  const title = req.body.title
  const des = req.body.des
  // const imgUrls = req.body.imgUrls
  
  const sql = `insert into feedback (openid, type, title, des) values (?, ?, ?, ?)`
  db.query(sql, [openid, type, title, des], (err, results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('提交反馈信息失败')
    res.send({
      status: 0,
      msg: '提交反馈信息成功'
    })
  })

}

// lists -- 管理员查询未阅读的反馈列表数据
// 进行分页查询
exports.lists = (req, res) => {
  const sql = `select * from feedback where is_read = 0 and is_deleted = 0 order by date desc`

  db.query(sql, (err, results) => {
    if(err) return res.cc(err)
    results = my_data.date_format4(results)
    res.send({
      status: 0,
      msg: '获取未读消息列表成功',
      list: results
    })
  })
}

exports.lists_read = (req, res) => {
  const sql = `select * from feedback where is_read = 1 and is_deleted = 0 order by date desc`

  db.query(sql, (err, results) => {
    if(err) return res.cc(err)
    results = my_data.date_format4(results)
    
    res.send({
      status: 0,
      msg: '获取已读消息列表成功',
      list: results
    })
  })
}

exports.lists_deleted = (req, res) => {
  const sql = `select * from feedback where is_deleted = 1 order by date desc`

  db.query(sql, (err, results) => {
    if(err) return res.cc(err)
    results = my_data.date_format4(results)

    res.send({
      status: 0,
      msg: '获取删除列表成功',
      list: results
    })
  })
}