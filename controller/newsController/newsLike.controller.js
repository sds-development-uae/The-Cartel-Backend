const { likeNewsQuery, getLikeNewsQuery } = require("../../query/newsQuery/newsLike.query")


const likeNewsController = async (req, res, next) => {
    try {
        const response = await likeNewsQuery(req)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getLikeNewsController = async (req, res, next) => {
    try {
        const response = await getLikeNewsQuery(req)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    likeNewsController,
    getLikeNewsController
}