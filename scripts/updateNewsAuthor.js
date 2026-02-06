const { default: mongoose } = require("mongoose");
const { default: newsModel } = require("../models/newsModel/news.model");


const MONGO_URI = "mongodb+srv://sumangal_db_user:cwLb66XV6CjgOIir@cluster0.ljbwqus.mongodb.net/"

const updateNewsAuthor = async (createdBy) => {
    try {

        const result = await newsModel.updateMany(
            {}, // match ALL news documents
            {
                $set: {
                    createdBy: new mongoose.Types.ObjectId(createdBy),
                },
            }
        );

        return {
            status: true,
            statusCode: 200,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            message: "All news documents updated with createdBy",
        };


    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: err.message
        }
    }
}

// 🧩 Run Migration
const runMigration = async () => {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected.");

        const createdBy = "6985f8282f97eb9f35b41431"; // Admin ID
        const result = await updateNewsAuthor(createdBy);
        console.log(result);

        console.log("🔒 Closing MongoDB connection...");
        await mongoose.connection.close();
        console.log("✅ Migration finished successfully.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
        await mongoose.connection.close();
    }
};

runMigration();