const express = require("express");
const { commonErrors } = require("../errors/error");
const { createConsultancyController, getConsultationController, deleteConsultationController, updateConsultationController } = require("../controller/consultation.controller");
const router = express.Router();


router.post("/", createConsultancyController)

router.get("/", getConsultationController)

router.delete("/", deleteConsultationController)

router.post("/update", updateConsultationController)

router.use(commonErrors)

module.exports = router