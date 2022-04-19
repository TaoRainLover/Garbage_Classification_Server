const db = require('../db/index')


// lists -- 查询答题排行榜（前50）
exports.lists = (req, res) => {
  const sql =  `select openid, nickName, avatarUrl, total_score from users order by total_score desc limit 50 offset 0`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('查询失败')
    res.send({
      status: 0,
      msg: '查询成功',
      data: results,
    })
  })
}
