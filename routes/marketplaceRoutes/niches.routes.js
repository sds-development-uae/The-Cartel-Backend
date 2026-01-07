const express = require("express")
const { commonErrors } = require("../../errors/error")
const { createNichesController, getNichesListController, editNichesController, deleteNichesController } = require("../../controller/marketplaceController/niches.controller")
const adminOnly = require("../../services/role.service")
const router = express.Router()

router.post('/', adminOnly, createNichesController)

router.get('/', getNichesListController)

router.post('/update', adminOnly, editNichesController)

router.delete("/", adminOnly, deleteNichesController)

router.use(commonErrors)

module.exports = router