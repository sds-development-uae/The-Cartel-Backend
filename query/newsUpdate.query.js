const newsUpdateModel = require("../models/newsUpdate.model");


const createNewsUpdateQuery = async (details) => {
    try {

        const { email } = details;

        const isPresent = await newsUpdateModel.findOne({ email })

        if (isPresent) {
            return {
                status: false,
                statusCode: 400,
                message: "Email already registerd"
            }
        }

        const createdNews = await newsUpdateModel.create({ email: email })

        if (createdNews) {
            return {
                status: true,
                statusCode: 201,
                message: "Thank you.",
                createdNews
            }
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
    createNewsUpdateQuery
}