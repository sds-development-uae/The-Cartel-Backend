const { createMarketplaceCategoryQuery, getMarketplaceCategoryListQuery, editMarketplaceCategoryQuery, deleteMarketplaceCategoryQuery } = require("../../query/marketplaceQuery/marketplaceCategory.query")

const createMarketplaceCategoryController = async (req, res, next) => {
    try {
        const response = await createMarketplaceCategoryQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getMarketplaceCategoryListController = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query
        console.log({ search })
        const response = await getMarketplaceCategoryListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const editMarketplaceCategoryController = async (req, res, next) => {
    try {
        const response = await editMarketplaceCategoryQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const deleteMarketplaceController = async (req, res, next) => {
    try {
        const response = await deleteMarketplaceCategoryQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createMarketplaceCategoryController,
    getMarketplaceCategoryListController,
    editMarketplaceCategoryController,
    deleteMarketplaceController
}