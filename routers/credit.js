const express = require('express')

const creditHandler = require('../router_handler/credit')

const creditRouter = express.Router()

creditRouter.post('/add', creditHandler.add)

creditRouter.post('/history', creditHandler.history)

module.exports = creditRouter