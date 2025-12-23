const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")


const tokenSubmissionSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ["individual", "organization"],
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    telegram: {
        type: String,
        trim: true,
    },
    tokenName: {
        type: String,
        required: true,
        trim: true,
    },
    tokenSymbol: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        trim: true,
    },
    pdfFileUrl: {
        type: String, // This will store uploaded file path or Cloud URL
    },
    plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
    },
    status: {
        type: String,
        enum: ["pending", "verified", "published", "rejected"],
        default: "pending",
    },
    actionTakenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    remarks: {
        type: String,
        default: null
    },
    isMember: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


tokenSubmissionSchema.plugin(aggregatePaginate)
tokenSubmissionSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("TokenSubmission", tokenSubmissionSchema);
