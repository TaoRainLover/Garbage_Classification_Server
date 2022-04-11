const express = require('express')

const rankingHandler = require('../router_handler/ranking')

const rankingRouter= express.Router()

rankingRouter.post('/lists', rankingHandler.lists)


module.exports = rankingRouter