const planModel = require("../models/plan.model");


const createPlanQuery = async (details) => {
    try {
        const { name, price, oldPrice, duration, isBestValue } = details;

        const plan = await planModel.create({
            name,
            price,
            oldPrice,
            duration,
            isBestValue
        });

        return {
            status: true,
            statusCode: 201,
            message: "Plan created successfully",
            plan
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

const getPlanQuery = async () => {
    try {
        const plans = await planModel.find()

        plans.sort((a, b) => Number(a.price) - Number(b.price))

        return {
            status: true,
            statusCode: 200,
            data: plans
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const deletePlanQuery = async (ids) => {
    try {
        ids = JSON.parse(ids)

        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of members id"
            }
        }

        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/))

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDB ObjectId(s)",
                inValidIds
            }
        }


        const result = await planModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} plan(s) delete successfully`,
            deletedCount: result.deletedCount
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = {
    createPlanQuery,
    getPlanQuery,
    deletePlanQuery
}