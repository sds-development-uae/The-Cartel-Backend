// controllers/cloudinary.controller.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const generateSignature = async (req, res) => {
    try {
        const { name, type } = req.body;
        const timestamp = Math.round(new Date().getTime() / 1000);

        const folder = `token-submission/${name}`;
        const public_id = type;

        const paramsToSign = {
            timestamp,
            folder,
            overwrite: true,
            public_id,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate signature" });
    }
};



const generateSignatureForUploadPhotos = async (req, res) => {
    try {
        const { type } = req.body;
        const timestamp = Math.round(new Date().getTime() / 1000);

        const folder = `news`;
        const public_id = `${folder}/${type}`;

        const paramsToSign = {
            timestamp,
            folder,
            overwrite: true,
            public_id,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate signature" });
    }
};

const generateSignatureForPublisherPhotos = async (req, res) => {
    try {
        const { publisherId } = req.body;

        if (!publisherId) {
            return res.status(400).json({ error: "publisherId is required" });
        }

        const timestamp = Math.round(Date.now() / 1000);

        const folder = "publisher_photos";
        const public_id = publisherId; // ONE IMAGE PER PUBLISHER

        const paramsToSign = {
            timestamp,
            folder,
            public_id,
            overwrite: true,
            invalidate: true,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            public_id,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate signature" });
    }
};



module.exports = { generateSignature, generateSignatureForUploadPhotos, generateSignatureForPublisherPhotos };
