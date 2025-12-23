const express = require("express")
const { commonErrors } = require("../../errors/error")
const { createNewsController, getNewsController, deleteNewsController, updateNewsController, getNewsBySlugController } = require("../../controller/newsController/news.controller")
const router = express.Router()

router.post("/", createNewsController)

router.get("/", getNewsController)

router.delete("/", deleteNewsController)

router.post("/update", updateNewsController)

router.get("/slug", getNewsBySlugController)

router.use(commonErrors)

module.exports = router