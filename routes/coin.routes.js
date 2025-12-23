const express = require("express");
const { createCoinController, getCoinsController, deleteCoinController, editCoinController, getCoinStatsController, createBulkCoins } = require("../controller/coin.controller");
const { commonErrors } = require("../errors/error");
const router = express.Router();


router.post("/", createCoinController)

router.get("/", getCoinsController)

router.delete("/", deleteCoinController)

router.post("/update", editCoinController)

router.get("/stats", getCoinStatsController)

router.post("/bulk", createBulkCoins)

router.use(commonErrors)

module.exports = router