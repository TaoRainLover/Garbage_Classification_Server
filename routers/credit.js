const express = require('express')

const creditHandler = require('../router_handler/credit')

const creditRouter = express.Router()

creditRouter.post('/add', creditHandler.add)

creditRouter.post('/history', creditHandler.history)

creditRouter.post('/ha', creditHandler.history_add)

creditRouter.post('/hd', creditHandler.history_des)

module.exports = creditRouter