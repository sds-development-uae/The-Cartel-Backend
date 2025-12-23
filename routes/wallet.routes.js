const express = require("express")
const { addWalletController, getWalletController } = require("../controller/wallet.controller")
const adminOnly = require("../services/role.service")
const router = express.Router()


router.post('/add', addWalletController)

router.get('/get', adminOnly, getWalletController)

module.exports = router