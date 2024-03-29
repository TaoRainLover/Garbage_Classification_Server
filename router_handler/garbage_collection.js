// 垃圾分类库查询模块的处理函数

// 导入数据库模块
const db = require('../db/index')
const axios = require('axios')
const qs = require('querystring')
const my_date = require('../utils/my_date')
// list-common -- 查询对应垃圾类别常见的一些生活垃圾
// 要求：使用分页查询-
// 参数1 -- 页码
// 参数2 -- 垃圾类别 1(可回收物) 2(有害垃圾) 3(厨余垃圾) 4(其他垃圾)
exports.list_common = (req, res)=>{
  // res.send('获取常见垃圾的列表数据成功')
  const table = 'garbage_collection1'
  const page = req.body.page // 从 1 开始
  const type = req.body.type
  // 1.可回收物
  // 2.
  const count = 30 // 每次查询数据的条数
  const offset = (page - 1)*count
  const sql = "select name from "+table+" where type=? limit ? offset ?"
  db.query(sql, [type, count, offset], (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('未查询到对应类别的数据')
    res.send({
      status: 0,
      msg: '查询到'+results.length+'数据',
      data: results
    })
  })
}

// query -- 文字查询
// 模糊查询，查询所有包含带有搜索词的垃圾
exports.query = (req, res) => {
  let name = req.body.name
  let openid = req.body.openid

  // 1. 匹配搜索结果
  const sql = "select name, type from garbage_collection1 where name like ?;"
  search_name = '%'+name+'%'
  db.query(sql, search_name, (err, results) => {
    if(err) return res.cc(err)
    if (results.length === 0) return res.cc('未匹配到相关的信息，请换个搜索词再试')

    // 2.插入一条搜索数据
    const sql2 = `insert into search_record (openid, name, num_res) values (?, ?, ?)`
    db.query(sql2, [openid, name, results.length], (err, results2) => {
      if(err) return res.cc(err)
      if(results2.affectedRows !== 1) return res.send({
        status: 0,
        msg: '匹配到相关的数据,但插入搜索记录失败',
        data: results
      })
      res.send({
        status: 0,
        msg: '匹配到相关的数据,且插入搜索记录成功',
        data: results
      })
    })

    
  })
}

// query_img -- 图片查询
// 步骤：
// 1. 接收用户传递的 base64 图片数据
// 2. 获取百度识图查询 token 
// 3. 通过百度识图 API 查询图片结果
exports.query_img = async function(req, res){
  // res.send('图片查询')
  // 1. 接收用户传递的 base64 图片数据
  const img_base64 = req.body.img
  // 2. 获取百度识图查询 token 
  const { data } = await axios
  .get('https://aip.baidubce.com/oauth/2.0/token', {
    params: {
      grant_type: 'client_credentials',
      client_id: 'jXVOAhea8xYiNoRzUO2553Uy',
      client_secret: 'rydmA7j7zwmrsTzykIxfFvsBCwE1Gbv1'
    }
  })
  // 3. 通过百度识图 API 查询图片结果
  imgData = {image: img_base64}
  const access_token = data.access_token
  const { data:results } = await axios.post('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + access_token, qs.stringify(imgData))
  
  const resList = results.result
  // 对返回的数据进行处理
  // console.log(resList)
  for(let i=0; i<resList.length; i++){
    resList[i].score =  Math.floor(resList[i].score * 1000) / 10
    resList[i].status = false
  }
  res.send({
    stutas: 0,
    msg: '查询成功',
    data: resList
  })
  
}

// qeury_voice -- 语音查询(由小程序前台向百度识图API服务器发起请求)
// 1. 接收用户传送的 语音 数据
// 2. 获取百度语音识别的 token
// 3. 通过百度识图 api 返回语音数据
exports.query_voice = async function(req, res){
  // res.send('语音查询')

  // appid :25937032
  // api key: eee2OGMye9NCSjFcncLrFIYv
  // secret key: b23GzAnoDucrDQsMCMAcWe5MCXoqS62q
  
  // 获取百度语音识别的 token
  const { data } = await axios
  .get('https://aip.baidubce.com/oauth/2.0/token', {
    params: {
      grant_type: 'client_credentials',
      client_id: 'eee2OGMye9NCSjFcncLrFIYv',
      client_secret: 'b23GzAnoDucrDQsMCMAcWe5MCXoqS62q'
    }
  })
  // console.log(data)
  // res.send(data)
  const access_token = data.access_token

}

// test_list -- 给出随机的十条测试垃圾分类题
// 仅包含题目和答案
exports.test_list = (req, res) => {
  const sql = 'SELECT name, type FROM garbage_collection1 WHERE id >= ((SELECT MAX(id) FROM garbage_collection1)-(SELECT  MIN(id) FROM garbage_collection1)) * RAND() + (SELECT MIN(id) FROM garbage_collection1) LIMIT 10;'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 10) return res.cc('获取试题列表数据失败')
    res.send({
      status: 0,
      msg: '获取试题列表数据成功',
      lists: results
    })
  })
}


// add -- 添加一条新的垃圾分类信息
exports.add = (req, res) => {
  const type = req.body.type
  const name = req.body.name
  // 查询数据库中是否已经存在
  const sql1 = `select * from garbage_collection1 where name = ?`
  db.query(sql1, name, (err, results) => {
    if(err) return res.cc(err)
    if(results.length > 0) return res.cc('数据库中已存在')
    // 添加
    const sql2 = `insert into garbage_collection1 (name, type) values (?, ?)`
    db.query(sql2, [name, type], (err, results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc('添加失败')
      res.send({
        status: 0,
        msg: '添加成功',
      })
    })
  })
  

  
}


exports.query_by_text = (req, res) => {
  const text = '%'+req.body.name+'%'

  const sql = 'select * from garbage_collection1 where name like ?'

  db.query(sql, text, (err, results) => {
    if(err) return res.cc(err)
    if(results.length === 0) return res.cc('未查询到相关信息')
    results = my_date.date_format5(results)
    res.send({
      status: 0,
      msg: '查询到相关的垃圾数据信息',
      list: results
    })
  })
}


// query_by_type -- 按照类别进行分页查询
exports.query_by_type = (req, res) => {
  const type = req.body.type
  const pageIndex = req.body.pageIndex
  
  const pageSize = req.body.pageSize

  const offset = (pageIndex -1) * pageSize
  
  const sql = 'select * from garbage_collection1 where type=? limit '+pageSize+' offset ?'

  db.query(sql, [type, offset], (err, results) => {
    if(err) return res.cc(err)
    if(results.length === 0) return res.cc('未查询到相关信息')
    results = my_date.date_format5(results)
    res.send({
      status: 0,
      msg: '查询到相关的垃圾数据信息',
      list: results
    })
  })
}