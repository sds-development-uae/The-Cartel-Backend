import mongoose from "mongoose";

const newsLikeSchema = new mongoose.Schema(
    {
        newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        anonymousId: { type: String, default: null },
        userAgent: { type: String },
    },
    { timestamps: true }
);

// Unique index for logged-in users
newsLikeSchema.index(
    { newsId: 1, userId: 1 },
    { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } }
);

// Unique index for anonymous users
newsLikeSchema.index(
    { newsId: 1, anonymousId: 1 },
    { unique: true, partialFilterExpression: { anonymousId: { $exists: true, $ne: null } } }
);

export default mongoose.model("NewsLike", newsLikeSchema);