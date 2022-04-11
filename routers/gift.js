const express = require('express')

const giftHandler = require('../router_handler/gift.js')

const giftRouter = express.Router()

giftRouter.post('/lists', giftHandler.lists)

giftRouter.post('/exchange', giftHandler.exchange)


module.exports = giftRouter