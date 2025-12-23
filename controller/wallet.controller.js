
const asyncHandler = require("express-async-handler")
const { addWalletQuery, getWalletQuery } = require("../query/wallet.query")

const addWalletController = asyncHandler(async (req, res, next) => {
    try {
        const response = await addWalletQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
})

const getWalletController = asyncHandler(async (req, res, next) => {
    try {
        const response = await getWalletQuery(Number(req.query.page) || 1, Number(req.query.limit) || 10, req.query.search)
        return res.send(response)
    } catch (error) {
        next(error)
    }
})


module.exports = {
    addWalletController,
    getWalletController
}