import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2"

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true, index: true },
        description: { type: String, maxlength: 300, default: null },

        // new
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },

        // new
        banner: { type: String, default: null },

        // new 
        metaTitle: { type: String, maxlength: 70, default: null },
        metaDescription: { type: String, maxlength: 160, default: null },

        // new
        isFeatured: { type: Boolean, default: false },

        icon: { type: String, default: null },
        isActive: { type: Boolean, default: true },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// Auto-generate slug
categorySchema.pre("save", function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    next();
});

categorySchema.plugin(aggregatePaginate)
categorySchema.plugin(mongoosePaginate)

export default mongoose.model("Category", categorySchema);
