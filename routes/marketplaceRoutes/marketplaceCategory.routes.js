const express = require("express")
const { commonErrors } = require("../../errors/error")
const adminOnly = require("../../services/role.service")
const { createMarketplaceCategoryController, getMarketplaceCategoryListController, editMarketplaceCategoryController, deleteMarketplaceController } = require("../../controller/marketplaceController/marketplaceCategory.controller")
const router = express.Router()

router.post('/', createMarketplaceCategoryController)

router.get('/', getMarketplaceCategoryListController)

router.post('/update', editMarketplaceCategoryController)

router.delete("/", deleteMarketplaceController)

router.use(commonErrors)

module.exports = router