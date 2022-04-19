const express = require('express')

const trHandler = require('../router_handler/test_recording')

const trRouter = express.Router()

trRouter.post('/add', trHandler.add)
trRouter.post('/history', trHandler.history)
trRouter.post('/hh', trHandler.history_highest)
trRouter.post('/count', trHandler.count)
trRouter.post('/cd', trHandler.count_day)

module.exports = trRouter