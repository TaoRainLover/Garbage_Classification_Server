const express = require('express')

const feedbackHandler = require('../router_handler/feedback')

const feedbackRouter = express.Router()

feedbackRouter.post('/submit', feedbackHandler.submit)

feedbackRouter.post('/lists', feedbackHandler.lists)

module.exports = feedbackRouter