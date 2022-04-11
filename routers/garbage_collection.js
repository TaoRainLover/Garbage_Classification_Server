const express = require('express')

const gcHandler = require('../router_handler/garbage_collection')

gcRouter = express.Router()

// list-common -- 查询对应垃圾类别常见的一些生活垃圾
gcRouter.post('/lc', gcHandler.list_common)
gcRouter.post('/query', gcHandler.query)
gcRouter.post('/qi', gcHandler.query_img)
gcRouter.post('/qv', gcHandler.query_voice)
gcRouter.post('/tl', gcHandler.test_list)

module.exports = gcRouter