const express = require("express");
const { createCoinController, getCoinsController, deleteCoinController, editCoinController, getCoinStatsController, createBulkCoins } = require("../controller/coin.controller");
const { commonErrors } = require("../errors/error");
const authenticate = require("../middleware/auth.midleware");
const { requirePermission } = require("../middleware/permission.middleware");
const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Permission-protected routes
router.post("/", requirePermission("coins", "create"), createCoinController)
router.get("/", requirePermission("coins", "read"), getCoinsController)
router.delete("/", requirePermission("coins", "delete"), deleteCoinController)
router.post("/update", requirePermission("coins", "update"), editCoinController)
router.get("/stats", requirePermission("coins", "read"), getCoinStatsController)
router.post("/bulk", requirePermission("coins", "create"), createBulkCoins)

router.use(commonErrors)

module.exports = router