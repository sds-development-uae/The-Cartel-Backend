const { createMembersQuery, getMembersQuery, deleteMembersQuery } = require("../query/members.query")



const createMembersController = async (req, res, next) => {
    try {
        const response = await createMembersQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getMembersController = async (req, res, next) => {
    try {
        const response = await getMembersQuery(Number(req.query.page) || 1, Number(req.query.limit) || 10)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deleteMembersController = async (req, res, next) => {
    try {
        const response = await deleteMembersQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createMembersController,
    getMembersController,
    deleteMembersController
}