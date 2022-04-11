const express = require('express')

const newsHandler = require('../router_handler/news')

const newsRouter = express.Router()

newsRouter.post('/lists', newsHandler.lists)

newsRouter.post('/item', newsHandler.item)

module.exports = newsRouter