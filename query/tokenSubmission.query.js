const { tokenSubmissionTemplate } = require("../emailTemplate/tokenSubmissionMail");
const tokenSubmissionModel = require("../models/tokenSubmission.model");
const { sendMail } = require("../services/sendMail");



const createTokenSubmissionQuery = async (details) => {
    try {
        console.log(details)

        const createTokenSubmission = await tokenSubmissionModel.create(details)

        // ✅ Send admin notification
        await sendMail({
            to: process.env.ADMIN_EMAIL_OG,
            subject: `🚀 New Token Submission: ${details.tokenName}`,
            html: tokenSubmissionTemplate(createTokenSubmission),
        });


        return {
            status: true,
            statusCode: 200,
            message: "Token submission received successfully.",
            createTokenSubmission
        }


    } catch (error) {
        console.log(error)
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getTokenSubmissionQuery = async (page, limit) => {
    try {

        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: { path: "actionTakenBy", select: "email" }
        }


        const submissions = await tokenSubmissionModel.paginate({}, options)

        return {
            status: true,
            statusCode: 200,
            submissions
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const updateTokenSubmissionsQuery = async (details) => {
    try {
        console.log(details)

        const token = await tokenSubmissionModel.findByIdAndUpdate(details._id, details, { new: true, runValidators: true })

        if (!token) {
            return {
                status: false,
                statusCode: 404,
                message: "Token submission not found"
            }
        }

        return {
            status: true,
            statusCode: 200,
            message: "Updated Token Submission",
            token
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const deleteTokenSubmissionQuery = async (ids) => {
    try {

        console.log({ ids })
        ids = JSON.parse(ids)

        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of tokens submission id"
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

        const result = await tokenSubmissionModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} token submission(s) delete successfully`,
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
    createTokenSubmissionQuery,
    getTokenSubmissionQuery,
    updateTokenSubmissionsQuery,
    deleteTokenSubmissionQuery
}