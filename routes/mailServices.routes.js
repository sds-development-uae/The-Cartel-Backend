const express = require("express");
const { commonErrors } = require("../errors/error");
const { contactFormController } = require("../controller/mailService.controller");
const router = express.Router();


router.post("/form-submit", contactFormController)

router.use(commonErrors)

module.exports = router