const { default: mongoose } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mongoosePaginate = require("mongoose-paginate-v2")



const planSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    oldPrice: { type: String },
    duration: { type: String },
    isBestValue: { type: Boolean, default: false }
}, { timestamps: true })


planSchema.plugin(aggregatePaginate)
planSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Plan", planSchema)