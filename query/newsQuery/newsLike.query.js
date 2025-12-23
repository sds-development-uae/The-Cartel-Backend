const { syncNewsLikeCount } = require("../../firebase/newsLikeSync.firebase");
const { default: newsModel } = require("../../models/newsModel/news.model");
const { default: newsLikeModel } = require("../../models/newsModel/newsLike.model");

// newsLikeModel schema should include: newsId, userId (optional), anonymousId (optional), userAgent, createdAt
const likeNewsQuery = async (details) => {
    try {
        const newsId = details.body.newsId;
        const userId = details.user?._id; // Logged-in user
        const anonymousId = details.body.anonymousId; // From cookie or localStorage
        const userAgent = details.get("user-agent");

        if (!newsId) {
            return { status: false, statusCode: 400, message: "newsId is required" };
        }

        let existingNews = await newsModel.findOne({ _id: newsId })


        // Build proper query
        const query = { newsId };
        if (userId) query.userId = userId;
        else if (anonymousId) query.anonymousId = anonymousId;
        console.log({ query })

        const existing = await newsLikeModel.findOne(query);
        console.log({ existing })
        let liked = true;
        if (existing) {
            // Remove like
            await newsLikeModel.deleteOne({ _id: existing._id });
            liked = false;
        } else {
            // Add new like
            await newsLikeModel.create({ newsId, userId, anonymousId, userAgent });
        }

        // Count total likes
        const likeCount = await newsLikeModel.countDocuments({ newsId });
        console.log({ likeCount })

        existingNews.likesCount = likeCount;
        await existingNews.save()

        syncNewsLikeCount(newsId, likeCount).catch(err =>
            console.log("Firebase mews like sync failed", err)
        )

        return { status: true, statusCode: 200, liked, likeCount };
    } catch (error) {
        console.error("likeNewsQuery error:", error);
        return { status: false, statusCode: 500, message: error.message };
    }
};


const getLikeNewsQuery = async (details) => {
    try {
        const { newsId } = details.params;
        const count = await newsLikeModel.countDocuments({ newsId })
        return {
            status: true,
            statusCode: 200,
            count
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = {
    likeNewsQuery,
    getLikeNewsQuery
}