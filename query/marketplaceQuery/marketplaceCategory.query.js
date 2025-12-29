const marketplaceCategoryModel = require("../../models/marketplaceModel/marketplaceCategory.model")

const createMarketplaceCategoryQuery = async (details) => {
    try {
        const { name, createdBy, parent } = details

        if (!name) {
            return {
                status: false,
                statusCode: 400,
                message: "Name is required"
            }
        }

        const normalizedName = name.toLowerCase().trim()

        const isExist = await marketplaceCategoryModel.findOne({ name: normalizedName })

        if (isExist) {
            return {
                status: false,
                statusCode: 400,
                message: "Category already exists"
            }
        }

        const marketplaceCategory = await marketplaceCategoryModel.create({
            name: normalizedName,
            createdBy: createdBy,
            parent: parent ? parent : null
        })

        return {
            status: true,
            statusCode: 201,
            message: "New category created",
            marketplaceCategory
        }

    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: "Internal server error"
        }
    }
}

const getMarketplaceCategoryListQuery = async ({ page, limit, search }) => {
    try {
        let query = { isActive: true }

        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" }
        }

        const marketplaceCategory =
            await marketplaceCategoryModel.paginate(query, {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: [
                    { path: "parent", select: "name" },
                    { path: "createdBy", select: "email" }
                ]
            })

        return {
            status: true,
            statusCode: 200,
            marketplaceCategory
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}



const editMarketplaceCategoryQuery = async (details) => {
    try {
        const marketplaceCategory = await marketplaceCategoryModel.findByIdAndUpdate(details._id, details, { new: true, runValidators: true })
        if (!marketplaceCategory) {
            return {
                status: false,
                statusCode: 404,
                message: "Category not found"
            }
        }

        return {
            status: true,
            statusCode: 200,
            message: "Marketplace category updated",
            marketplaceCategory
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: message.error
        }
    }
}

const deleteMarketplaceCategoryQuery = async (ids) => {
    try {
        ids = JSON.parse(ids)
        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of category IDs"
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

        const result = await marketplaceCategoryModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} category(s) delete successfully`,
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
    createMarketplaceCategoryQuery,
    getMarketplaceCategoryListQuery,
    editMarketplaceCategoryQuery,
    deleteMarketplaceCategoryQuery
}
