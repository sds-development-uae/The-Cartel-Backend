const express = require("express");
const { commonErrors } = require("../errors/error");
const { createTokenSubmissionController, getTokenSubmissionController, deleteTokenSubmissionController, updateTokenSubmissionsController } = require("../controller/tokenSubmission.controller");
const router = express.Router();

router.post("/", createTokenSubmissionController)

router.get("/", getTokenSubmissionController)

router.post("/update", updateTokenSubmissionsController)

router.delete("/", deleteTokenSubmissionController)


router.use(commonErrors)

module.exports = router