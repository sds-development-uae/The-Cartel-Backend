const { getTagsListQuery } = require("../../query/newsQuery/tags.query")




const getTagListController = async (req, res, next) => {
    try {
        const response = await getTagsListQuery()
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTagListController
}