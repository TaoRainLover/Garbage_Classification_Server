const express = require('express')

const adminHandler = require('../router_handler/admin')

const adminRouter = express.Router()

adminRouter.post('/login', adminHandler.login)

adminRouter.post('/logout', adminHandler.logout)

module.exports = adminRouter
