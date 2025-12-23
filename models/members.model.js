const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")


const memberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    telegramUsername: { type: String, required: true },
    tradingExperience: {
        type: String,
        enum: ["Beginner", "Experienced", "Professional"],
        required: true
    },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
}, { timestamps: true });

memberSchema.plugin(aggregatePaginate)
memberSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Member", memberSchema);
