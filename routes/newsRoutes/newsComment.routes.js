const express = require("express")
const { addCommentController } = require("../../controller/newsController/newsComment.controller")
const { commonErrors } = require("../../errors/error")

const routes = express.Router()

routes.post("/", addCommentController)

routes.use(commonErrors)

module.exports = routes