const express = require("express")

const { commonErrors } = require("../../errors/error")
const { likeNewsController, getLikeNewsController } = require("../../controller/newsController/newsLike.controller")

const routes = express.Router()

routes.post("/", likeNewsController)

routes.get("/:newsId", getLikeNewsController)

routes.use(commonErrors)

module.exports = routes