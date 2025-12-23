const express = require("express")
const { createPlanController, getPlanController, deletePlanController } = require("../controller/plan.controller")
const { commonErrors } = require("../errors/error")
const router = express.Router()


router.post("/", createPlanController)

router.get("/", getPlanController)

router.delete("/", deletePlanController)

router.use(commonErrors)

module.exports = router