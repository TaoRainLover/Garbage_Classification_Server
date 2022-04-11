const express = require('express')

const trHandler = require('../router_handler/test_recording')

const trRouter = express.Router()

trRouter.post('/add', trHandler.add)
trRouter.post('/history', trHandler.history)

module.exports = trRouter