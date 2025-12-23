const { createPlanQuery, getPlanQuery, deletePlanQuery } = require("../query/plan.query")



const createPlanController = async (req, res, next) => {
    try {
        const response = await createPlanQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getPlanController = async (req, res, next) => {
    try {
        const response = await getPlanQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deletePlanController = async (req, res, next) => {
    try {
        const response = await deletePlanQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPlanController,
    getPlanController,
    deletePlanController
}