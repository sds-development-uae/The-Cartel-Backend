const { default: tagModel } = require("../../models/newsModel/tag.model")


const getTagsListQuery = async () => {
    try {
        const tags = await tagModel.find()

        return {
            status: true,
            statusCode: 200,
            tags
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 200,
            message: error.message
        }
    }
}

module.exports = {
    getTagsListQuery
}