const express = require("express")
const { commonErrors } = require("../../errors/error")
const { getTagListController } = require("../../controller/newsController/tags.controller")
const router = express.Router()

router.get("/", getTagListController)

router.use(commonErrors)

module.exports = router