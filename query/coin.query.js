const coinModel = require("../models/coin.model")

const createCoinQuery = async (details) => {

    const { name } = details

    const existing = await coinModel.paginate({ name: { $regex: `^${name}`, $options: "i" } }, {})

    if (existing.docs.length) {
        return {
            status: false,
            statusCode: 400,
            message: "Coin name already exist"
        }
    }

    try {
        const coin = new coinModel(details)
        await coin.save();
        return {
            status: true,
            statusCode: 200,
            message: "Coin created",
            coin
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getCoinsQuery = async (status, page, limit) => {
    try {

        const options = {
            page: page,
            limit: limit
        }

        const coins = await coinModel.paginate({ status: { $regex: `^${status}`, $options: "i" } }, options)

        return res = {
            status: true,
            statusCode: 200,
            coins
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

const deleteCoinQuery = async (ids) => {
    try {
        ids = JSON.parse(ids)
        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of coin IDs"
            }
        }

        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/))

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDb ObjectId(s)",
                inValidIds
            }
        }

        const result = await coinModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} coin(s) delete successfully`,
            deletedCount: result.deletedCount
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

const editCoinQuery = async (details) => {
    try {
        console.log({ details })
        const coin = await coinModel.findByIdAndUpdate(details._id, details, { new: true, runValidators: true })
        if (!coin) {
            return {
                status: false,
                statusCode: 404,
                message: "Coin not found"
            }
        }

        return {
            status: true,
            statusCode: 200,
            message: "Coin updated",
            coin
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getCoinStatsQuery = async () => {
    try {
        const upcomingCount = await coinModel.countDocuments({ status: "upcoming" });
        const launchedCount = await coinModel.countDocuments({ status: "launched" });
        const totalCount = await coinModel.countDocuments({});

        return {
            status: true,
            statusCode: 200,
            data: {
                upcoming: upcomingCount,
                launched: launchedCount,
                total: totalCount,
            },
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message,
        };
    }
};

module.exports = {
    createCoinQuery,
    getCoinsQuery,
    deleteCoinQuery,
    editCoinQuery,
    getCoinStatsQuery
}