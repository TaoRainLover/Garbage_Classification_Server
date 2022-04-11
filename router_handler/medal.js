const db = require('../db/index')

// add -- 用户添加新的勋章
exports.exchange = (req, res) => {
  // res.send('medal add api')
  const openid = req.body.openid
  const medal_name = req.body.name
  const credit = req.body.credit
  
  // 1. 查询用户的积分数据是否满足条件
  const sql1 = `select credit, owned_medal_list from users where openid=?`
  db.query(sql1, openid, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('未查询到该用户的积分数据')
    const credit_remain = results[0].credit - credit
    // 积分不足
    if(credit_remain  < 0) return res.cc('积分不足')
    // 用户已经拥有该勋章
    if(results[0].owned_medal_list.split('_').indexOf(medal_name) != -1) return res.cc('已经拥有该勋章，不可再兑换')

    // 积分足够
    const owned_medal_list = results[0].owned_medal_list + '_' + medal_name
    // 2. 更新用户的积分、勋章列表数据
    const sql2 = `update users set credit=?, owned_medal_list=? where openid=?`
    db.query(sql2, [credit_remain, owned_medal_list, openid], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新用户的积分、勋章列表数据失败')
      // 3. 插入用户的兑换积分数据
      const sql3 = `insert into credit_record (openid, type, credit, is_add) values (?, ?, ?, ?)`
      db.query(sql3, [openid, '勋章兑换', credit, 0], (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1){
          return res.send({
            status: 0,
            msg: '勋章兑换成功，但插入积分记录数据失败'
          })
        }
        res.send({
          status: 0,
          msg: '兑换成功！',
          data: {
            owned_medal_list,
            openid,
            credit_remain,
          }
        })
      })
    })    
  })
}

// query -- 查询用户已经拥有的勋章列表
exports.query = (req, res) => {
  // res.send('medal query list api')
  const openid = req.body.openid
  const sql = `select owned_medal_list from users where openid=?`
  db.query(sql, openid, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('查询该用户的勋章数据失败')
    medal_list = results[0].owned_medal_list.split('_')
    res.send({
      status: 0,
      msg: '查询该用户的勋章数据成功',
      data: medal_list
    })
  })
}

// update -- 更新用户当前佩戴的勋章
exports.update = (req, res) => {
  // res.send('update!')
  const openid = req.body.openid
  const name = req.body.name
  const sql = `update users set cur_medal=? where openid=?`
  db.query(sql, [name, openid], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更换用户勋章失败')
    res.send({
      status: 0,
      msg :'更换用户勋章成功',
      data: {
        openid,
        name
      }
    })
  })
}
