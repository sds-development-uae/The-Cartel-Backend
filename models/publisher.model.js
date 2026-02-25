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
    },

    profilePhoto: { type: String, default: null },
    profileName: { type: String, default: null },
    profileDescription: { type: String, default: "Not Provided" },
    pageViews: { type: Number, default: null, index: true },
    subscribers: { type: Number, default: null },
    topGEO: [{ type: String, default: [] }],
    price: { type: Number, default: null, index: true },
    language: [{ type: String, default: [] }],
    country: { type: String, default: "Not Provided" },
    marketplaceCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceCategorySchema", default: [] }],
    niches: [{ type: mongoose.Schema.Types.ObjectId, ref: "NichesSchema", default: [] }],
    membershipType: { type: String, default: null }

}, { timestamps: true });


PublisherSchema.plugin(mongoosePaginate)
PublisherSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Publisher', PublisherSchema)