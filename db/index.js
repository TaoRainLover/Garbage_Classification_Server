// 导入 mysql 模块
const mysql = require('mysql')

const db = mysql.createPool({
  // 39.103.179.63
  host: '127.0.0.1',
  user: 'root',
  password: 'tao.151413',
  database: 'my_gd_db'
})

// user = {uid: '1234', uname: 'pengpai'}
// // sql = 'select * from users;'
// sql = 'insert into users (uid, uname) values (?, ?);'

// db.query(sql, [user.uid, user.uname], (err, res) => {
//   if(err) console.log(err.message)
//   console.log(res)
  
// })

module.exports = db