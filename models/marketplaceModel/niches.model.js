const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")


const nichesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true
    }
)

nichesSchema.plugin(mongoosePaginate)
nichesSchema.plugin(aggregatePaginate)

module.exports = mongoose.model("NichesSchema", nichesSchema)