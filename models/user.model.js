const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")


const profileLinkSchema = new mongoose.Schema(
    {
        platform: {
            type: String,
            enum: [
                "youtube",
                "linkedin",
                "instagram",
                "telegram",
                "twitter",
                "facebook",
                "website",
                "other",
            ],
            required: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false }
);



const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    registrationType: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpires: { type: Date },
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true, default: [] }],
    refreshToken: { type: String, default: null }, // NEW FIELD
    fullName: { type: String, default: null },
    country: { type: String, default: null },
    countryCode: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    isPublisherFormSubmitted: { type: Boolean, default: false },

    profileLinks: { type: [profileLinkSchema], default: [] },
    profileImage: { type: String, default: null },
    isUserActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

userSchema.plugin(aggregatePaginate)
userSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', userSchema);
