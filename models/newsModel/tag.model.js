import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true, index: true },
        usageCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Auto-generate slug
tagSchema.pre("save", function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    next();
});

export default mongoose.model("Tag", tagSchema);
