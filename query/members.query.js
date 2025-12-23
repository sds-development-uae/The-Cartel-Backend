const membersModel = require("../models/members.model");
const planModel = require("../models/plan.model");
const { sendNewMemberMail } = require("../services/mailService");

const createMembersQuery = async (details) => {
    try {
        console.log("📩 Incoming registration:", details);
        const { email, telegramUsername, tradingExperience, plan } = details;

        const isPlan = await planModel.findById(plan);
        if (!isPlan) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid plan selected"
            };
        }

        const existingUser = await membersModel.findOne({ email });
        if (existingUser) {
            return {
                status: false,
                statusCode: 400,
                message: "Member already present"
            };
        }

        const user = await membersModel.create({
            email,
            telegramUsername,
            tradingExperience,
            plan: isPlan._id
        });

        // Populate plan for email
        const populatedUser = await membersModel.findById(user._id).populate("plan");

        // Send mail BEFORE returning response
        try {
            await sendNewMemberMail(populatedUser);
        } catch (mailErr) {
            console.error("⚠️ Failed to send mail:", mailErr.message);
        }

        return {
            status: true,
            statusCode: 201,
            message: "Member Registered",
            user
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};



const getMembersQuery = async (page, limit) => {
    try {

        const options = {
            page: page,
            limit: limit,
            populate: {
                path: "plan",
                select: "name price oldPrice duration isBestValue"
            },
            sort: { createdAt: -1 }
        }


        const members = await membersModel.paginate({}, options)
        console.log(members)
        return {
            status: true,
            statusCode: 200,
            members
        }

    } catch (error) {
        return {
            status: true,
            statusCode: 500,
            message: error.message
        }
    }
}


const deleteMembersQuery = async (ids) => {
    try {
        console.log({ ids })
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

        const result = await membersModel.deleteMany({ _id: { $in: ids } })

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} member(s) delete successfully`,
            deletedCount: result.deletedCount
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            error: error.message
        }
    }
}


module.exports = {
    createMembersQuery,
    getMembersQuery,
    deleteMembersQuery
}