const authRoutes = require("./auth.routes")
const walletRoutes = require("./wallet.routes")
const coinRoutes = require("./coin.routes")
const planRoutes = require("./plan.routes")
const membersRoute = require("./members.routes")
const tokenSubmissionRoutes = require("./tokenSubmission.route")
const cloudionaryRoutes = require("./cloudinary.routes")
const newsRoutes = require("./newsRoutes/news.route")
const likeNewsRoutes = require("./newsRoutes/likeNews.routes")
const categoryRoutes = require("./newsRoutes/category.routes")
const tagRoutes = require("./newsRoutes/tag.routes")
const commentRoutes = require("./newsRoutes/newsComment.routes")
const consultationRoutes = require("./consultation.routes")
const publisherRoutes = require("./publisherRoutes/publisher.routes")

module.exports = {
    authRoutes,
    walletRoutes,
    coinRoutes,
    planRoutes,
    membersRoute,
    newsRoutes,
    likeNewsRoutes,
    commentRoutes,
    categoryRoutes,
    tagRoutes,
    tokenSubmissionRoutes,
    cloudionaryRoutes,
    consultationRoutes,
    publisherRoutes
}