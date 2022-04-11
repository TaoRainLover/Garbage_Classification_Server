const express = require('express')
const cors = require('cors')
// 导入服务器所需的路由模块
const userRouter = require('./routers/user.js')
const gcRouter = require('./routers/garbage_collection')
const creditRouter = require('./routers/credit.js')
const giftRouter = require('./routers/gift.js')
const medalRouter = require('./routers/medal')
const newsRouter = require('./routers/news')
const trRouter = require('./routers/test_recording')
const rankingRouter = require('./routers/ranking')
const feedbackRouter = require('./routers/feedback')
const adminRouter = require('./routers/admin.js')
const SH_Router = require('./routers/search_history')


// 创建我的服务器实例
const server = express()

//修改限制大小
var bodyParser = require('body-parser');
server.use(bodyParser.json({limit:'50mb'}));
server.use(bodyParser.urlencoded({limit:'50mb',extended:true}));


// 配置解析 application/json 格式数据的内置中间件
server.use(express.json())

// 配置解决跨域的中间件
server.use(cors())

// 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
server.use(express.urlencoded({extended: false}))

// 响应数据的中间件
server.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 挂载路由模块
server.use('/api/user', userRouter)
server.use('/api/gc', gcRouter)
server.use('/api/credit', creditRouter)
server.use('/api/gift', giftRouter)
server.use('/api/medal', medalRouter)
server.use('/api/news', newsRouter)
server.use('/api/tr', trRouter)
server.use('/api/ranking', rankingRouter)
server.use('/api/feedback', feedbackRouter)
server.use('/api/admin', adminRouter)
server.use('/api/sh', SH_Router)

// 定义错误级别的中间件，用来捕获服务器发生的异常，从而防止服务器进行崩溃
server.use((err, req, res, next) => {
  console.log('发生了错误' + err.message)
  // token 解析失败导致的
  if (err.name === 'UnauthorizedError') {
    res.send({
      status: 401,
      message: '无效的token'
    })
  }
  
  // 未知错误
  res.cc(err)
  
})


// 运行在8001端口
server.listen(8001, () => {
  console.log('My GD server is running at the http://39.103.179.63:8001!')
})