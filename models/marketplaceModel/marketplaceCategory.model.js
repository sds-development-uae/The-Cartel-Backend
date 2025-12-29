const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")


const marketplaceCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceCategorySchema", default: null },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true
    }
)

marketplaceCategorySchema.plugin(mongoosePaginate)
marketplaceCategorySchema.plugin(aggregatePaginate)

module.exports = mongoose.model("MarketplaceCategorySchema", marketplaceCategorySchema)