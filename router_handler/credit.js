const db = require('../db/index')
const my_date = require('../utils/my_date')
// add -- 添加积分
exports.add = (req, res) => {
  // res.send('credit add api')
  const openid = req.body.openid
  const type = req.body.type
  const credit = req.body.credit

  // 1. 查询该用户的 积分 数量
  const sql = `select credit from users where openid=?`
  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('该用户信息不存在')
    // 2. 更新总积分数量
    const creditAll = results[0].credit + credit
    const sql2 = `update users set credit = ? where openid=?`
    db.query(sql2, [creditAll, openid], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) res.cc('更新用户总积分失败')
      // 3. 添加一条积分记录
      const sql3 = `insert into credit_record (openid, type, credit) values (?, ?, ?)`
      db.query(sql3, [openid, type, credit], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('签到信息插入积分表失败')
        res.cc('添加积分成功', status=0)
      })
    })
  })
}

// history -- 查询用户的所有积分列表数据
exports.history = (req, res) => {
  
  const openid = req.body.openid
  
  const sql = `select * from credit_record where openid=? order by date desc`
  db.query(sql, openid, (err, results) => {
    if (err) return res.cc(err)

    // 对时间进行处理
    results = my_date.date_format1(results)
    res.send({
      status: 0,
      msg: '查询用户的积分数据成功',
      data: results
    })
  })
}

// history_add -- 用户增加的积分信息
exports.history_add = (req, res) => {
  
  const openid = req.body.openid
  
  const sql = `select * from credit_record where openid=? and is_add=1 order by date desc`
  db.query(sql, openid, (err, results) => {
    if (err) return res.cc(err)

    // 对时间进行处理
    results = my_date.date_format1(results)
    res.send({
      status: 0,
      msg: '查询用户的积分数据成功',
      data: results
    })
  })
}


// history _des -- 用户减少的积分记录信息
exports.history_des = (req, res) => {
  
  const openid = req.body.openid
  
  const sql = `select * from credit_record where openid=? and is_add=0 order by date desc`
  db.query(sql, openid, (err, results) => {
    if (err) return res.cc(err)

    // 对时间进行处理
    results = my_date.date_format1(results)
    res.send({
      status: 0,
      msg: '查询用户的积分数据成功',
      data: results
    })
  })
}