// 用户路由模块的处理函数
const axios = require('axios');
const miniprogramConfig = require('../miniprogramConfig')
const db = require('../db/index')
var qs = require('querystring')

// init -- 初始化
const init = (req, res, openid) => {
  // 1. 初始化用户表
  const sql1 = `insert into users (openid) value (?)`
  db.query(sql1, openid, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('初始化用户信息失败')
    // 初始化用户表成功
    return res.cc({
      status: 0,
      msg: '用户初次登录，初始化用户信息成功！',
      data: {
        openid,
      }
    })
  }) 
  
  
  res.send('初始化成功')
}

// info -- 查询用户的信息
const info = (req, res) => {
  console.log(req.body)
  const openid =req.body.openid
  const sql = 'select * from users where openid=?'
  db.query(sql, openid, (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) return res.cc('获取用户信息失败！')

    // 3. 将用户信息响应给客户端
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0],
    })
  })
}

// login -- 登陆
exports.login = (req, res) => {
  // 请求地址
  // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
  // appid: wxe9cd601820bec490
  // secret: 4abe32267216c0d2147d412d82434c02

  // 1. 获取用户端的 code 
  const code = req.body.code
  // code = '123'

  // TODO:2. 换取用户的 openid 
  requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${miniprogramConfig.appid}&secret=${miniprogramConfig.secret}&js_code=${code}&grant_type=authorization_code`
  console.log(requestUrl)
  // axios.get('https://api.weixin.qq.com/sns/jscode2session', )

  // 3.相关的业务代码 -- 查询用户的信息
  sql = `select * from users where openid=?`
  db.query(sql, [userInfo.uid], (err, results) => {
    if(err) return res.cc(err)
    if (results.length !== 0){
      // 3.1 查询该用户在数据库的信息，若不存在该用户的信息，表明该用户第一次使用小程序，需要初始化用户的信息
      init(req, res, openid)
    }
    // 3.2若用户存在,返回用户的信息
    res.send({
      status: 0,
      msg: '登陆成功',
      data: results[0]
    })
  })
}

// signIn -- 签到（改为积分）
exports.signIn = (req, res) => {
  const openid = req.body.openid
  const credit = 10
  // 1. 查询该用户的 积分 数量
  const sql = `select credit from users where openid=?`
  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('该用户信息不存在')
    // 签到一次增加 15 积分
    const credit = results[0].credit + 15
    // 2. 更新该用户的 积分 数量
    const sql2 = `update users set credit = ? where openid=?`
    db.query(sql2, [credit, openid], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) res.cc('更新用户积分失败')
      // 3. 添加一条积分记录
      const sql3 = `insert into credit_record (openid, type, credit, is_add) values (?, ?, ?, 1)`
      db.query(sql3, [openid, '用户签到', 15], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('签到信息插入积分表失败')
        res.cc('签到成功', status=0)
      })
    })

    
  })

}

// info -- 获取用户信息
exports.info = info

// update -- 更新用户头像和昵称
exports.update = (req, res) => {
  const openid = req.body.openid
  const avatarUrl = req.body.avatarUrl
  const nickName = req.body.nickName
  const sql = `update users set avatarUrl=?, nickName=? where openid=?`
  db.query(sql, [avatarUrl, nickName, openid], (err, results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('更新用户信息失败')
    res.cc('更新用户信息成功', status = 0)
  })
}

