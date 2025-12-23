const { createConsultancyQuery, getConsultationQuery, deleteConsultationQuery, updateConsultationQuery } = require("../query/consultancy.query")




const createConsultancyController = async (req, res, next) => {
    try {

        const response = await createConsultancyQuery(req.body)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const getConsultationController = async (req, res, next) => {
    try {
        const { page, limit } = req.query

        const response = await getConsultationQuery(Number(page) || 1, Number(limit) || 10)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const updateConsultationController = async (req, res, next) => {
    try {
        const response = await updateConsultationQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const deleteConsultationController = async (req, res, next) => {
    try {
        const response = await deleteConsultationQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createConsultancyController,
    getConsultationController,
    deleteConsultationController,
    updateConsultationController
}