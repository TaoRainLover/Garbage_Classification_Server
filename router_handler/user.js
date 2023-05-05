// 用户路由模块的处理函数
const axios = require('axios');
const miniprogramConfig = require('../miniprogramConfig')
const db = require('../db/index')
const my_date = require('../utils/my_date')
var qs = require('querystring')

// info -- 查询用户的信息
const info = (req, res) => {
  const openid =req.body.openid
  // console.log(openid)
  
  const sql = 'select * from users where openid=?'
  db.query(sql, openid, (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (results.length === 0) return res.cc('获取用户信息失败！')
    // 3. 将用户信息响应给客户端
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      userInfo: results[0],
    })
  })
}

// login -- 登陆
exports.login = async function(req, res){
  // 请求地址
  // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
  // appid: 微信小程序 appid
  // secret: 微信小程序 secret

  // 1. 获取用户端的 code 
  const code = req.body.code
  // code = '123'

  // 2. 换取用户的 openid 
  requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${miniprogramConfig.appid}&secret=${miniprogramConfig.secret}&js_code=${code}&grant_type=authorization_code`
  // console.log(requestUrl)
  const {data} = await axios.get(requestUrl)
  // console.log(data)
  
  // res.send(data)
  const openid = data.openid


  // 3.相关的业务代码 -- 查询用户的信息
  sql = `select * from users where openid=?`
  db.query(sql, [openid], (err, results) => {
    if(err) return res.cc(err)
    if (results.length === 0){
      // 3.1 查询该用户在数据库的信息，若不存在该用户的信息，表明该用户第一次使用小程序，需要初始化用户的信息
      // 1. 初始化用户表
      const sql1 = `insert into users (openid) value (?)`
      db.query(sql1, openid, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('初始化用户信息失败')
        // 初始化用户表成功
        return res.send({
          status: 0,
          msg: '用户初次登录，初始化用户信息成功！',
          userInfo: {
            openid: openid,
            nickName: null,
            avatarUrl: null,
            credit: 0,
            cur_medal: "萌新报道",
            id: 11,
            owned_medal_list: "萌新报道",
            status: 0,
            total_score: 0,
          }
        })
      }) 

    }else {
      
      // 3.2若用户存在,返回用户的信息
      res.send({
        status: 0,
        msg: '登陆成功',
        userInfo: results[0]
      })
    }
  })
}

// signIn -- 签到（改为积分）
exports.signIn = (req, res) => {
  const openid = req.body.openid
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
      db.query(sql3, [openid, '签到奖励', 15], (err, results) => {
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

// sigin_record -- 获取用户这周的签到记录 
exports.sigin_week_record = (req, res) => {
  const openid = req.body.openid

  let sql = `SELECT distinct WEEKDAY(date) as day_of_week, type, openid FROM credit_record WHERE YEARWEEK(date_format(date,'%Y-%m-%d')) = YEARWEEK(now()) and WEEKDAY(date) != 6 and openid=? and type='签到奖励';`

  // 判断今天是否是 周日
  if(new Date().getDay() == 0) {
    sql = `SELECT distinct WEEKDAY(date) as day_of_week, openid, type  FROM credit_record WHERE (YEARWEEK(date_format(date,'%Y-%m-%d')) = YEARWEEK(now()) and WEEKDAY(date) =6 and openid=? and type='签到奖励') or (YEARWEEK(date_format(date,'%Y-%m-%d')) = (YEARWEEK(now())-1) and WEEKDAY(date) !=6 and openid='o_McM5oh6-Sd2OpaOZyh0XmqPYU4' and type='签到奖励' );`
  }

  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    if(results.length == 0){
      return res.send({
        status: 0,
        msg: '未查询到本周的签到信息'
      })
    }
    res.send({
      status: 0,
      msg: '查询到本周的签到信息',
      data: results
    })
  })
}

// sigin_today -- 判断用户今日是否完成签到
exports.sigin_today = (req, res) => {
  const openid = req.body.openid

  const sql = `select id from credit_record where openid=? and type='签到奖励' and to_days(date) = to_days(now())`

  db.query(sql, openid, (err, results) => {
    if(err) return res.cc(err)
    // 结果条数大于 0, 说明用户已经签到
    if(results.length > 0) return res.cc('用户已签到', status = 0)

    res.send({
      status: 0,
      msg: '用户今日暂未签到'
    })
  })

}

// user_list -- 获取用户列表(分页查询)
exports.user_list = (req, res) => {
  // console.log(req.params)
  // console.log(req.query)
  // console.log(req.body)
  
  const index = req.body.pageIndex
  const size = Number(req.body.pageSize)
  const offset = (Number(index) - 1)*size
  const sql = 'select * from users where nickname is not null limit '+size+' offset '+offset
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if(results.length === 0) return res.cc('获取用户列表数据失败')
    results = my_date.date_format3(results)
    // console.log(results)
    
    return res.send({
      status: 0,
      msg: '获取用户列表数据成功',
      data: results
    })
  })
}

// query -- 通过用户名或openid查询用户信息
exports.query = (req, res) => {
  const type = req.body.type
  const info = '%' +req.body.info+'%'

  const sql = 'select * from users where '+type+' like ? and nickname is not null'

  db.query(sql, [info], (err, results) => {
    if(err) return res.cc(err)
    if(results.length === 0) return res.cc('查询用户数据失败')
    res.send({
      staus: 0,
      msg: '查询用户数据列表成功',
      list: results
    })
  })


}
