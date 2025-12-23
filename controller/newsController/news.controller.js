const { createNewsQuery, getNewsQuery, deleteNewsQuery, updateNewsQuery, getNewsBySlugQuery } = require("../../query/newsQuery/news.query")



const createNewsController = async (req, res, next) => {
    try {
        const response = await createNewsQuery(req.body)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const getNewsController = async (req, res, next) => {
    try {
        const response = await getNewsQuery(Number(req.query.page) || 1, Number(req.query.limit) || 10, req.query.parentCategoryName, req.query.subCategoryName)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const deleteNewsController = async (req, res, next) => {
    try {
        const response = await deleteNewsQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const updateNewsController = async (req, res, next) => {
    try {
        const response = await updateNewsQuery(req.body)
        return res.send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const getNewsBySlugController = async (req, res, next) => {
    try {

        const response = await getNewsBySlugQuery(req.query.slug)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNewsController,
    getNewsController,
    deleteNewsController,
    updateNewsController,
    getNewsBySlugController
}