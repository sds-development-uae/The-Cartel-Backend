const { createNichesQuery, getNichesListQuery, editNichesQuery, deleteNichesQuery } = require("../../query/marketplaceQuery/niches.query")

const createNichesController = async (req, res, next) => {
    try {
        const response = await createNichesQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getNichesListController = async (req, res, next) => {
    try {
        const response = await getNichesListQuery()
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const editNichesController = async (req, res, next) => {
    try {
        const response = await editNichesQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const deleteNichesController = async (req, res, next) => {
    try {
        const response = await deleteNichesQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNichesController,
    getNichesListController,
    editNichesController,
    deleteNichesController
}