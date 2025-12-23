
const { default: newsCommentModel } = require("../../models/newsModel/newsComment.model")
const { default: newsModel } = require("../../models/newsModel/news.model");
const { syncNewsComment } = require("../../firebase/newsCommentSync.firebase");

const addCommentQuery = async (details) => {
    try {
        const { newsId, commentText, anonymousId, parentCommentId } = details;
        const userId = details.user?._id || null;

        if (!newsId || !commentText) {
            return {
                status: true,
                statusCode: 400,
                message: "Missing fields"
            }
        }

        const comment = await newsCommentModel.create({
            newsId,
            userId,
            anonymousId,
            commentText,
            parentCommentId: parentCommentId || null,
        });

        // Optionally update total comments count in News model
        await newsModel.findByIdAndUpdate(newsId, { $inc: { commentsCount: 1 } });

        await syncNewsComment(newsId, comment)

        return {
            status: true,
            statusCode: 201,
            comment
        }

    } catch (error) {
        console.error("🔥 Add comment error:", error);
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
};


module.exports = {
    addCommentQuery
}