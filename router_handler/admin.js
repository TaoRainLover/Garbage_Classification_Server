const db = require('../db/index')


// login -- 管理员登陆
exports.login = (req, res) => {
  res.send('admin login api')
}

// logout -- 管理员登出
exports.logout = (req, res) => {
  res.send('admin logout api')
}