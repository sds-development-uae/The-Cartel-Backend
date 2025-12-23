const express = require("express")
const { commonErrors } = require("../errors/error")
const { createMembersController, getMembersController, deleteMembersController } = require("../controller/members.controller")
const router = express.Router()


router.post("/", createMembersController)

router.get("/", getMembersController)

router.delete('/', deleteMembersController)

router.use(commonErrors)

module.exports = router