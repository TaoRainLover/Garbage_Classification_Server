const db = require('../db/index')

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

// lists -- 管理员查询反馈列表数据
// 进行分页查询
exports.lists = (req, res) => [
  // res.send('feedback lists api')
  // const sql = ``
]