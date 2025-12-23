const { consultationTemplate } = require("../emailTemplate/consultationMailTemplate");
const { default: consultationModel } = require("../models/consultation.model");
const { sendMail } = require("../services/sendMail");


const createConsultancyQuery = async (details) => {
    try {
        const { name, email, telegram, topic, message } = details;

        if (!name || !email || !topic) {
            return {
                status: false,
                statusCode: 400,
                message: "Missing required fields (name, email, topic)"
            }
        }

        const consultation = await consultationModel.create({
            name,
            email,
            telegram,
            topic,
            message,
        });

        await sendMail({
            to: process.env.ADMIN_EMAIL_OG,
            subject: `💬 New Consultation Request from ${details.name}`,
            html: consultationTemplate(consultation),
        });

        return {
            status: true,
            statusCode: 201,
            consultation
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}



const getConsultationQuery = async (page, limit) => {
    try {

        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: { path: "actionTakenBy", select: "email" }
        }


        const consultations = await consultationModel.paginate({}, options)

        return {
            status: true,
            statusCode: 200,
            consultations
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}



const updateConsultationQuery = async (details) => {
    try {
        console.log(details)

        const consultation = await consultationModel.findByIdAndUpdate(details._id, details, { new: true, runValidators: true })

        if (!consultation) {
            return {
                status: false,
                statusCode: 404,
                message: "Consultation submission not found"
            }
        }

        return {
            status: true,
            statusCode: 200,
            message: "Updated Consultation Submission",
            consultation
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}



const deleteConsultationQuery = async (ids) => {
    try {

        console.log({ ids })
        ids = JSON.parse(ids)

        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of consultancy submission id"
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

        const result = await consultationModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} consultation submission(s) delete successfully`,
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
    createConsultancyQuery,
    getConsultationQuery,
    deleteConsultationQuery,
    updateConsultationQuery
}