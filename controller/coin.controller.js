const coinModel = require("../models/coin.model")
const { createCoinQuery, getCoinsQuery, deleteCoinQuery, editCoinQuery, getCoinStatsQuery } = require("../query/coin.query")



const createCoinController = async (req, res, next) => {
    try {
        const response = await createCoinQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getCoinsController = async (req, res, next) => {
    try {
        const response = await getCoinsQuery(req.query.status, Number(req.query.page) || 1, Number(req.query.limit) || 10)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deleteCoinController = async (req, res, next) => {
    try {
        const response = await deleteCoinQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const editCoinController = async (req, res, next) => {
    try {
        const response = await editCoinQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getCoinStatsController = async (req, res, next) => {
    try {
        const stats = await getCoinStatsQuery();
        return res.send(stats);
    } catch (error) {
        console.log("Error in getCoinStatsController:", error);
        next(error);
    }
};


const createBulkCoins = async (req, res, next) => {
    try {
        const coins = req.body
        const result = await coinModel.insertMany(coins, { ordered: false });

        return res.send({
            status: true,
            statusCode: 201,
            message: `${coins.length} coins inserted successfully`,
            data: result
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createCoinController,
    getCoinsController,
    deleteCoinController,
    editCoinController,
    getCoinStatsController,
    createBulkCoins
}