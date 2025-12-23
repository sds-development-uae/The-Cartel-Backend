const { createTokenSubmissionQuery, getTokenSubmissionQuery, deleteTokenSubmissionQuery, updateTokenSubmissionsQuery } = require("../query/tokenSubmission.query")

const createTokenSubmissionController = async (req, res, next) => {
    try {
        const response = await createTokenSubmissionQuery(req.body)

        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getTokenSubmissionController = async (req, res, next) => {
    try {
        const { page, limit } = req.query
        const response = await getTokenSubmissionQuery(Number(page) || 1, Number(limit) || 10)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const updateTokenSubmissionsController = async (req, res, next) => {
    try {
        const response = await updateTokenSubmissionsQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deleteTokenSubmissionController = async (req, res, next) => {
    try {
        const response = await deleteTokenSubmissionQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createTokenSubmissionController,
    getTokenSubmissionController,
    updateTokenSubmissionsController,
    deleteTokenSubmissionController,

}