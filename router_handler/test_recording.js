const db = require('../db/index')

// add -- 添加一条答题记录
exports.add = (req, res) => {
  // res.send('test_recording add api')
  const openid = req.body.openid
  const score = req.body.score
  const q1_q10 = req.body.q1_q10
  const ans1_ans10 = req.body.ans1_ans10
  const my1_my10 = req.body.my1_my10
  // 1.更新答题记录表
  const sql  =  `insert into test_record (openid, score, q1_q10, ans1_ans10, my1_my10) values (?, ?, ?, ?, ?)`
  db.query(sql, [openid, score, q1_q10, ans1_ans10, my1_my10], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('插入答题数据失败')
    // 2.更新用户的排行总榜的分数
    // 2.1查询用户的 总分 数据
    const sql2 = `select credit, total_score from users where openid = ?`
    db.query(sql2, openid, (err, results) => {
      if(err) return res.cc(err)
      if (results.length !== 1) return res.cc('插入答题记录成功，但查询用户总分数失败')
      const total_score = Number(results[0].total_score) + Number(score)
      const total_credit = Number(score/10) + Number(results[0].credit)
      // 2.2 插入新的排行总分并增加用户积分
      const sql3 = `update users set total_score=?, credit=? where openid = ?`
      db.query(sql3, [total_score, total_credit, openid], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('插入答题记录成功，但更新用户总分数或积分失败')
        res.send({
          status: 0,
          msg: '插入答题数据成功,并更新用户总分数成功',
        })
      })
    })
    
  })


}

// history -- 查询用户的所有答题记录
exports.history = (req, res) => {
  // res.send('test_recording history api')
  const openid = req.body.openid
  const sql = `select * from test_record where openid =?`
  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    if (results.length === 0) return res.cc('没有查询到该用户的答题记录信息')
    res.send({
      status: 0,
      msg: '查询到该用户的答题信息',
      data: results,
    })
  })
}