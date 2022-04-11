const db = require('../db/index.js')


// lists -- 查询礼品数据
exports.lists = (req, res) => {
  // res.send('gift lists api')
  const sql = 'select * from gift_list'
  db.query(sql, (err, results) => {
    if(err) return res.cc(err)
    if (results.length === 0) return res.cc('查询礼品数据失败！')
    res.send({
      status: 0,
      msg: '查询礼品数据成功',
      data: results
    })
  })

}


// exchange = 兑换礼品（搁置）
exports.exchange = (req, res) => {
  res.send('gift exchange api')
}

