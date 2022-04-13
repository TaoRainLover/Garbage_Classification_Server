const db = require('../db/index')

// add -- 添加一条答题记录
exports.add = (req, res) => {
  res.send('search_history add api')

}

// history_today -- 查询用户当日的搜索记录
// 
exports.history_today = (req, res) => {
  // res.send('search_history history api')
  const openid = req.body.openid
  const sql = `select * from search_record where openid = ? and to_days(date) = to_days(now())`
  db.query(sql, openid, (err, results) => {
    // 查询失败
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('未查询到该用户的数据')
    // 查询成功
    res.send({
      status: 0,
      msg: '查询用户搜索数据成功',
      data: results
    })
  })
}


// history_before -- 查询用户更早的搜索记录（除去今日的）
exports.history_before = (req, res) => {
  const openid = req.body.openid
  const sql = `select * from search_record where openid = ? and to_days(date) != to_days(now())`
  db.query(sql, openid, (err, results) => {
    // 查询失败
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('未查询到该用户的数据')
    // 查询成功
    res.send({
      status: 0,
      msg: '查询用户搜索数据成功',
      data: results
    })
  })
}

exports.count = (req, res) => {
  const openid = req.body.openid
  const sql =  'select count(id) as count from search_record where openid = ?'
  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    res.send({
      status: 0,
      msg: '查询用户的搜索条数成功',
      count: results[0].count
    })
  })
  // res.send(openid)
}