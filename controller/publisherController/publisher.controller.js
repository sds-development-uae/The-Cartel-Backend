const { createPublisherQuery, getPublisherQuery, deletePublisherQuery, updatePublisherQuery, verifyWebsiteByMetaQuery } = require("../../query/publisherQuery/publisher.query")



const createPublisherController = async (req, res, next) => {
    try {
        const response = await createPublisherQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getPublisherController = async (req, res, next) => {
    try {

        const { page, limit, accountType, search } = req.query

        const response = await getPublisherQuery({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            accountType: accountType || "all",
            search: search || ""
        })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const updatePublisherController = async (req, res, next) => {
    try {
        const response = await updatePublisherQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deletePublisherController = async (req, res, next) => {
    try {
        const response = await deletePublisherQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const verifyWebsiteByMetaController = async (req, res, next) => {
    try {
        const response = await verifyWebsiteByMetaQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createPublisherController,
    getPublisherController,
    deletePublisherController,
    updatePublisherController,
    verifyWebsiteByMetaController
}