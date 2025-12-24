const express = require("express")
const { commonErrors } = require("../errors/error")
const { createNewsUpdateController } = require("../controller/newsUpdate.controller")
const router = express.Router()

router.post("/", createNewsUpdateController)

router.use(commonErrors)

module.exports = router