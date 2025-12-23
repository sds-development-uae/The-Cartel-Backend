import mongoose from "mongoose";

const newsCommentSchema = new mongoose.Schema(
    {
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "News",
            required: true,
            index: true,
        },

        // 👤 Either a logged-in user OR anonymous visitor
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        anonymousId: {
            type: String,
            default: null,
            index: true,
        },

        // 🗣 Comment content
        commentText: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // 💬 Threading support (for replies)
        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NewsComment",
            default: null,
            index: true,
        },

        // ✨ Optional metadata
        likesCount: { type: Number, default: 0 },
        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },

        // 🔒 Moderation
        status: {
            type: String,
            enum: ["visible", "hidden", "flagged"],
            default: "visible",
        },

    },
    { timestamps: true }
);

// 🧠 Index optimization
newsCommentSchema.index({ newsId: 1, parentCommentId: 1 });

// 🚀 Optional plugin if you paginate comments
// import mongoosePaginate from "mongoose-paginate-v2";
// newsCommentSchema.plugin(mongoosePaginate);

export default mongoose.model("NewsComment", newsCommentSchema);
