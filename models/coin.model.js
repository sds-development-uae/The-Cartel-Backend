// src/models/coin.model.js
const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")

const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // <-- ensures MongoDB unique index
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        maxlength: 10
    },
    logo: { type: String, default: "" },
    launchDate: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", "launched"], default: "upcoming" },
}, { timestamps: true });

// Text index
coinSchema.index({ name: "text", symbol: "text" });

coinSchema.plugin(aggregatePaginate)
coinSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Coin", coinSchema);
