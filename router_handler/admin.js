const db = require('../db/index')


// login -- 管理员登陆
exports.login = (req, res) => {
  const account = req.body.account
  const password = req.body.password
  
  const sql = `select password, name from admin where account=?`
  db.query(sql, account, (err, results) => {
    if(err) return res.cc(err)
    if(results.length == 0) return res.cc('没有该管理员信息')
    if(results[0].password != password) return res.cc('密码错误')
    res.send({
      status: 0,
      msg: '登录成功',
      data: {name: results[0].name}
    })
  })
}

// logout -- 管理员登出
exports.logout = (req, res) => {
  res.send('admin logout api')
}