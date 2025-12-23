const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const PublisherSchema = new mongoose.Schema({
    accountType: { type: String, required: true },
    fullName: { type: String, required: true },
    organizationName: { type: String, default: "Not provided" },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    telegramUsername: { type: String, default: "Not provided" },
    profileLink: { type: String, default: "Not provided" },
    website: { type: String, default: "Not provided" },
    publisherInfo: { type: String, default: "Not provided" },
    verificationToken: { type: String, default: "Not provided" },
    verificationStatus: { type: String, enum: ["pending", "verified", "rejected", "hold", "pause"], default: "pending" },
    isWebsiteVerified: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actionTakenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actionNote: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });


PublisherSchema.plugin(mongoosePaginate)
PublisherSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Publisher', PublisherSchema)