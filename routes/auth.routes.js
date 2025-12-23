const express = require("express")
const { authController, refreshController, logoutController, signUpController, verifyOtpController, resendOtpController, forgotPasswordController } = require("../controller/auth.controller")
const { commonErrors } = require("../errors/error")
const router = express.Router()

router.post('/sign-in', authController)

router.post('/sign-up', signUpController)

router.post('/verify-otp', verifyOtpController)

router.post('/resend-otp', resendOtpController)

router.post("/forgot-password", forgotPasswordController)

router.post('/refresh', refreshController)

router.post('/logout', logoutController)

router.use(commonErrors)

module.exports = router