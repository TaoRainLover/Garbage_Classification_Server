const express  = require('express')

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user.js')

// 创建用户路由模块实例
const userRouter = express.Router()

// 定义用户模块相应的api
userRouter.post('/login', userHandler.login)
userRouter.post('/signin', userHandler.signIn)
userRouter.post('/info', userHandler.info)
userRouter.post('/update', userHandler.update)


// 导出用户路由模块实例
module.exports = userRouter