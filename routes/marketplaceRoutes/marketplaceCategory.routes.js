const express = require("express")
const { commonErrors } = require("../../errors/error")
const adminOnly = require("../../services/role.service")
const { createMarketplaceCategoryController, getMarketplaceCategoryListController, editMarketplaceCategoryController, deleteMarketplaceController } = require("../../controller/marketplaceController/marketplaceCategory.controller")
const router = express.Router()

router.post('/', adminOnly, createMarketplaceCategoryController)

router.get('/', getMarketplaceCategoryListController)

router.post('/update', adminOnly, editMarketplaceCategoryController)

router.delete("/", adminOnly, deleteMarketplaceController)

router.use(commonErrors)

module.exports = router