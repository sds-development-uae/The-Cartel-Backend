const { createNewsUpdateQuery } = require("../query/newsUpdate.query")


const createNewsUpdateController = async (req, res, next) => {
    try {
        const response = await createNewsUpdateQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNewsUpdateController
}