// ================ PHASE - 2 ===============

import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

const newsSchema = new mongoose.Schema({
    // Basic Metadata
    heading: { type: String, required: true, trim: true },
    subheading: { type: String, trim: true, default: null },
    slug: { type: String, unique: true, index: true },

    // Author
    author: { type: String, default: null },
    authorRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Content
    description: { type: String, required: true },
    excerpt: { type: String, maxlength: 300, default: null },

    // Media
    image: { type: String },
    gallery: [{ type: String }],

    // Categorization
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // optional extra
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    type: { type: String, index: true }, // sports, crypto, politics, world, etc.

    // Publishing
    status: { type: String, enum: ["draft", "review", "published", "archived"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    scheduledAt: Date,
    publishedAt: Date,

    // Editorial
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sourceUrl: { type: String, default: null },
    sourceName: { type: String, default: null },
    credibilityScore: { type: Number, default: 0 },

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,

    // Metrics
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });



// 🧠 Auto-generate SEO slug from heading before saving
newsSchema.pre("save", function (next) {
    if (!this.slug && this.heading) {
        this.slug = this.heading
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
    next();
});

// Plugins
newsSchema.plugin(aggregatePaginate);
newsSchema.plugin(mongoosePaginate);

export default mongoose.model("News", newsSchema);
