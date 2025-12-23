const publisherModel = require("../../models/publisher.model");
const crypto = require("crypto");
const userModel = require("../../models/user.model");
const { sendMail } = require("../../services/sendMail");
const { publisherRequestTemplate, publisherConfirmationTemplate, publisherRejectedEmailTemplate, publisherVerifiedEmailTemplate } = require("../../services/emailTemplates");
const { default: axios } = require("axios");
const cheerio = require("cheerio");

const createPublisherQuery = async (details) => {
    try {

        const { userId } = details;

        // Check for existing publisher
        let publisher = await publisherModel.findOne({ userId });

        if (publisher) {
            return {
                status: false,
                statusCode: 404,
                message: "Publisher already exist"
            };
        }

        // Generate permanent verification token
        const token = crypto.randomBytes(6).toString("hex");

        const newPublisher = await publisherModel.create({
            ...details,
            verificationToken: details.website ? token : "",
        });

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isPublisherFormSubmitted: true } },
            { new: true }
        );

        // Prepare email data
        const emailData = {
            ...details,
            userEmail: updatedUser.email,
            createdAt: new Date(),
        };

        // Send email to Admin
        await sendMail({
            to: process.env.ADMIN_EMAIL_OG,
            subject: `📢 New Publisher Request – ${details.fullName || details.organizationName}`,
            html: publisherRequestTemplate(emailData),
        });

        // Send confirmation to User
        await sendMail({
            to: updatedUser.email,
            subject: "🎉 Your Publisher Request Has Been Submitted",
            html: publisherConfirmationTemplate(details),
        });

        return {
            status: true,
            statusCode: 201,
            message: "Publisher created successfully",
            newPublisher,
            user: updatedUser
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


const getPublisherQuery = async ({ page, limit, accountType, search }) => {
    try {
        let query = {}

        // Search by fullName or organizationName
        if (search && search.trim() !== "") {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { organizationName: { $regex: search, $options: "i" } },
            ]
        }

        if (accountType !== "all") {
            query.accountType = accountType
        }

        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: [
                { path: "actionTakenBy", select: "email" },
                { path: "userId", select: "email fullName" },
            ]
        }

        const publihsers = await publisherModel.paginate(query, options)

        return {
            status: true,
            statusCode: 200,
            publihsers
        }

    } catch (error) {
        return {
            status: true,
            statusCode: 200,
            message: error.message
        }
    }
}

const updatePublisherQuery = async (details) => {
    try {
        const { _id, verificationStatus, actionNote } = details;

        // STEP 1: Update publisher entry
        const publisher = await publisherModel.findByIdAndUpdate(
            _id,
            details,
            { new: true, runValidators: true }
        );

        if (!publisher) {
            return {
                status: false,
                statusCode: 404,
                message: "Publisher request not found"
            };
        }

        // STEP 2: Fetch user details
        const user = await userModel.findById(publisher.userId);
        if (!user) {
            return {
                status: false,
                statusCode: 404,
                message: "User not found for this publisher entry"
            };
        }

        // -----------------------------
        // CASE 1 → VERIFIED
        // -----------------------------
        if (verificationStatus === "verified") {
            const html = publisherVerifiedEmailTemplate({
                userName: user.fullName || "User",
                website: publisher.website,
                reason: actionNote || "Your website has been successfully verified.",
            });

            await sendMail({
                to: user.email,
                subject: "Publisher Website Verified Successfully",
                html,
            });

            return {
                status: true,
                statusCode: 200,
                message: "Publisher verified & user notified",
                publisher
            };
        }

        // -----------------------------
        // CASE 2 → REJECTED
        // -----------------------------
        if (verificationStatus === "rejected") {

            const html = publisherRejectedEmailTemplate({
                userName: user.fullName || "User",
                website: publisher.website,
                reason: actionNote || "Your website does not meet our publisher guidelines.",
            });

            await sendMail({
                to: user.email,
                subject: "Publisher Website Verification – Rejected",
                html,
            });

            // Delete publisher entry
            await publisherModel.findByIdAndDelete(_id);

            // Allow resubmission
            await userModel.findByIdAndUpdate(user._id, {
                $set: { isPublisherFormSubmitted: false }
            });

            return {
                status: true,
                statusCode: 200,
                message: "Publisher rejected. User notified & entry deleted.",
            };
        }

        // -----------------------------
        // CASE 3 → PENDING / ANY OTHER STATUS
        // -----------------------------
        return {
            status: true,
            statusCode: 200,
            message: "Publisher updated successfully",
            publisher
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const deletePublisherQuery = async (ids) => {
    try {
        console.log({ ids })
        ids = JSON.parse(ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of publisher submission id"
            };
        }

        // Validate MongoDB ObjectIds
        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDB ObjectId(s)",
                inValidIds
            };
        }

        // STEP 2: Delete publishers
        const result = await publisherModel.deleteMany({ _id: { $in: ids } });

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} publisher submission(s) deleted successfully`,
            deletedCount: result.deletedCount,
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


const verifyWebsiteByMetaQuery = async (details) => {
    try {

        const { website, userId } = details

        const record = await publisherModel.findOne({ website, userId })

        if (!record) {
            return {
                status: false,
                statusCode: 404,
                message: "No record found"
            }
        }

        const token = record.verificationToken;

        const response = await axios.get(website);

        const $ = cheerio.load(response.data);

        const meta = $('meta[name="the-coin-cartel"]').attr('content');

        const isVerified = meta === token;

        if (isVerified) {
            record.isWebsiteVerified = true
            await record.save()
        }

        return {
            status: isVerified,
            statusCode: 200,
            message: isVerified ? "website is verified" : "Meta tag not found or incorrect",
            token,
            meta
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
    createPublisherQuery,
    getPublisherQuery,
    updatePublisherQuery,
    deletePublisherQuery,
    verifyWebsiteByMetaQuery
};