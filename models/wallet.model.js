const mongoose = require("mongoose")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")


const walletSchema = mongoose.Schema(
    {
        address: { type: String, required: true, unique: true, lowercase: true, trim: true },
        connections: { type: Number, default: 1 },
        firstConnectedAt: { type: Date, default: Date.now },
        lastConnectedAt: { type: Date, default: Date.now },
        walletType: { type: String },    // e.g., "MetaMask"
    }
)

walletSchema.plugin(aggregatePaginate)
walletSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("wallet", walletSchema)