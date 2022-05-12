const express = require('express')

const feedbackHandler = require('../router_handler/feedback')

const feedbackRouter = express.Router()

feedbackRouter.post('/submit', feedbackHandler.submit)

feedbackRouter.post('/lists', feedbackHandler.lists)

feedbackRouter.post('/lr', feedbackHandler.lists_read)
feedbackRouter.post('/ld', feedbackHandler.lists_deleted)



module.exports = feedbackRouter