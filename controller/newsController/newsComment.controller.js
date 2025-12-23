const { addCommentQuery } = require("../../query/newsQuery/newsComment.query")



const addCommentController = async (req, res, next) => {
    try {
        const response = await addCommentQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addCommentController
}