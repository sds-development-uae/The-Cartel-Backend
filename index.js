const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const fileUpload = require("express-fileupload")

const { app_configuration } = require("./config/app.config")
const connect_mongodb = require("./connections/mongo.connection")
const { authRoutes, walletRoutes, coinRoutes, planRoutes, membersRoute, newsRoutes, likeNewsRoutes, tokenSubmissionRoutes, cloudionaryRoutes, categoryRoutes, tagRoutes, commentRoutes, consultationRoutes, publisherRoutes, newsUpdateRoutes } = require("./routes")
const cookieParser = require("cookie-parser")

function setupMiddleware(app) {
    dotenv.config()
    app.use(express.json({ limit: "1024mb" }))
    app.use(cors({ origin: true, credentials: true }))
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }));

}

function setupRoutes(app) {
    app.use("/auth", authRoutes);
    app.use("/wallet", walletRoutes);
    app.use("/coins", coinRoutes);
    app.use("/plans", planRoutes);
    app.use("/member", membersRoute);
    app.use("/news", newsRoutes)
    app.use("/category", categoryRoutes)
    app.use("/tag", tagRoutes)
    app.use("/news/like", likeNewsRoutes);
    app.use("/news/comment", commentRoutes);
    app.use("/token-submission", tokenSubmissionRoutes)
    app.use("/consultation", consultationRoutes)
    app.use("/publisher", publisherRoutes)
    app.use("/news-update", newsUpdateRoutes)

    app.use("/cloudionary", cloudionaryRoutes)


    app.get("/", (req, res) => {
        return res.send({
            status: true,
            message: `${app_configuration.APP_NAME} Backend is running`,
            version: '2.0.0.0',
            date: "24th Dec 2025"
        })
    })
}


const app = express()
setupMiddleware(app)
setupRoutes(app)

connect_mongodb().then(() => {
    app.listen(app_configuration.PORT, () => {
        console.log(`${app_configuration.APP_NAME} Server started at PORT - ${app_configuration.PORT}`)
    })
}).catch(() => {
    console.log('could not start the server')
})
