const express = require('express')

const SH_Handler = require('../router_handler/search_history')

const SH_Router = express()

SH_Router.post('/add', SH_Handler.add)

SH_Router.post('/today', SH_Handler.history_today)

SH_Router.post('/before', SH_Handler.history_before)

module.exports = SH_Router