const nichesModel = require("../../models/marketplaceModel/niches.model")

const createNichesQuery = async (details) => {
    try {
        const { name, createdBy } = details

        if (!name) {
            return {
                status: false,
                statusCode: 400,
                message: "Name is required"
            }
        }

        const normalizedName = name.toLowerCase().trim()

        const isExist = await nichesModel.findOne({ name: normalizedName })

        if (isExist) {
            return {
                status: false,
                statusCode: 400,
                message: "Niche already exists"
            }
        }

        const niches = await nichesModel.create({
            name: normalizedName,
            createdBy: createdBy
        })

        return {
            status: true,
            statusCode: 201,
            message: "New niche created",
            niches
        }

    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: "Internal server error"
        }
    }
}


const getNichesListQuery = async () => {
    try {

        const options = {
            populate: [
                { path: "createdBy", select: "email" }
            ]
        }

        const niches = await nichesModel.paginate({ isActive: true }, options)

        return {
            status: true,
            statusCode: 200,
            niches
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: message.error
        }
    }
}


const editNichesQuery = async (details) => {
    try {
        const niches = await nichesModel.findByIdAndUpdate(details._id, details, { new: true, runValidators: true })
        if (!niches) {
            return {
                status: false,
                statusCode: 404,
                message: "Niches not found"
            }
        }

        return {
            status: true,
            statusCode: 200,
            message: "Niches updated",
            niches
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: message.error
        }
    }
}

const deleteNichesQuery = async (ids) => {
    try {
        ids = JSON.parse(ids)
        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of niches IDs"
            }
        }

        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/))

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDb ObjectId(s)",
                inValidIds
            }
        }

        const result = await nichesModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} niches(s) delete successfully`,
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
    createNichesQuery,
    getNichesListQuery,
    getNichesListQuery,
    editNichesQuery,
    deleteNichesQuery
}
