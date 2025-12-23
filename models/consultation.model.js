import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";


const consultationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        telegram: {
            type: String,
            trim: true,
            default: null,
        },
        topic: {
            type: String,
            required: [true, "Topic is required"],
            enum: ["token-launch", "marketing", "listing", "general"],
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },

        // 🟢 New fields for admin control
        status: {
            type: String,
            enum: ["pending", "not-contacted", "contacted", "in-progress", "resolved"],
            default: "pending",
        },
        actionTakenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // reference to your Admin/User model
            default: null,
        },
        actionNote: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


consultationSchema.plugin(aggregatePaginate)
consultationSchema.plugin(mongoosePaginate)

export default mongoose.model("Consultation", consultationSchema);
