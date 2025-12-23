

const { getCategoryListQuery, createCategoryQuery, getSubcategoriesQuery, updateCategoryQuery, deleteCategoryQuery } = require("../../query/newsQuery/category.query")



const createCategoryController = async (req, res, next) => {
    try {
        const response = await createCategoryQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getCategoryListController = async (req, res, next) => {
    try {

        const { page, limit, search } = req.query

        const response = await getCategoryListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const getSubcategoriesController = async (req, res, next) => {
    try {

        const { page, limit, categoryName } = req.query

        const response = await getSubcategoriesQuery({ page: Number(page) || 1, limit: Number(limit) || 10, categoryName: categoryName })
        return res.send(response)


    } catch (error) {
        next(error)
    }
}

const updateCategoryController = async (req, res, next) => {
    try {

        const response = await updateCategoryQuery(req.body)
        console.log({ response })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

const deleteCategoryController = async (req, res, next) => {
    try {

        const response = await deleteCategoryQuery(req.query.ids)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCategoryListController,
    createCategoryController,
    getSubcategoriesController,
    updateCategoryController,
    deleteCategoryController
}