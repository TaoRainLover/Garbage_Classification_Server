const express = require('express')

const medalHandler = require('../router_handler/medal')

const medalRouter = express()

// add -- 用户添加新的勋章
medalRouter.post('/exchange', medalHandler.exchange)

// query -- 查询用户已经拥有的勋章列表
medalRouter.post('/query', medalHandler.query)

// update -- 更新用户当前佩戴的勋章
medalRouter.post('/update', medalHandler.update)

// lists -- 获取系统所有的勋章数据
medalRouter.post('/lists', medalHandler.lists)

module.exports = medalRouter